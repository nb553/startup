import React, { useState, useEffect } from 'react';

const initialAllergens = [
  { id: 'a1', name: 'Peanuts', level: 'Severe allergy' },
  { id: 'a2', name: 'Treenuts', level: 'Severe allergy' },
  { id: 'a3', name: 'Legumes', level: 'Severe allergy' },
  { id: 'a4', name: 'Chocolate', level: 'Severe allergy' },
  { id: 'a5', name: 'Carrots', level: 'Severe allergy' },
  { id: 'a6', name: 'Chicken', level: 'Severe allergy' },
];

const initialHouseholds = [
  {
    id: 'h1',
    name: 'Burkart Family',
    members: [
      'Mom — lactose intolerant',
      'Dad — allergic to paprika, bell peppers',
      'Joe Jr — allergic to carrots, lactose intolerant',
      'Abigail — no restrictions',
      'Toby — allergic to cherries',
      'Natasha (me) — allergic to peanuts, treenuts, legumes, chocolate, carrots, chicken',
    ],
  },
  {
    id: 'h2',
    name: 'Provo Apt',
    members: [
      'Grace — celiac',
      'Elyse — celiac',
      'Natasha (me) — allergic to peanuts, treenuts, legumes, chocolate, carrots, chicken',
    ],
  },
  {
    id: 'h3',
    name: 'Peaks Ice Arena',
    members: [
      'Natasha (me) — allergic to peanuts, treenuts, legumes, chocolate, carrots, chicken',
      'Mira — vegan (dietary preference)',
      'Lucy — needs at least 2,400mg sodium/day (6g salt)',
      'Brenda — no restrictions',
      'Abby — calorie goal ~2,800 kcal/day',
    ],
  },
];

