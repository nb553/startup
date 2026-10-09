import React from 'react';
import { NavLink } from 'react-router-dom';

export function Register() {
  return (
    <main className="flex-1 max-w-2xl mx-auto w-full p-4 md:p-8 flex flex-col gap-6">
      <h2 className="text-xl md:text-2xl">Create Your Account</h2>

      <form className="card flex flex-col gap-3 max-w-sm">
        <div className="flex flex-col gap-1">
          <label htmlFor="full-name">Full name</label>
          <input type="text" id="full-name" name="vFullName" placeholder="Your name" required className="form-input" />
        </div>
        <div className="flex flex-col gap-1">
          <label htmlFor="email">Email</label>
          <input type="email" id="email" name="vEmail" placeholder="your@email.com" required className="form-input" />
        </div>
        <div className="flex flex-col gap-1">
          <label htmlFor="password">Password</label>
          <input type="password" id="password" name="vPassword" placeholder="password" required className="form-input" />
        </div>
        <button type="submit" className="btn-primary self-start">Create Account</button>
      </form>

      <p>Already have an account? <NavLink to="" className="btn-secondary">Log in</NavLink></p>
    </main>
  );
}