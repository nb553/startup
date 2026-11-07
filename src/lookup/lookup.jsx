import React, { useState } from 'react';
import { brandedFoods, getIngredientFlags, householdMembers } from '../shared/ingredientKnowledge';

// Open Food Facts has two different services we use:
//  - search.openfoodfacts.org: free-text search by name (returns matches in "hits")
//  - world.openfoodfacts.org/api/v2/product: full details for one barcode
// Their /api/v2/search endpoint only supports structured filters and silently
// ignores a typed search, so it can't be used to look a food up by name.
const SEARCH_URL = 'https://search.openfoodfacts.org/search';
const PRODUCT_URL = 'https://world.openfoodfacts.org/api/v2/product';

// Open Food Facts is occasionally flaky, so one retry is built in before
// we report it unavailable. On failure we also report WHY, so the message
// shown (and the browser console) says what actually went wrong.
async function fetchJson(url) {
  let problem = 'unknown error';
  for (let attempt = 0; attempt < 2; attempt++) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 8000);
    try {
      const res = await fetch(url, { signal: controller.signal });
      clearTimeout(timer);
      if (res.ok) return { data: await res.json(), problem: '' };
      problem = `HTTP ${res.status}`;
    } catch (err) {
      clearTimeout(timer);
      problem = err.name === 'AbortError' ? 'request timed out' : `${err.name}: ${err.message}`;
    }
  }
  console.warn('Open Food Facts request failed:', problem, url);
  return { data: null, problem };
}


// A search hit can be an empty placeholder entry (just a name and a barcode),
// so before showing one we check that it has ingredients and nutrition.
function hasUsableData(product) {
  const n = product.nutriments || {};
  const hasNutrition = n['energy-kcal_serving'] !== undefined || n['energy-kcal_100g'] !== undefined;
  return Boolean((product.ingredients_text || '').trim()) && hasNutrition;
}

// Loads full details for up to a few candidate hits, in order, and returns
// the first one that has usable data. Stops early so we make as few calls
// as possible (Open Food Facts rate limits requests).
async function loadFirstUsableProduct(candidates) {
  let problem = '';
  for (const candidate of candidates) {
    const { data, problem: p } = await fetchJson(
      `${PRODUCT_URL}/${candidate.code}.json?fields=product_name,ingredients_text,nutriments,serving_size,allergens_tags,traces_tags,ingredients`
    );
    if (!data || !data.product) {
      problem = p || problem;
      continue;
    }
    if (hasUsableData(data.product)) {
      return { product: data.product, name: candidate.product_name, problem: '' };
    }
  }
  return { product: null, name: '', problem };
}

// E-numbers are the EU's numbering for food additives, grouped by
// job: the hundreds digit says what the chemical is for.
function additiveInfo(name) {
  const m = name.toLowerCase().match(/^e(\d{3,4})[a-z]?$/);
  if (!m) return null;
  const n = parseInt(m[1], 10);
  if (n >= 100 && n < 200) return 'colour';
  if (n >= 200 && n < 300) return 'preservative';
  if (n >= 300 && n < 400) return 'antioxidant / acidity regulator';
  if (n >= 400 && n < 500) return 'thickener / emulsifier / stabiliser';
  if (n >= 500 && n < 600) return 'acidity regulator / anti-caking agent';
  if (n >= 600 && n < 700) return 'flavour enhancer';
  if (n >= 900 && n < 1000) return 'sweetener / glazing agent';
  return 'food additive';
}