export function Profile({ userName }) {
  const displayName = userName || 'Natasha Burkart';
  const [email, setEmail] = useState(() => localStorage.getItem('userEmail') || '');

  useEffect(() => {
    setEmail(localStorage.getItem('userEmail') || '');
  }, []);
  const [allergens, setAllergens] = useState(() => {
    const saved = localStorage.getItem('myAllergens');
    return saved ? JSON.parse(saved) : initialAllergens;
  });
  const [newAllergen, setNewAllergen] = useState('');
  const [newLevel, setNewLevel] = useState('Severe allergy');

  const [goals, setGoals] = useState(() => {
    const saved = localStorage.getItem('nutritionGoals');
    return saved ? JSON.parse(saved) : [];
  });
  const [nutrient, setNutrient] = useState('Sodium (mg)');
  const [goalType, setGoalType] = useState('Maximum limit per day');
  const [goalAmount, setGoalAmount] = useState('');

  const [households, setHouseholds] = useState(() => {
    const saved = localStorage.getItem('households');
    return saved ? JSON.parse(saved) : initialHouseholds;
  });
  const [newHouseholdName, setNewHouseholdName] = useState('');
  const [joinCode, setJoinCode] = useState('');
  const [joinMessage, setJoinMessage] = useState('');

  useEffect(() => {
    localStorage.setItem('myAllergens', JSON.stringify(allergens));
  }, [allergens]);

  useEffect(() => {
    localStorage.setItem('nutritionGoals', JSON.stringify(goals));
  }, [goals]);

  useEffect(() => {
    localStorage.setItem('households', JSON.stringify(households));
  }, [households]);

  function handleAddAllergen(e) {
    e.preventDefault();
    if (!newAllergen.trim()) return;
    setAllergens((prev) => [...prev, { id: Date.now(), name: newAllergen.trim(), level: newLevel }]);
    setNewAllergen('');
    setNewLevel('Severe allergy');
  }

  function handleRemoveAllergen(id) {
    setAllergens((prev) => prev.filter((a) => a.id !== id));
  }

  function handleAddGoal(e) {
    e.preventDefault();
    if (!goalAmount) return;
    setGoals((prev) => [...prev, { nutrient, goalType, amount: goalAmount }]);
    setGoalAmount('');
  }

  function handleCreateHousehold(e) {
    e.preventDefault();
    if (!newHouseholdName.trim()) return;
    setHouseholds((prev) => [...prev, { id: Date.now(), name: newHouseholdName.trim(), members: [`${displayName} (me)`] }]);
    setNewHouseholdName('');
  }

  function handleJoinHousehold(e) {
    e.preventDefault();
    if (!joinCode.trim()) return;
    // Mocked join: there is no real household service yet, so any code
    // "joins" a household named by the code in this browser only.
    setHouseholds((prev) => [...prev, { id: Date.now(), name: `Household ${joinCode.trim()}`, members: [`${displayName} (me)`] }]);
    setJoinMessage(`Joined with code ${joinCode.trim()} (mock — no server yet).`);
    setJoinCode('');
  }

  return (
    <main className="flex-1 max-w-4xl mx-auto w-full p-4 md:p-8 flex flex-col gap-8">
      <h2 className="text-xl md:text-2xl">My Profile</h2>

      <section className="card flex flex-col sm:flex-row gap-4 items-start">
        <img src="/profile.png" alt="Natasha Burkart's profile picture" className="rounded-full w-28 h-28 object-cover" />
        <div className="flex-1 flex flex-col gap-2">
          <h3 className="text-lg font-bold">{displayName}</h3>
          {email && <p>{email}</p>}


          <h4 className="font-bold">Allergens &amp; Restrictions</h4>
          <ul className="list-disc list-inside">
            {allergens.map((a) => (
              <li key={a.id}>
                {a.level === 'Severe allergy' ? (
                  <span className="flagged">{a.name}</span>
                ) : a.level === 'Intolerance' ? (
                  <span className="flagged-caution">{a.name}</span>
                ) : (
                  a.name
                )}{' '}
                &mdash; {a.level.toLowerCase()}{' '}
                <button
                  type="button"
                  onClick={() => handleRemoveAllergen(a.id)}
                  className="underline bg-transparent border-0 p-0 cursor-pointer text-sm"
                >
                  (remove)
                </button>
              </li>
            ))}
          </ul>

          <form className="flex flex-col gap-2 max-w-sm" onSubmit={handleAddAllergen}>
            <fieldset className="border border-[var(--navy)]/20 rounded p-3 flex flex-col gap-2">
              <legend className="px-1 font-bold">Add an allergen or restriction</legend>
              <div className="flex flex-col gap-1">
                <label htmlFor="new-allergen">Add allergen or restriction</label>
                <input
                  type="text"
                  id="new-allergen"
                  name="newAllergen"
                  placeholder="e.g. Dairy"
                  className="form-input"
                  value={newAllergen}
                  onChange={(e) => setNewAllergen(e.target.value)}
                />
              </div>
              <div className="flex flex-col gap-1">
                <label htmlFor="severity">Severity</label>
                <select
                  id="severity"
                  name="severity"
                  className="form-input"
                  value={newLevel}
                  onChange={(e) => setNewLevel(e.target.value)}
                >
                  <option>Severe allergy</option>
                  <option>Intolerance</option>
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
        {goals.length > 0 && (
          <ul className="list-disc list-inside">
            {goals.map((g, i) => (
              <li key={i}>
                {g.nutrient} &mdash; {g.goalType.toLowerCase()}: {g.amount}
              </li>
            ))}
          </ul>
        )}
        <form className="flex flex-col gap-2" onSubmit={handleAddGoal}>
          <fieldset className="border border-[var(--navy)]/20 rounded p-3 flex flex-col gap-2">
            <legend className="px-1 font-bold">Add a nutrition goal</legend>
            <div className="flex flex-col gap-1">
              <label htmlFor="nutrient">Nutrient</label>
              <select
                id="nutrient"
                name="nutrient"
                className="form-input"
                value={nutrient}
                onChange={(e) => setNutrient(e.target.value)}
              >
                <option>Sodium (mg)</option>
                <option>Calories (kcal)</option>
                <option>Protein (g)</option>
                <option>Sugar (g)</option>
              </select>
            </div>
            <div className="flex flex-col gap-1">
              <label htmlFor="goal-type">Goal type</label>
              <select
                id="goal-type"
                name="goalType"
                className="form-input"
                value={goalType}
                onChange={(e) => setGoalType(e.target.value)}
              >
                <option>Minimum needed per day</option>
                <option>Maximum limit per day</option>
              </select>
            </div>
            <div className="flex flex-col gap-1">
              <label htmlFor="goal-amount">Amount</label>
              <input
                type="number"
                id="goal-amount"
                name="goalAmount"
                placeholder="e.g. 2400"
                required
                className="form-input"
                value={goalAmount}
                onChange={(e) => setGoalAmount(e.target.value)}
              />
            </div>
          </fieldset>
          <button type="submit" className="btn-secondary self-start">Save Goal</button>
        </form>
      </section>

      <section className="flex flex-col gap-4">
        <h3 className="text-lg font-bold">My Households</h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {households.map((household) => (
            <article key={household.id} className="card">
              <h4 className="font-bold mb-2">{household.name}</h4>
              <ul className="list-disc list-inside">
                {household.members.map((member, i) => (
                  <li key={i}>{member}</li>
                ))}
              </ul>
            </article>
          ))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <form className="card flex flex-col gap-2" onSubmit={handleCreateHousehold}>
            <h4 className="font-bold">Create a household</h4>
            <label htmlFor="household-name-input">Household name</label>
            <input
              type="text"
              id="household-name-input"
              name="householdName"
              placeholder="e.g. Smith Family"
              className="form-input"
              value={newHouseholdName}
              onChange={(e) => setNewHouseholdName(e.target.value)}
            />
            <button type="submit" className="btn-primary self-start">Create</button>
          </form>

          <form className="card flex flex-col gap-2" onSubmit={handleJoinHousehold}>
            <h4 className="font-bold">Join a household</h4>
            <label htmlFor="household-code">Invite code</label>
            <input
              type="text"
              id="household-code"
              name="householdCode"
              placeholder="Invite code"
              className="form-input"
              value={joinCode}
              onChange={(e) => setJoinCode(e.target.value)}
            />
            <button type="submit" className="btn-secondary self-start">Join</button>
            {joinMessage && <p className="text-sm italic">{joinMessage}</p>}
          </form>
        </div>
      </section>
    </main>
  );
}