import React from 'react';

export function Lookup() {
  return (
    <main className="flex-1 max-w-3xl mx-auto w-full p-4 md:p-8 flex flex-col gap-6">
      <h2 className="text-xl md:text-2xl">Food Lookup</h2>
      <p className="italic">Search a packaged or restaurant food item, or snap a photo of its label if one isn't available.</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <section className="card flex flex-col gap-2">
          <h3 className="font-bold">Search by name</h3>
          <form className="flex flex-col gap-2">
            <label htmlFor="food-search">Food or restaurant item</label>
            <input type="search" id="food-search" name="foodSearch" placeholder="e.g. Taco Bell Crunchy Taco" className="form-input" />
            <button type="submit" className="btn-primary self-start">Search</button>
          </form>
        </section>

        <section className="card flex flex-col gap-2">
          <h3 className="font-bold">Scan a label</h3>
          <form className="flex flex-col gap-2">
            <label htmlFor="label-photo">Take or upload a photo of the packaging</label>
            <input type="file" id="label-photo" name="labelPhoto" accept="image/*" capture="environment" aria-describedby="label-photo-help" className="form-input" />
            <p id="label-photo-help" className="text-sm italic">For best results, use a clear, well-lit photo of the full ingredients label.</p>
            <button type="submit" className="btn-secondary self-start">Scan</button>
          </form>
        </section>
      </div>

      <section className="card flex flex-col gap-3">
        <h3 className="font-bold">Result: Taco Bell Crunchy Taco</h3>
        <div className="table-wrapper">
         <table className="w-full border-collapse text-left">
          <caption className="text-left text-sm italic mb-2">Ingredient safety check for Taco Bell Crunchy Taco</caption>
          <thead>
            <tr className="border-b border-[var(--navy)]/20">
              <th scope="col" className="py-1">Ingredient</th>
              <th scope="col" className="py-1">Allergen flag</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-[var(--navy)]/10">
              <td className="py-1">Seasoned beef</td>
              <td className="py-1">None</td>
            </tr>
            <tr className="border-b border-[var(--navy)]/10">
              <td className="py-1">Iceberg lettuce</td>
              <td className="py-1">None</td>
            </tr>
            <tr className="border-b border-[var(--navy)]/10">
              <td className="py-1">Cheddar cheese</td>
              <td className="py-1"><span className="flagged-caution">Dairy</span> &mdash; Mom, Joe Jr.</td>
            </tr>
            <tr>
              <td className="py-1">Crunchy taco shell</td>
              <td className="py-1">none</td>
            </tr>
          </tbody>
        </table>
        </div>
        <p>Not safe for: Mom, Joe Jr. <span className="substitute">Suggested substitute: no cheese.</span></p>

        <div className="mt-2 pt-2 border-t border-[var(--navy)]/10">
          <p className="font-bold text-sm">Nutrition (per taco)</p>
          <ul className="text-sm list-disc list-inside">
            <li>Sodium: <span className="flagged-caution">340mg</span> &mdash; contributes toward Lucy Breen's 2,400mg/day sodium need</li>
            <li>Calories: <span className="flagged-caution">170</span> &mdash; 6% of Abby Wischmeier's ~2,800 kcal/day goal</li>
          </ul>
        </div>
      </section>
    </main>
  );
}