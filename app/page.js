'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { db } from '../_utils/firebase';
import { doc, updateDoc, arrayUnion, setDoc } from 'firebase/firestore';

export default function HomePage() {
  const [city, setCity] = useState('');
  const [weather, setWeather] = useState(null);
  const [error, setError] = useState('');
  const [theme, setTheme] = useState('light');

  const { user } = useAuth();

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

  const fetchWeather = async () => {
    if (!city.trim()) {
      setError('Please enter a city name');
      return;
    }

    setError('');
    setWeather(null);

    try {
      const res = await fetch(
        `https://api.weatherapi.com/v1/current.json?key=2f5912a74c2e44a091f171413250804&q=${city}`
      );
      const data = await res.json();

      if (data.error) {
        setError(data.error.message);
      } else {
        setWeather(data);
      }
    } catch (err) {
      setError('Something went wrong fetching the weather');
    }
  };

  const saveToFavorites = async () => {
    if (!user || !weather) return;

    const userRef = doc(db, 'users', user.uid);

    await setDoc(
      userRef,
      { favorites: arrayUnion(weather.location.name) },
      { merge: true }
    );
  };

  return (
    <main className="max-w-xl mx-auto p-6">
      <div className="flex justify-end">
        <button
          onClick={toggleTheme}
          className="mb-4 bg-gray-800 text-white px-4 py-2 rounded hover:bg-gray-700 dark:bg-white dark:text-black"
        >
          {theme === 'dark' ? '☀️ Light Mode' : '🌙 Dark Mode'}
        </button>
      </div>

      <h1 className="text-3xl font-bold mb-4 text-center">Clima</h1>

      <div className="flex gap-2 mb-4">
        <input
          type="text"
          placeholder="Enter city name"
          className="flex-grow p-2 border rounded"
          value={city}
          onChange={(e) => setCity(e.target.value)}
        />
        <button
          onClick={fetchWeather}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Search
        </button>
      </div>

      {error && <p className="text-red-500">{error}</p>}

      {weather && (
        <div className="border p-4 rounded shadow text-center">
          <h2 className="text-xl font-bold mb-2">
            {weather.location.name}, {weather.location.country}
          </h2>
          <img
            src={weather.current.condition.icon}
            alt={weather.current.condition.text}
            className="mx-auto"
          />
          <p className="text-lg">{weather.current.condition.text}</p>
          <p>🌡 Temp: {weather.current.temp_c}°C</p>
          <p>💨 Wind: {weather.current.wind_kph} kph</p>
          <p>💧 Humidity: {weather.current.humidity}%</p>

          {user && weather && (
            <button
              onClick={saveToFavorites}
              className="mt-4 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
            >
              ⭐ Save to Favorites
            </button>
          )}
        </div>
      )}
    </main>
  );
}

