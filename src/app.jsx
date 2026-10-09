import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './app.css';
import { BrowserRouter, NavLink, Route, Routes } from 'react-router-dom';
import { Login } from './login/login';
import { Dashboard } from './dashboard/dashboard';
import { Lookup } from './lookup/lookup';
import { Profile } from './profile/profile';
import { Register } from './register/register';

export default function App() {
  return (
    <BrowserRouter>
      <div className="body">
        <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 p-4 md:px-8 bg-[var(--navy)] border-b-4 border-[var(--teal)]">
          <h1 className="text-2xl md:text-3xl text-white italic">Allergen Audit</h1>
          <nav>
            <ul className="flex flex-wrap gap-4 list-none p-0 m-0">
              <li><NavLink to="">Home</NavLink></li>
              <li><NavLink to="dashboard">Dashboard</NavLink></li>
              <li><NavLink to="profile">Profile</NavLink></li>
              <li><NavLink to="lookup">Lookup</NavLink></li>
            </ul>
          </nav>
        </header>

        <Routes>
          <Route path='/' element={<Login />} exact />
          <Route path='/dashboard' element={<Dashboard />} />
          <Route path='/profile' element={<Profile />} />
          <Route path='/lookup' element={<Lookup />} />
          <Route path='/register' element={<Register />} />
          <Route path='*' element={<NotFound />} />
        </Routes>

        <footer className="p-4 bg-[var(--navy)] border-t-4 border-[var(--teal)] text-center text-white">
          <span>Natasha Burkart</span>
          <br />
          <a href="https://github.com/nb553/startup" className="text-[var(--teal)] underline">GitHub</a>
        </footer>
      </div>
    </BrowserRouter>
  );
}

function NotFound() {
  return <main>404: Return to sender. Address unknown.</main>;
}