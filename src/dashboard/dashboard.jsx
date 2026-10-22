import React, { useState, useEffect } from 'react';
import { getIngredientFlags, calculateNutritionTotals } from '../shared/ingredientKnowledge';

// Seed recipes. Ingredients are just names — who they flag is worked
// out from the shared ingredient knowledge when the card renders, so
// the seeds and newly-added recipes are checked the same way.
const initialRecipes = [
  {
    id: 'menudo',
    name: 'Menudo',
    image: '/menudo.png',
    sodium: 810,
    calories: 320,
    extraNutrition: 'Protein: 24g',
    nutritionDetails: null,
    substitutes: [
      'Omit carrots and peas — safe for all household members.',
      "Replace Mama Sita's menudo mix with beef buillion — safe for all household members.",
    ],
    ingredients: ["Mama Sita's Menudo Mix", 'Ground Beef', 'Onion', 'Garlic', 'Carrots', 'Peas'],
  },
  {
    id: 'icecream',
    name: 'Homemade Ice Cream',
    image: '/icecream.png',
    sodium: 40,
    calories: 270,
    extraNutrition: 'Sugar: 22g',
    nutritionDetails: null,
    substitutes: [
      'Replace whole milk with lactaid milk — safe for all household members.',
      'Replace vanilla extract with black sugar syrup — safe for all household members.',
    ],
    ingredients: ['Heavy cream', 'Whole milk', 'Sugar', 'Vanilla extract'],
  },
];

const activityMessagePool = [
  { who: 'Mom', text: 'flagged dairy in a new recipe.' },
  { who: 'Dad', text: 'added a substitute for Menudo.' },
  { who: 'Joe', text: 'voted to keep the lactaid milk substitute.' },
  { who: 'Abigail', text: 'checked a recipe for cherries.' },
  { who: 'Toby', text: 'joined the Burkart Family household.' },
  { who: 'Natasha', text: 'updated her allergen list.' },
];

function RecipeCard({ recipe }) {
  return (
    <article className="card flex flex-col gap-2">
      <h4 className="font-bold">{recipe.name}</h4>
      {recipe.image && <img src={recipe.image} alt={recipe.name} className="rounded w-full h-40 object-cover" />}
      <ul className="list-disc list-inside">
        {recipe.ingredients.map((name, i) => {
          const flags = getIngredientFlags(name);
          const severeFor = flags.severe.join(', ');
          const cautionFor = flags.caution.join(', ');
          const checkFor = flags.check.join(', ');

          return (
            <li key={i}>
              {flags.severe.length > 0 ? (
                <span className="flagged">{name}</span>
              ) : flags.caution.length > 0 ? (
                <span className="flagged-caution">{name}</span>
              ) : flags.check.length > 0 ? (
                <span className="check-source">{name}</span>
              ) : (
                name
              )}
              {severeFor && <> &mdash; severe allergy ({severeFor})</>}
              {cautionFor && <> &mdash; intolerance ({cautionFor})</>}
              {checkFor && <> &mdash; check source ({checkFor})</>}
            </li>
          );
        })}
      </ul>
      {recipe.substitutes.map((text, i) => (
        <p key={i} className="substitute">{text}</p>
      ))}

      <div className="mt-2 pt-2 border-t border-[var(--navy)]/10">
        <p className="font-bold text-sm">Nutrition (per serving)</p>
        <ul className="text-sm list-disc list-inside">
          <li>
            Sodium: <span className="flagged-caution">{recipe.sodium}mg</span> &mdash; contributes toward Lucy Breen's
            2,400mg/day sodium need
          </li>
          <li>Calories: {recipe.calories}</li>
          {recipe.extraNutrition && <li>{recipe.extraNutrition}</li>}
          {recipe.nutritionDetails && (
            <>
              <li>Sugar: {recipe.nutritionDetails.sugarG}g</li>
              <li>Fiber: {recipe.nutritionDetails.fiberG}g</li>
              <li>Protein: {recipe.nutritionDetails.proteinG}g</li>
              <li>Fat: {recipe.nutritionDetails.fatG}g</li>
            </>
          )}
        </ul>
      </div>
    </article>
  );
}

