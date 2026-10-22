import React, { useState } from 'react';
import { brandedFoods, getIngredientFlags } from '../shared/ingredientKnowledge';

export function Lookup() {
  const [query, setQuery] = useState('');
  const [result, setResult] = useState(null);
  const [message, setMessage] = useState('');
  const [photoName, setPhotoName] = useState('');
  const [isScanning, setIsScanning] = useState(false);

  function findFood(text) {
    const key = text.trim().toLowerCase();
    if (brandedFoods[key]) return brandedFoods[key];
    return (
      Object.values(brandedFoods).find((food) => food.displayName.toLowerCase().includes(key)) || null
    );
  }

  function handleSearch(e) {
    e.preventDefault();
    if (!query.trim()) return;

    // Mocked food API: branded foods come from the shared brandedFoods
    // data for now. A real nutrition API replaces this lookup in the
    // Service deliverable.
    const food = findFood(query);
    if (food) {
      setResult(food);
      setMessage('');
    } else {
      setResult(null);
      setMessage(
        `"${query}" isn't in our food data yet. Branded foods will be pulled from a nutrition API in a later deliverable.`
      );
    }
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
    ? result.ingredients.map((name) => ({ name, flags: getIngredientFlags(name) }))
    : [];
  const severeNames = [...new Set(allFlags.flatMap((f) => f.flags.severe))];
  const cautionNames = [...new Set(allFlags.flatMap((f) => f.flags.caution))];
  const checkNames = [...new Set(allFlags.flatMap((f) => f.flags.check))];
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
            <button type="submit" className="btn-primary self-start">Search</button>
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
                {allFlags.map(({ name, flags }) => (
                  <tr key={name} className="border-b border-[var(--navy)]/10">
                    <td className="py-1">{name}</td>
                    <td className="py-1">
                      {flags.entry ? flags.entry.what : 'Not in our ingredient knowledge yet'}
                      {flags.entry && flags.entry.partOf && <> &mdash; part of: {flags.entry.partOf.join(', ')}</>}
                      {flags.entry && flags.entry.contains && <> &mdash; contains: {flags.entry.contains.join(', ')}</>}
                    </td>
                    <td className="py-1">
                      {flags.severe.length > 0 ? (
                        <span className="flagged">Severe allergy &mdash; {flags.severe.join(', ')}</span>
                      ) : flags.caution.length > 0 ? (
                        <span className="flagged-caution">Intolerance &mdash; {flags.caution.join(', ')}</span>
                      ) : flags.check.length > 0 ? (
                        <span className="check-source">Check source &mdash; {flags.check.join(', ')}</span>
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
          {checkNames.length > 0 && <p>Check the source for: {checkNames.join(', ')}.</p>}
          {severeNames.length === 0 && cautionNames.length === 0 && checkNames.length === 0 && (
            <p>No household flags for this food.</p>
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