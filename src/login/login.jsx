import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';

export function Login({ setUserName }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  function handleSubmit(e) {
    e.preventDefault();

    if (!email || !password) {
      setError('Please enter an email and password.');
      return;
    }

    // Mocked auth: there is no real backend yet, so we just check that a
    // name was previously saved during registration in this browser, and
    // fall back to using the email itself if not. This will be replaced
    // with a real authentication service call in a later deliverable.
    const existingName = localStorage.getItem('userName');
    const displayName = existingName || email.split('@')[0];

    localStorage.setItem('userEmail', email);
    setUserName(displayName);
    navigate('/dashboard');
  }

  return (
    <main className="flex-1 max-w-2xl mx-auto w-full p-4 md:p-8 flex flex-col gap-6">
      <h2 className="text-xl md:text-2xl">Track allergies. Cook safely. Eat anywhere.</h2>
      <p className="text-base leading-relaxed italic">
        Allergen Audit helps you and your household manage individual allergens
        and dietary restrictions, flag unsafe ingredients in recipes, and check
        packaged or fast food items on the go.
      </p>

      <form className="card flex flex-col gap-3 max-w-sm" onSubmit={handleSubmit}>
        <div className="flex items-center gap-2">
          <label htmlFor="email" className="w-20">Email</label>
          <span aria-hidden="true">@</span>
          <input
            type="email"
            id="email"
            name="vEmail"
            placeholder="your@email.com"
            className="form-input flex-1"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2">
          <label htmlFor="password" className="w-20">Password</label>
          <span aria-hidden="true">🔒</span>
          <input
            type="password"
            id="password"
            name="vPassword"
            placeholder="password"
            className="form-input flex-1"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        {error && <p className="flagged">{error}</p>}
        <button type="submit" className="btn-primary self-start">Login</button>
      </form>

      <p>New here? <NavLink to="register" className="btn-secondary">Create an account</NavLink></p>
    </main>
  );
}