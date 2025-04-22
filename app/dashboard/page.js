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
    const saved = localStorage.getItem('theme');
    if (saved) setTheme(saved);
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

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  useEffect(() => {
    const fetchFavorites = async () => {
      if (user) {
        try {
          const docRef = doc(db, 'users', user.uid);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            const data = docSnap.data();
            setFavorites(data.favorites || []);
          }
        } catch (err) {
          console.error('Error fetching favorites:', err.message);
        }
      }
    };

    fetchFavorites();
  }, [user]);

  if (loading || !user) {
    return <p className="text-center mt-20 text-lg font-medium">Loading...</p>;
  }

  return (
    <main className="max-w-4xl mx-auto px-6 py-10">
      <div className="flex justify-between items-center mb-8">
        <button
          onClick={() => router.push('/')}
          className="px-4 py-2 rounded-md text-sm font-medium bg-blue-500 hover:bg-blue-600 text-white shadow-md transition-all duration-200"
        >
          ← Back to Home
        </button>

        <button
          onClick={toggleTheme}
          className="px-4 py-2 rounded-md text-sm font-semibold bg-gray-800 text-white dark:bg-white dark:text-black border border-gray-300 shadow-sm transition-all duration-200"
        >
          {theme === 'dark' ? '☀️ Light' : '🌙 Dark'}
        </button>
      </div>

      <section className="bg-white dark:bg-gray-900 rounded-xl shadow-lg p-8">
        <h1 className="text-4xl font-extrabold mb-4 text-gray-800 dark:text-white">Welcome 👋</h1>
        <p className="text-md mb-6 text-gray-600 dark:text-gray-300">
          You're logged in as <span className="font-semibold">{user.email}</span>
        </p>

        <button
          onClick={logout}
          className="px-5 py-2 bg-red-500 hover:bg-red-600 text-white rounded-md font-medium transition-all duration-200"
        >
          Log Out
        </button>
      </section>

      {favorites.length > 0 && (
        <section className="mt-10">
          <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-4">⭐ Your Favorites</h2>
          <ul className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
            {favorites.map((item, index) => (
              <li
                key={index}
                className="p-4 bg-gray-100 dark:bg-gray-800 rounded-lg shadow hover:shadow-md transition"
              >
                <p className="text-gray-800 dark:text-white font-medium">{item}</p>
              </li>
            ))}
          </ul>
        </section>
      )}
    </main>
  );
}
