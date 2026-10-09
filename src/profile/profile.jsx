import React from 'react';

export function Profile() {
  return (
    <main className="flex-1 max-w-4xl mx-auto w-full p-4 md:p-8 flex flex-col gap-8">
      <h2 className="text-xl md:text-2xl">My Profile</h2>

      <section className="card flex flex-col sm:flex-row gap-4 items-start">
        <img src="/profile.png" alt="Natasha Burkart's profile picture" className="rounded-full w-28 h-28 object-cover" />
        <div className="flex-1 flex flex-col gap-2">
          <h3 className="text-lg font-bold">Natasha Burkart</h3>
          <p>tay2burkart728@gmail.com</p>

          <h4 className="font-bold">Allergens &amp; Restrictions</h4>
          <ul className="list-disc list-inside">
            <li><span className="flagged">Peanuts</span> &mdash; severe</li>
            <li><span className="flagged">Treenuts</span> &mdash; severe</li>
            <li><span className="flagged">Legumes</span> &mdash; severe</li>
            <li><span className="flagged">Chocolate</span> &mdash; severe</li>
            <li><span className="flagged">Carrots</span> &mdash; severe</li>
            <li><span className="flagged">Chicken</span> &mdash; severe</li>
          </ul>

          <form className="flex flex-col gap-2 max-w-sm">
            <fieldset className="border border-[var(--navy)]/20 rounded p-3 flex flex-col gap-2">
              <legend className="px-1 font-bold">Add an allergen or restriction</legend>
              <div className="flex flex-col gap-1">
                <label htmlFor="new-allergen">Add allergen or restriction</label>
                <input type="text" id="new-allergen" name="newAllergen" placeholder="e.g. Dairy" className="form-input" />
              </div>
              <div className="flex flex-col gap-1">
                <label htmlFor="severity">Severity</label>
                <select id="severity" name="severity" className="form-input">
                  <option>Mild</option>
                  <option>Moderate</option>
                  <option selected>Severe</option>
                  <option>Dietary preference</option>
                </select>
              </div>
            </fieldset>
            <button type="submit" className="btn-primary self-start">Save</button>
          </form>
        </div>
      </section>

      <section className="card flex flex-col gap-4 max-w-md">
        <h3 className="text-lg font-bold">Nutrition Goals</h3>
        <form className="flex flex-col gap-2">
          <fieldset className="border border-[var(--navy)]/20 rounded p-3 flex flex-col gap-2">
            <legend className="px-1 font-bold">Add a nutrition goal</legend>
            <div className="flex flex-col gap-1">
              <label htmlFor="nutrient">Nutrient</label>
              <select id="nutrient" name="nutrient" className="form-input">
                <option>Sodium (mg)</option>
                <option>Calories (kcal)</option>
                <option>Protein (g)</option>
                <option>Sugar (g)</option>
              </select>
            </div>
            <div className="flex flex-col gap-1">
              <label htmlFor="goal-type">Goal type</label>
              <select id="goal-type" name="goalType" className="form-input">
                <option>Minimum needed per day</option>
                <option selected>Maximum limit per day</option>
              </select>
            </div>
            <div className="flex flex-col gap-1">
              <label htmlFor="goal-amount">Amount</label>
              <input type="number" id="goal-amount" name="goalAmount" placeholder="e.g. 2400" required className="form-input" />
            </div>
          </fieldset>
          <button type="submit" className="btn-secondary self-start">Save Goal</button>
        </form>
      </section>

      <section className="flex flex-col gap-4">
        <h3 className="text-lg font-bold">My Households</h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <article className="card">
            <h4 className="font-bold mb-2">Burkart Family</h4>
            <ul className="list-disc list-inside">
              <li>Mom &mdash; lactose intolerant</li>
              <li>Dad &mdash; allergic to paprika, bell peppers</li>
              <li>Joe Jr &mdash; allergic to carrots, lactose intolerant</li>
              <li>Abigail &mdash; no restrictions</li>
              <li>Toby &mdash; allergic to cherries</li>
              <li>Natasha (me) &mdash; allergic to peanuts, treenuts, legumes, chocolate, carrots, chicken</li>
            </ul>
          </article>

          <article className="card">
            <h4 className="font-bold mb-2">Provo Apt</h4>
            <ul className="list-disc list-inside">
              <li>Grace &mdash; celiac</li>
              <li>Elyse &mdash; celiac</li>
              <li>Natasha (me) &mdash; allergic to peanuts, treenuts, legumes, chocolate, carrots, chicken</li>
            </ul>
          </article>

          <article className="card">
            <h4 className="font-bold mb-2">Peaks Ice Arena</h4>
            <ul className="list-disc list-inside">
              <li>Natasha (me) &mdash; allergic to peanuts, treenuts, legumes, chocolate, carrots, chicken</li>
              <li>Mira Jensen &mdash; vegan (dietary preference)</li>
              <li>Lucy Breen &mdash; needs at least 2,400mg sodium/day (6g salt)</li>
              <li>Brenda Juarez &mdash; no restrictions</li>
              <li>Abby Wischmeier &mdash; calorie goal ~2,800 kcal/day</li>
            </ul>
          </article>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <form className="card flex flex-col gap-2">
            <h4 className="font-bold">Create a household</h4>
            <label htmlFor="household-name-input">Household name</label>
            <input type="text" id="household-name-input" name="householdName" placeholder="e.g. Smith Family" className="form-input" />
            <button type="submit" className="btn-primary self-start">Create</button>
          </form>

          <form className="card flex flex-col gap-2">
            <h4 className="font-bold">Join a household</h4>
            <label htmlFor="household-code">Invite code</label>
            <input type="text" id="household-code" name="householdCode" placeholder="Invite code" className="form-input" />
            <button type="submit" className="btn-secondary self-start">Join</button>
          </form>
        </div>
      </section>
    </main>
  );
}