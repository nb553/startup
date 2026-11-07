export const householdMembers = [
  { name: 'Dad', severe: ['paprika', 'bell peppers'], caution: [] },
  { name: 'Joe', severe: ['carrots'], caution: ['whole milk', 'dairy', 'lactose'] },
  { name: 'Mom', severe: [], caution: ['whole milk', 'dairy', 'lactose'] },
  { name: 'Abigail', severe: [], caution: [] },
  { name: 'Toby', severe: ['cherries'], caution: [] },
  { name: 'Natasha', severe: ['peanuts', 'tree nuts', 'legumes', 'chocolate', 'carrots', 'chicken'], caution: [] },
];

export const ingredientKnowledge = {
  "mama sita's menudo mix": {
    what: 'Filipino menudo seasoning mix',
    contains: ['paprika'],
    nutritionPerServing: { calories: 40, sodiumMg: 380, sugarG: 0, fiberG: 0, proteinG: 1, fatG: 0 },
  },
  'ground beef': {
    what: 'Cooked ground beef',
    nutritionPerServing: { calories: 215, sodiumMg: 75, sugarG: 0, fiberG: 0, proteinG: 22, fatG: 14 },
  },
  onion: {
    what: 'Onion',
    nutritionPerServing: { calories: 10, sodiumMg: 4, sugarG: 1, fiberG: 0.5, proteinG: 0, fatG: 0 },
  },
  garlic: {
    what: 'Garlic',
    nutritionPerServing: { calories: 4, sodiumMg: 1, sugarG: 0, fiberG: 0, proteinG: 0, fatG: 0 },
  },
  carrots: {
    what: 'Carrots',
    nutritionPerServing: { calories: 25, sodiumMg: 35, sugarG: 3, fiberG: 2, proteinG: 1, fatG: 0 },
  },
  peas: {
    what: 'Green peas',
    partOf: ['legumes'],
    nutritionPerServing: { calories: 30, sodiumMg: 70, sugarG: 2, fiberG: 2, proteinG: 2, fatG: 0 },
  },
  'heavy cream': {
    what: 'Cream',
    partOf: ['dairy'],
    nutritionPerServing: { calories: 100, sodiumMg: 10, sugarG: 1, fiberG: 0, proteinG: 1, fatG: 11 },
  },
  'whole milk': {
    what: 'Cow milk',
    partOf: ['dairy', 'lactose'],
    nutritionPerServing: { calories: 60, sodiumMg: 40, sugarG: 5, fiberG: 0, proteinG: 3, fatG: 2.5 },
  },
  sugar: {
    what: 'Sugar',
    nutritionPerServing: { calories: 50, sodiumMg: 0, sugarG: 13, fiberG: 0, proteinG: 0, fatG: 0 },
  },
  'vanilla extract': {
    what: 'Flavoring made from vanilla beans in alcohol',
    partOf: ['legumes'],
    nutritionPerServing: { calories: 10, sodiumMg: 1, sugarG: 0.5, fiberG: 0, proteinG: 0, fatG: 0 },
  },
  flour: {
    what: 'Wheat flour',
    nutritionPerServing: { calories: 100, sodiumMg: 1, sugarG: 0, fiberG: 1, proteinG: 3, fatG: 0 },
  },
  peanuts: {
    what: 'Peanuts',
    partOf: ['legumes'],
    nutritionPerServing: { calories: 160, sodiumMg: 5, sugarG: 1, fiberG: 2, proteinG: 7, fatG: 14 },
  },
  'tree nuts': {
    what: 'Tree nuts such as almonds, walnuts, or cashews',
    nutritionPerServing: { calories: 170, sodiumMg: 1, sugarG: 1, fiberG: 2, proteinG: 5, fatG: 16 },
  },
  chicken: {
    what: 'Chicken',
    nutritionPerServing: { calories: 230, sodiumMg: 60, sugarG: 0, fiberG: 0, proteinG: 26, fatG: 13 },
  },
  chocolate: {
    what: 'Chocolate / cacao',
    nutritionPerServing: { calories: 150, sodiumMg: 5, sugarG: 13, fiberG: 2, proteinG: 2, fatG: 9 },
  },
  cherries: {
    what: 'Cherries',
    nutritionPerServing: { calories: 18, sodiumMg: 1, sugarG: 3, fiberG: 1, proteinG: 0, fatG: 0 },
  },
  paprika: {
    what: 'Spice made from dried red peppers',
    nutritionPerServing: { calories: 6, sodiumMg: 1, sugarG: 0, fiberG: 1, proteinG: 0, fatG: 0 },
  },
  'bell peppers': {
    what: 'Bell peppers',
    nutritionPerServing: { calories: 6, sodiumMg: 1, sugarG: 1, fiberG: 0.5, proteinG: 0, fatG: 0 },
  },
  'seasoned beef': { what: 'Beef with taco seasoning' },
  'iceberg lettuce': { what: 'Lettuce' },
  'cheddar cheese': { what: 'Cheese', partOf: ['dairy'] },
  'crunchy taco shell': { what: 'Fried corn tortilla shell' },
  'natural flavouring': {
    what: 'Flavoring taken from plant or animal source material (fruit, spice, herb, dairy, meat). The label does not say which source.',
  },
  'artificial flavouring': {
    what: 'Flavoring produced by chemical synthesis rather than taken from a natural source. The label does not say what it contains.',
  },
  'flavouring': {
    what: 'Added flavoring. The label does not say whether it is natural or artificial, or what it came from.',
  },
  'natural flavoring': {
    what: 'Flavoring taken from plant or animal source material (fruit, spice, herb, dairy, meat). The label does not say which source.',
  },
  'artificial flavoring': {
    what: 'Flavoring produced by chemical synthesis rather than taken from a natural source. The label does not say what it contains.',
  },
  'flavoring': {
    what: 'Added flavoring. The label does not say whether it is natural or artificial, or what it came from.',
  },
};

