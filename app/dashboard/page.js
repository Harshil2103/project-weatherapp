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

  // 🌗 Dark mode logic
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

  // 🔐 Redirect if not logged in
  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  // ✅ Fetch user's favorites from Firestore
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
    return <p className="text-center mt-20">Loading...</p>;
  }

  return (
    <main className="max-w-3xl mx-auto p-6">
      <div className="flex justify-between items-center mb-4">
        <button
          onClick={() => router.push('/')}
          className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 text-sm"
        >
          ← Back to Home
        </button>

        <button
          onClick={toggleTheme}
          className="bg-gray-800 text-white px-3 py-1 rounded text-sm dark:bg-white dark:text-black"
        >
          {theme === 'dark' ? '☀️ Light' : '🌙 Dark'}
        </button>
      </div>

      <h1 className="text-3xl font-bold mb-4">Welcome</h1>

      <button
        onClick={logout}
        className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
      >
        Log Out
      </button>

      
    </main>
  );
}