// Splits a raw Open Food Facts label into real ingredients plus the
// statement lines that aren't ingredients: "may contain" cross-contact
// warnings and the label's own allergen declarations.
function parseOffLabel(product) {
  let text = product.ingredients_text || '';
  const traces = [];
  const declares = [];

  const addItems = (list, chunk) => {
    chunk
      .split(/,| and /)
      .map((s) => s.trim().replace(/\.$/, ''))
      .filter(Boolean)
      .forEach((item) => list.push(item));
  };

  text = text.replace(/may contain ([^.]*)\.?/gi, (m, chunk) => {
    addItems(traces, chunk);
    return '';
  });

  // Split on commas/semicolons outside parentheses, so
  // "raising agents (500, 503)" stays one ingredient.
  const segments = [];
  let depth = 0;
  let current = '';
  for (const ch of text) {
    if (ch === '(') depth++;
    if (ch === ')') depth = Math.max(0, depth - 1);
    if ((ch === ',' || ch === ';') && depth === 0) {
      segments.push(current);
      current = '';
    } else {
      current += ch;
    }
  }
  segments.push(current);

  const ingredients = [];
  for (const rawSegment of segments) {
    const segment = rawSegment.trim().replace(/\.$/, '');
    if (!segment) continue;
    const lower = segment.toLowerCase();
    if (lower.startsWith('allergen statement')) {
      const after = segment.slice(lower.indexOf('contains') + 'contains'.length).trim().replace(/^:/, '');
      addItems(declares, after);
      continue;
    }
    if (lower.startsWith('best before') || lower.startsWith('use by')) continue;
    if (lower.startsWith('may contain')) {
      addItems(traces, segment.slice('may contain'.length));
      continue;
    }
    ingredients.push(segment);
  }

  for (const tag of product.traces_tags || []) {
    traces.push(tag.replace(/^en:/, '').replace(/-/g, ' '));
  }
  for (const tag of product.allergens_tags || []) {
    declares.push(tag.replace(/^en:/, '').replace(/-/g, ' '));
  }

  return { ingredients, traces: [...new Set(traces)], declares: [...new Set(declares)] };
}


function offToResult(product, fallbackName) {
  const n = product.nutriments || {};
  const perServing = n['energy-kcal_serving'] !== undefined;
  const get = (base) => (perServing ? n[`${base}_serving`] : n[`${base}_100g`]);
  const sodiumG = get('sodium');
  const parsed = parseOffLabel(product);
  const parsedList = (product.ingredients || []).filter((i) => i.id);
  const fromTaxonomy = parsedList.map((i) => i.id.replace(/^en:/, '').replace(/-/g, ' '));
  const ingredients = fromTaxonomy.length > 0 ? fromTaxonomy : parsed.ingredients;
  const ingredientIds =
    fromTaxonomy.length > 0
      ? parsedList.map((i) => i.id)
      : parsed.ingredients.map((name) => `en:${name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`);
  const { traces, declares } = parsed;

  return {
    displayName: (product.product_name || fallbackName).replace(/\[[^\]]*\]/g, '').replace(/\s+/g, ' ').trim(),
    serving: perServing ? (product.serving_size || '1 serving').replace(/\[[^\]]*\]/g, '').trim() : '100g',
    ingredients,
    traces,
    declares,
    ingredientIds,
    nutritionPerServing: {
      sodiumMg: sodiumG !== undefined ? Math.round(sodiumG * 1000) : 0,
      calories: Math.round(get('energy-kcal') || 0),
      sugarG: get('sugars') ?? 0,
      fiberG: get('fiber') ?? 0,
      proteinG: get('proteins') ?? 0,
      fatG: get('fat') ?? 0,
    },
  };
}

function BottomTag({ name, flags }) {
  return (
    <span>
      {name}
      {flags.severe.length > 0 && (
        <> <span className="flagged">Severe allergy — {flags.severe.join(', ')}</span></>
      )}
      {flags.severe.length === 0 && flags.caution.length > 0 && (
        <> <span className="flagged-caution">Intolerance — {flags.caution.join(', ')}</span></>
      )}
      {flags.severe.length === 0 && flags.caution.length === 0 && flags.check.length > 0 && (
        <> <span className="check-source">May hide allergens — {flags.check.join(', ')}</span></>
      )}
    </span>
  );
}


