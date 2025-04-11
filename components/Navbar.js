'use client';

import Link from 'next/link';
import { useAuth } from '../context/AuthContext';
import { useState, useEffect } from 'react';

export default function Navbar() {
  const { user, logout } = useAuth();
  const [theme, setTheme] = useState('light');

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      setTheme(savedTheme);
    }
  }, []);

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  return (
    <nav className="flex justify-between items-center px-6 py-4 bg-blue-600 text-white shadow">
      <Link href="/" className="text-xl font-bold">
        Clima ☁️
      </Link>

      <div className="flex items-center gap-4">
        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className="text-sm bg-gray-800 text-white px-3 py-1 rounded hover:bg-gray-700 dark:bg-white dark:text-black"
        >
          {theme === 'dark' ? '☀️ Light' : '🌙 Dark'}
        </button>

        {!user ? (
          <>
            <Link href="/radar" className="hover:underline">
            Map
            </Link>

            <Link href="/login" className="hover:underline">
              Login
            </Link>
            <Link href="/signup" className="hover:underline">
              Sign Up
            </Link>
          </>
        ) : (
          <>
            <Link href="/dashboard" className="hover:underline">
              Dashboard
            </Link>
            <button
              onClick={logout}
              className="hover:underline text-sm bg-white text-blue-600 px-3 py-1 rounded"
            >
              Logout
            </button>
          </>
        )}
      </div>
    </nav>
  );
}
