'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../context/AuthContext';
import { db } from '../../_utils/firebase';
import { doc, getDoc } from 'firebase/firestore';

export default function DashboardPage() {
  const router = useRouter();
  const { user, loading, logout } = useAuth();
  const [favorites, setFavorites] = useState([]);
  const [theme, setTheme] = useState('light');

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  useEffect(() => {
    const fetchFavorites = async () => {
      if (user) {
        const docRef = doc(db, 'users', user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setFavorites(docSnap.data().favorites || []);
        }
      }
    };
    fetchFavorites();
  }, [user]);

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      setTheme(savedTheme);
      document.documentElement.classList.add(savedTheme);
    }
  }, []);

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
      document.documentElement.classList.remove('light');
    } else {
      document.documentElement.classList.remove('dark');
      document.documentElement.classList.add('light');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  if (loading || !user) {
    return <p className="text-center mt-20">Loading...</p>;
  }

  return (
    <main className="max-w-3xl mx-auto p-6">
      <div className="flex justify-end mb-4">
        <button
          onClick={toggleTheme}
          className="bg-gray-800 text-white px-4 py-2 rounded hover:bg-gray-700 dark:bg-white dark:text-black"
        >
          {theme === 'dark' ? '☀️ Light Mode' : '🌙 Dark Mode'}
        </button>
      </div>

      <h1 className="text-3xl font-bold mb-4">Welcome, {user.email}</h1>

      <button
        onClick={logout}
        className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
      >
        Log Out
      </button>

      <div className="mt-6">
        <h2 className="text-xl font-semibold mb-2">Your Favorite Cities</h2>
        {favorites.length === 0 ? (
          <p className="text-gray-500">You haven’t saved any cities yet.</p>
        ) : (
          <ul className="list-disc pl-6 text-gray-700">
            {favorites.map((city, index) => (
              <li key={index}>{city}</li>
            ))}
          </ul>
        )}
      </div>
    </main>
  );
}

