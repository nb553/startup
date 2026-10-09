import React from 'react';

export function Dashboard() {
  return (
    <main className="flex-1 max-w-5xl mx-auto w-full p-4 md:p-8 flex flex-col gap-8">
      <div>
        <h2 className="text-xl md:text-2xl">Household Dashboard</h2>
        <p className="italic">Household: <span id="household-name">Burkart Family</span></p>
      </div>

      <section className="flex flex-col gap-4">
        <h3 className="text-lg font-bold">Recipes</h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <article className="card flex flex-col gap-2">
            <h4 className="font-bold">Menudo</h4>
            <img src="/menudo.png" alt="Bowl of menudo soup" className="rounded w-full h-40 object-cover" />
            <ul className="list-disc list-inside">
              <li><span className="flagged">Mama Sita's Menudo Mix</span> &mdash; allergic (Dad)</li>
              <li>Ground Beef</li>
              <li>Onion</li>
              <li>Garlic</li>
              <li><span className="flagged">Carrots</span> &mdash; allergic (Joe, me)</li>
              <li><span className="flagged">Peas</span> &mdash; allergic (me)</li>
            </ul>
            <p className="substitute">Omit carrots and peas &mdash; safe for all household members.</p>
            <p className="substitute">Replace Mama Sita's menudo mix with beef buillion &mdash; safe for all household members.</p>

            <div className="mt-2 pt-2 border-t border-[var(--navy)]/10">
              <p className="font-bold text-sm">Nutrition (per serving)</p>
              <ul className="text-sm list-disc list-inside">
                <li>Sodium: <span className="flagged-caution">810mg</span> &mdash; contributes toward Lucy Breen's 2,400mg/day sodium need</li>
                <li>Calories: 320</li>
                <li>Protein: 24g</li>
              </ul>
            </div>
          </article>

          <article className="card flex flex-col gap-2">
            <h4 className="font-bold">Homemade Ice Cream</h4>
            <img src="/icecream.png" alt="Bowl of homemade ice cream" className="rounded w-full h-40 object-cover" />
            <ul className="list-disc list-inside">
              <li>Heavy cream</li>
              <li><span className="flagged-caution">Whole milk</span> &mdash; lactose intolerant (Mom, Joe)</li>
              <li>Sugar</li>
              <li><span className="flagged">Vanilla extract</span> &mdash; allergic (me)</li>
            </ul>
            <p className="substitute">Replace whole milk with lactaid milk &mdash; safe for all household members.</p>
            <p className="substitute">Replace vanilla extract with black sugar syrup &mdash; safe for all household members.</p>

            <div className="mt-2 pt-2 border-t border-[var(--navy)]/10">
              <p className="font-bold text-sm">Nutrition (per serving)</p>
              <ul className="text-sm list-disc list-inside">
                <li>Sodium: 40mg &mdash; contributes toward Lucy Breen's 2,400mg/day sodium need</li>
                <li>Calories: 270</li>
                <li>Sugar: 22g</li>
              </ul>
            </div>
          </article>

          <article className="card flex flex-col gap-3">
            <h4 className="font-bold">Add a new recipe</h4>
            <form className="flex flex-col gap-2">
              <div className="flex flex-col gap-1">
                <label htmlFor="recipe-name">Recipe name</label>
                <input type="text" id="recipe-name" name="recipeName" placeholder="e.g. Tacos" className="form-input" />
              </div>
              <div className="flex flex-col gap-1">
                <label htmlFor="recipe-ingredients">Ingredients</label>
                <textarea id="recipe-ingredients" name="recipeIngredients" placeholder="One ingredient per line" required className="form-input"></textarea>
              </div>
              <button type="submit" className="btn-primary self-start">Check for allergens</button>
            </form>
          </article>
        </div>
      </section>

      <section className="card flex flex-col gap-2">
        <h3 className="text-lg font-bold">Today's Sodium Total &mdash; Lucy Breen (Peaks Ice Arena)</h3>
        <p>Menudo (810mg) + Ice Cream (40mg) = <span className="flagged-caution">850mg</span> toward her 2,400mg/day need</p>
        <p className="substitute">Still needs 1,550mg more sodium today to meet her goal.</p>
      </section>

      <aside id="activity-feed" className="activity-feed p-4">
        <h3 className="text-lg font-bold mb-2">Household Activity</h3>
        <ul className="list-disc list-inside">
          <li>Mom flagged <span className="flagged-caution">Whole Milk</span> in a new recipe.</li>
          <li>Dad added a substitute for Menudo.</li>
          <li>Natasha joined the Burkart Family household.</li>
        </ul>
      </aside>
    </main>
  );
}