export function Dashboard({ userName }) {
  const [recipes, setRecipes] = useState(() => {
  try {
    const saved = localStorage.getItem('recipes');
    return saved ? JSON.parse(saved) : initialRecipes;
  } catch {
    return initialRecipes;
  }
});
  const [recipeName, setRecipeName] = useState('');
  const [recipeIngredients, setRecipeIngredients] = useState('');
  const [activity, setActivity] = useState([
    { who: 'Mom', text: 'flagged Whole Milk in a new recipe.' },
    { who: 'Dad', text: 'added a substitute for Menudo.' },
    { who: userName || 'Natasha', text: 'joined the Burkart Family household.' },
  ]);

  // Mocked WebSocket: a real server push replaces this setInterval in a
  // later deliverable. Every 8 seconds a "household member" does something.
  useEffect(() => {
    const interval = setInterval(() => {
      const next = activityMessagePool[Math.floor(Math.random() * activityMessagePool.length)];
      setActivity((prev) => [next, ...prev].slice(0, 6));
    }, 8000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    localStorage.setItem('recipes', JSON.stringify(recipes));
  }, [recipes]);

  function handleAddRecipe(e) {
    e.preventDefault();
    if (!recipeName.trim() || !recipeIngredients.trim()) return;

    const lines = recipeIngredients
      .split('\n')
      .map((line) => line.trim())
      .filter(Boolean);

    const { totals, unknownCount } = calculateNutritionTotals(lines);

    const newRecipe = {
      id: Date.now(),
      name: recipeName,
      image: null,
      sodium: totals.sodiumMg,
      calories: totals.calories,
      extraNutrition:
        unknownCount > 0 ? `${unknownCount} ingredient(s) not yet in our nutrition database` : '',
      nutritionDetails: { sugarG: totals.sugarG, fiberG: totals.fiberG, proteinG: totals.proteinG, fatG: totals.fatG },
      substitutes: [],
      ingredients: lines,
    };

    setRecipes((prev) => [...prev, newRecipe]);
    setActivity((prev) => [{ who: userName || 'You', text: `added a new recipe: ${recipeName}.` }, ...prev].slice(0, 6));
    setRecipeName('');
    setRecipeIngredients('');
  }

  const totalSodium = recipes.reduce((sum, r) => sum + r.sodium, 0);
  const sodiumGoal = 2400;
  const sodiumRemaining = Math.max(sodiumGoal - totalSodium, 0);

  return (
    <main className="flex-1 max-w-5xl mx-auto w-full p-4 md:p-8 flex flex-col gap-8">
      <div>
        <h2 className="text-xl md:text-2xl">Household Dashboard</h2>
        <p className="italic">Household: <span id="household-name">Burkart Family</span></p>
      </div>

      <section className="flex flex-col gap-4">
        <h3 className="text-lg font-bold">Recipes</h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {recipes.map((recipe) => (
            <RecipeCard key={recipe.id} recipe={recipe} />
          ))}

          <article className="card flex flex-col gap-3">
            <h4 className="font-bold">Add a new recipe</h4>
            <form className="flex flex-col gap-2" onSubmit={handleAddRecipe}>
              <div className="flex flex-col gap-1">
                <label htmlFor="recipe-name">Recipe name</label>
                <input
                  type="text"
                  id="recipe-name"
                  name="recipeName"
                  placeholder="e.g. Tacos"
                  className="form-input"
                  value={recipeName}
                  onChange={(e) => setRecipeName(e.target.value)}
                />
              </div>
              <div className="flex flex-col gap-1">
                <label htmlFor="recipe-ingredients">Ingredients</label>
                <textarea
                  id="recipe-ingredients"
                  name="recipeIngredients"
                  placeholder="One ingredient per line, e.g.&#10;Carrots&#10;Whole milk&#10;Chicken"
                  required
                  className="form-input"
                  value={recipeIngredients}
                  onChange={(e) => setRecipeIngredients(e.target.value)}
                ></textarea>
              </div>
              <button type="submit" className="btn-primary self-start">Check for allergens</button>
            </form>
          </article>
        </div>
      </section>

      <section className="card flex flex-col gap-2">
        <h3 className="text-lg font-bold">Today's Sodium Total &mdash; Lucy Breen (Peaks Ice Arena)</h3>
        <p>
          {recipes.map((r) => `${r.name} (${r.sodium}mg)`).join(' + ')} ={' '}
          <span className="flagged-caution">{totalSodium}mg</span> toward her {sodiumGoal.toLocaleString()}mg/day need
        </p>
        <p className="substitute">
          {sodiumRemaining > 0
            ? `Still needs ${sodiumRemaining.toLocaleString()}mg more sodium today to meet her goal.`
            : 'Goal met for today.'}
        </p>
      </section>

      <aside className="activity-feed p-4">
        <h3 className="text-lg font-bold mb-2">Household Activity</h3>
        <ul className="list-disc list-inside">
          {activity.map((item, i) => (
            <li key={i}>
              {item.who} {item.text}
            </li>
          ))}
        </ul>
      </aside>
    </main>
  );
}