export function Lookup() {
  const [query, setQuery] = useState('');
  const [result, setResult] = useState(null);
  const [message, setMessage] = useState('');
  const [photoName, setPhotoName] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const [isSearching, setIsSearching] = useState(false);

  function findFood(text) {
    const key = text.trim().toLowerCase();
    if (brandedFoods[key]) return brandedFoods[key];
    return (
      Object.values(brandedFoods).find((food) => food.displayName.toLowerCase().includes(key)) || null
    );
  }

  async function handleSearch(e) {
    e.preventDefault();
    if (!query.trim()) return;

    // Local branded foods first: our curated entries answer instantly.
    const local = findFood(query);
    if (local) {
      setResult(local);
      setMessage('');
      return;
    }

    setIsSearching(true);
    setResult(null);
    setMessage('');

    // Step 1: free-text search for the name that was typed.
    const { data: searchData, problem: searchProblem } = await fetchJson(
      `/api/food/search?q=${encodeURIComponent(query.trim())}`
    );

    if (!searchData) {
      setMessage(`"${query}" isn't in our food data yet, and the live lookup is unavailable right now (${searchProblem}).`);
      setIsSearching(false);
      return;
    }

    // Search ranking is loose, so only consider hits whose name actually
    // matches what was typed, then rank them by closeness: exact name
    // first, then shortest name, so the plain product beats variants.
    const q = query.trim().toLowerCase();
    const hits = (searchData.hits || []).filter((h) => h.code && h.product_name);
    const named = hits.filter((h) => h.product_name.toLowerCase().includes(q));
    const loose = hits.filter((h) => h.product_name.toLowerCase().includes(q.split(' ')[0]));
    const pool = (named.length > 0 ? named : loose).slice(0, 5);
    const candidates = [...pool].sort((a, b) => {
      const an = a.product_name.toLowerCase();
      const bn = b.product_name.toLowerCase();
      const aExact = an === q ? 0 : 1;
      const bExact = bn === q ? 0 : 1;
      return aExact - bExact || an.length - bn.length;
    });

    if (candidates.length === 0) {
      setMessage(`"${query}" isn't in our food data yet, and Open Food Facts has no match for it either.`);
      setIsSearching(false);
      return;
    }

    // Step 2: load full ingredients and nutrition, skipping empty entries.
    const { product, name, problem } = await loadFirstUsableProduct(candidates);

    if (product) {
      const base = offToResult(product, name);
      setResult(base);
      setIsSearching(false);
      // The taxonomy breakdown fills in when it returns — it never
      // blocks the result card itself.
      if (base.ingredientIds.length > 0) {
        const terms = [...new Set(householdMembers.flatMap((m) => [...m.severe, ...m.caution]))].join(',');
        const { data: info } = await fetchJson(
          `/api/food/explain?ids=${encodeURIComponent(base.ingredientIds.join(','))}&terms=${encodeURIComponent(terms)}`
        );
        if (info) setResult({ ...base, ingredientInfo: info });
      }
    } else if (problem) {
      setMessage(`Found "${candidates[0].product_name}", but couldn't load its details right now (${problem}).`);
    } else {
      setMessage(`Found matches for "${query}" on Open Food Facts, but none of them have ingredient and nutrition data yet.`);
    }
    setIsSearching(false);
  }


  function handleScan(e) {
    e.preventDefault();
    if (!photoName) {
      setResult(null);
      setMessage('Choose a photo of the label first.');
      return;
    }

    // Mocked label scan: there is no real image reading yet. A short
    // artificial delay stands in for the real network/processing time a
    // future image-recognition API call will actually take.
    setIsScanning(true);
    setResult(null);
    setMessage('');

    setTimeout(() => {
      setResult(brandedFoods['taco bell crunchy taco']);
      setMessage(`Mock scan of ${photoName}: label read as Taco Bell Crunchy Taco.`);
      setIsScanning(false);
    }, 1200);
  }

  const allFlags = result
    ? result.ingredients.map((name, i) => {
        const id = result.ingredientIds ? result.ingredientIds[i] : null;
        const info = id && result.ingredientInfo ? result.ingredientInfo[id] : null;
        const cleaned = info
          ? [...new Set(info.ancestors.map((a) => a.replace(/ and fat$/, '')))].filter(
              (a) => a.toLowerCase() !== name.toLowerCase()
            )
          : [];
        const ancestors = cleaned.filter(
          (a, idx) => !cleaned.slice(0, idx).some((b) => b.toLowerCase().includes(a.toLowerCase()))
        );
        const additive =
          additiveInfo(name) || ancestors.map((a) => additiveInfo(a)).find(Boolean) || null;
        return { name, info, ancestors, additive, flags: getIngredientFlags(name, info || {}) };
      })
    : [];


  const severeNames = [...new Set(allFlags.flatMap((f) => f.flags.severe))];
  const cautionNames = [...new Set(allFlags.flatMap((f) => f.flags.caution))];
  const checkNames = [...new Set(allFlags.flatMap((f) => f.flags.check))];
  const traceFlags = result && result.traces
    ? result.traces.map((name) => ({ name, flags: getIngredientFlags(name) }))
    : [];
  const declareFlags = result && result.declares
    ? result.declares.map((name) => ({ name, flags: getIngredientFlags(name) }))
    : [];
  const colourRows = allFlags.filter((f) => f.additive === 'colour');
  const nutrition = result ? result.nutritionPerServing : null;
  const saltG = nutrition ? ((nutrition.sodiumMg * 2.5) / 1000).toFixed(2) : null;

  return (
    <main className="flex-1 max-w-3xl mx-auto w-full p-4 md:p-8 flex flex-col gap-6">
      <h2 className="text-xl md:text-2xl">Food Lookup</h2>
      <p className="italic">Search a packaged or restaurant food item, or snap a photo of its label if one isn't available.</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <section className="card flex flex-col gap-2">
          <h3 className="font-bold">Search by name</h3>
          <form className="flex flex-col gap-2" onSubmit={handleSearch}>
            <label htmlFor="food-search">Food or restaurant item</label>
            <input
              type="search"
              id="food-search"
              name="foodSearch"
              placeholder="e.g. Taco Bell Crunchy Taco"
              className="form-input"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <button type="submit" className="btn-primary self-start" disabled={isSearching}>
              {isSearching ? 'Searching…' : 'Search'}
            </button>
          </form>
        </section>

        <section className="card flex flex-col gap-2">
          <h3 className="font-bold">Scan a label</h3>
          <form className="flex flex-col gap-2" onSubmit={handleScan}>
            <label htmlFor="label-photo">Take or upload a photo of the packaging</label>
            <input
              type="file"
              id="label-photo"
              name="labelPhoto"
              accept="image/*"
              capture="environment"
              aria-describedby="label-photo-help"
              className="form-input"
              onChange={(e) => setPhotoName(e.target.files[0] ? e.target.files[0].name : '')}
            />
            <p id="label-photo-help" className="text-sm italic">For best results, use a clear, well-lit photo of the full ingredients label.</p>
            <button type="submit" className="btn-secondary self-start" disabled={isScanning}>
              {isScanning ? 'Scanning…' : 'Scan'}
            </button>
          </form>
        </section>
      </div>

      {message && <p className="card">{message}</p>}

      {result && (
        <section className="card flex flex-col gap-3">
          <h3 className="font-bold">Result: {result.displayName} ({result.serving})</h3>
          <div className="table-wrapper">
            <table className="w-full border-collapse text-left">
              <caption className="text-left text-sm italic mb-2">Ingredient safety check for {result.displayName}</caption>
              <thead>
                <tr className="border-b border-[var(--navy)]/20">
                  <th scope="col" className="py-1">Ingredient</th>
                  <th scope="col" className="py-1">What it is</th>
                  <th scope="col" className="py-1">Allergen flag</th>
                </tr>
              </thead>
              <tbody>
                {allFlags.map(({ name, flags, ancestors, additive }) => (
                  <tr key={name} className="border-b border-[var(--navy)]/10">
                    <td className="py-1">{name}</td>
                    <td className="py-1">
                      {flags.entry
                        ? flags.entry.what
                        : additive && additive !== 'colour'
                          ? `Food additive — ${additive}`
                          : ancestors.length > 0
                            ? `Broader group: ${ancestors.slice(0, 2).join(' → ')}`
                            : '—'}
                      {flags.entry && flags.entry.partOf && <> &mdash; part of: {flags.entry.partOf.join(', ')}</>}
                      {flags.entry && flags.entry.contains && <> &mdash; contains: {flags.entry.contains.join(', ')}</>}
                    </td>
                    <td className="py-1">
                      {flags.severe.length > 0 ? (
                        <span className="flagged">Severe allergy &mdash; {flags.severe.join(', ')}</span>
                      ) : flags.caution.length > 0 ? (
                        <span className="flagged-caution">Intolerance &mdash; {flags.caution.join(', ')}</span>
                      ) : flags.check.length > 0 ? (
                        <span className="check-source">May hide allergens &mdash; {flags.check.join(', ')}</span>
                      ) : (
                        'None'
                      )}
                    </td>
                  </tr>
              ))}
              </tbody>
            </table>
          </div>

          {severeNames.length > 0 && <p>Not safe for: {severeNames.join(', ')} (severe allergy).</p>}
          {cautionNames.length > 0 && <p>Intolerance for: {cautionNames.join(', ')}. <span className="substitute">Suggested substitute: remove or swap the intolerance ingredients above.</span></p>}
          {severeNames.length === 0 && cautionNames.length === 0 && checkNames.length === 0 && (
            <p>No household flags for this food.</p>
          )}
          {declareFlags.length > 0 && (
            <p>
              Label declares:{' '}
              {declareFlags.map(({ name, flags }, i) => (
                <span key={name}>
                  {i > 0 && ', '}
                  <BottomTag name={name} flags={flags} />
                </span>
              ))}
            </p>
          )}
          {traceFlags.length > 0 && (
            <p>
              May contain (cross-contact):{' '}
              {traceFlags.map(({ name, flags }, i) => (
                <span key={name}>
                  {i > 0 && ', '}
                  <BottomTag name={name} flags={flags} />
                </span>
              ))}
            </p>
          )}
          {colourRows.length > 0 && (
            <p>
              Colours:{' '}
              {colourRows.map(({ name, flags }, i) => (
                <span key={name}>
                  {i > 0 && ', '}
                  <BottomTag name={name} flags={flags} />
                </span>
              ))}
            </p>
          )}

          <div className="mt-2 pt-2 border-t border-[var(--navy)]/10">
            <p className="font-bold text-sm">Nutrition (per {result.serving})</p>
            <ul className="text-sm list-disc list-inside">
              <li>
                Sodium: <span className="flagged-caution">{nutrition.sodiumMg}mg</span> ({saltG}g salt) &mdash; contributes
                toward Lucy Breen's 2,400mg/day sodium need
              </li>
              <li>
                Calories: <span className="flagged-caution">{nutrition.calories}</span> &mdash;{' '}
                {Math.round((nutrition.calories / 2800) * 100)}% of Abby Wischmeier's ~2,800 kcal/day goal
              </li>
              <li>Sugar: {nutrition.sugarG}g</li>
              <li>Fiber: {nutrition.fiberG}g</li>
              <li>Protein: {nutrition.proteinG}g</li>
              <li>Fat: {nutrition.fatG}g</li>
            </ul>
          </div>
        </section>
      )}
    </main>
  );
}