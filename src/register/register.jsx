import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';

export function Register({ setUserName }) {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  function handleSubmit(e) {
    e.preventDefault();

    // Mocked account creation: no real backend yet, so we just persist the
    // name/email to this browser's localStorage. A real authentication
    // service call replaces this in a later deliverable.
    localStorage.setItem('userName', fullName);
    localStorage.setItem('userEmail', email);
    setUserName(fullName);
    navigate('/dashboard');
  }

  return (
    <main className="flex-1 max-w-2xl mx-auto w-full p-4 md:p-8 flex flex-col gap-6">
      <h2 className="text-xl md:text-2xl">Create Your Account</h2>

      <form className="card flex flex-col gap-3 max-w-sm" onSubmit={handleSubmit}>
        <div className="flex flex-col gap-1">
          <label htmlFor="full-name">Full name</label>
          <input
            type="text"
            id="full-name"
            name="vFullName"
            placeholder="Your name"
            required
            className="form-input"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
          />
        </div>
        <div className="flex flex-col gap-1">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            name="vEmail"
            placeholder="your@email.com"
            required
            className="form-input"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="flex flex-col gap-1">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            name="vPassword"
            placeholder="password"
            required
            className="form-input"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button type="submit" className="btn-primary self-start">Create Account</button>
      </form>

      <p>Already have an account? <NavLink to="" className="btn-secondary">Log in</NavLink></p>
    </main>
  );
}