// Branded / packaged foods. Hard-coded mock API responses for now;
// the Service deliverable replaces them with a real API call that
// returns this same shape.
export const brandedFoods = {
  'taco bell crunchy taco': {
    displayName: 'Taco Bell Crunchy Taco',
    serving: '1 taco',
    ingredients: ['seasoned beef', 'iceberg lettuce', 'cheddar cheese', 'crunchy taco shell'],
    nutritionPerServing: { calories: 170, sodiumMg: 340, sugarG: 1, fiberG: 3, proteinG: 8, fatG: 9 },
  },
};

// Calculates combined nutrition totals for a list of ingredient line
// strings, and counts how many weren't found in ingredientKnowledge.
// Pulled out of the Dashboard component so it stays focused on UI.
export function calculateNutritionTotals(lines) {
  const totals = { calories: 0, sodiumMg: 0, sugarG: 0, fiberG: 0, proteinG: 0, fatG: 0 };
  let unknownCount = 0;

  for (const line of lines) {
    const entry = ingredientKnowledge[line.trim().toLowerCase()];
    if (entry && entry.nutritionPerServing) {
      for (const key of Object.keys(totals)) {
        totals[key] += entry.nutritionPerServing[key] || 0;
      }
    } else {
      unknownCount += 1;
    }
  }

  return { totals, unknownCount };
}

// Natasha's allergy terms, expanded to the words those allergens
// actually appear under in outside data. This is her household data
// defining its own terms — the same kind of declaration as the
// vanilla-extract partOf rule in the knowledge entries above.
const termExpansions = {
  legumes: ['soybeans', 'soybean', 'soya', 'soy'],
  chocolate: ['cocoa', 'cacao'],
};

// Label words that name an unspecified mixture. Anything could be
// hiding in them, so they check-flag every member with a severe
// allergy instead of passing silently.
const vagueTerms = [
  'vegetable oil', 'spice', 'spices', 'flavouring', 'flavoring',
  'flavours', 'flavors', 'natural flavouring', 'artificial flavouring',
  'natural flavoring', 'artificial flavoring', 'seasoning', 'seasonings',
];

export function getIngredientFlags(rawName, extra = {}) {
  const key = rawName.trim().toLowerCase();
  let matchedKey = ingredientKnowledge[key] ? key : null;
  if (!matchedKey) {
    const candidates = Object.keys(ingredientKnowledge).filter(
      (k) => key.includes(k) || k.includes(key)
    );
    candidates.sort((a, b) => b.length - a.length);
    matchedKey = candidates[0] || null;
  }
  const entry = matchedKey ? ingredientKnowledge[matchedKey] : null;

  const ancestors = (extra.ancestors || []).map((a) => a.toLowerCase());
  const strongKeys = [key, ...ancestors];
  if (matchedKey) strongKeys.push(matchedKey);
  if (entry) strongKeys.push(...(entry.partOf || []), ...(entry.contains || []));
  const texts = [key, ...ancestors];
  for (const member of householdMembers) {
    for (const term of [...member.severe, ...member.caution]) {
      const expanded = termExpansions[term] || [];
      if (
        texts.some((t) => t.includes(term) || term.includes(t)) ||
        expanded.some((w) => texts.some((t) => t.includes(w)))
      ) {
        strongKeys.push(term);
      }
    }
  }
  const norm = (s) => s.replace(/s$/, '');
  const hits = (list) => strongKeys.some((k) => list.some((t) => norm(t) === norm(k)));

  if (entry && entry.match === 'check') {
    return { key, entry, severe: [], caution: [], check: entry.checkFor || [] };
  }
  if (entry && entry.match === 'derived') {
    const check = householdMembers
      .filter((m) => hits(m.severe) || hits(m.caution))
      .map((m) => m.name);
    return { key, entry, severe: [], caution: [], check };
  }

  const severe = householdMembers.filter((m) => hits(m.severe)).map((m) => m.name);
  const caution = householdMembers.filter((m) => hits(m.caution)).map((m) => m.name);

  const words = (s) =>
    s.toLowerCase().replace(/s\b/g, '').split(/[^a-z]+/).filter((w) => w.length >= 3);
  const looseMatch = (term) => {
    const termWords = words(term);
    return texts.some((k) => {
      const kWords = words(k);
      return termWords.some((w) => kWords.includes(w));
    });
  };
  const checkSet = new Set();
  const isVague = vagueTerms.some((v) => key === v || key.startsWith(v));
  for (const member of householdMembers) {
    if (severe.includes(member.name) || caution.includes(member.name)) continue;
    const memberTerms = [...member.severe, ...member.caution];
    if (memberTerms.some((t) => looseMatch(t))) checkSet.add(member.name);
    if ((extra.hiddenTerms || []).some((t) => memberTerms.includes(t))) checkSet.add(member.name);
    if (isVague && member.severe.length > 0) checkSet.add(member.name);
  }

  return { key, entry, severe, caution, check: [...checkSet] };
}

