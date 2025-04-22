'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { db } from '../_utils/firebase';
import { doc, getDoc } from 'firebase/firestore';

function PopularCityWeather({ city }) {
  const [data, setData] = useState(null);

  useEffect(() => {
    fetch(`https://api.weatherapi.com/v1/current.json?key=2f5912a74c2e44a091f171413250804&q=${city}`)
      .then(res => res.json())
      .then(data => setData(data));
  }, [city]);

  if (!data) return null;

  const isDay = data.current.is_day;
  const icon = isDay ? '☀️' : '🌙';

  return (
    <div className="border rounded-lg p-4 bg-blue-50 text-center shadow">
      <h4 className="font-bold text-sm mb-1">{data.location.name}</h4>
      <p className="text-sm">🌡 {data.current.temp_c}°C</p>
      <p className="text-lg">{icon}</p>
    </div>
  );
}

export default function HomePage() {
  const [city, setCity] = useState('');
  const [weather, setWeather] = useState(null);
  const [forecast, setForecast] = useState([]);
  const [error, setError] = useState('');
  const [recentSearches, setRecentSearches] = useState([]);

  const { user } = useAuth();
  const [userName, setUserName] = useState('');
  const [theme, setTheme] = useState('light');

  useEffect(() => {
    if (user) {
      const fetchUserName = async () => {
        const docRef = doc(db, 'users', user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          const fullName = `${data.firstName || ''} ${data.lastName || ''}`.trim();
          setUserName(fullName);
        }
      };
      fetchUserName();
    }
  }, [user]);

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) setTheme(savedTheme);
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

  const facts = [
    "The coldest temperature ever recorded was -128.6°F in Antarctica.",
    "Rain contains vitamin B12. Seriously!",
    "A heatwave can make train tracks bend.",
    "A single lightning bolt is 5x hotter than the sun.",
    "The highest temperature ever recorded was 134°F in Death Valley.",
    "Snowflakes can fall at speeds up to 9 mph.",
    "Some frogs can survive being frozen during the winter!",
    "There are at least 10 types of snowflakes.",
    "The smell of rain is called petrichor.",
    "Lightning strikes the Earth over 8 million times a day!"
  ];
  const [fact, setFact] = useState(facts[Math.floor(Math.random() * facts.length)]);

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem('recentSearches') || '[]');
    setRecentSearches(stored);

    const interval = setInterval(() => {
      const newFact = facts[Math.floor(Math.random() * facts.length)];
      setFact(newFact);
    }, 8000);

    return () => clearInterval(interval);
  }, []);

  const updateRecentSearches = (newCity) => {
    const stored = JSON.parse(localStorage.getItem('recentSearches') || '[]');
    const updated = [newCity, ...stored.filter((c) => c !== newCity)].slice(0, 5);
    setRecentSearches(updated);
    localStorage.setItem('recentSearches', JSON.stringify(updated));
  };

  const fetchWeather = async (customCity = null) => {
    const searchCity = customCity || city;
    if (!searchCity.trim()) {
      setError('Please enter a city name');
      return;
    }

    setError('');
    setWeather(null);
    setForecast([]);

    try {
      const res = await fetch(
        `https://api.weatherapi.com/v1/forecast.json?key=2f5912a74c2e44a091f171413250804&q=${searchCity}&days=15`
      );
      const data = await res.json();

      if (data.error) {
        setError(data.error.message);
      } else {
        setWeather(data);
        setForecast(data.forecast.forecastday);
        updateRecentSearches(data.location.name);
      }
    } catch (err) {
      setError('Something went wrong fetching the weather');
    }
  };

  const fetchWeatherByCoords = async (lat, lon) => {
    try {
      const res = await fetch(
        `https://api.weatherapi.com/v1/forecast.json?key=2f5912a74c2e44a091f171413250804&q=${lat},${lon}&days=15`
      );
      const data = await res.json();

      if (data.error) {
        setError(data.error.message);
      } else {
        setWeather(data);
        setForecast(data.forecast.forecastday);
        updateRecentSearches(data.location.name);
      }
    } catch (err) {
      setError('Something went wrong fetching the weather');
    }
  };

  const handleUseMyLocation = () => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        fetchWeatherByCoords(latitude, longitude);
      },
      () => {
        setError('Permission denied or unavailable');
      }
    );
  };

  return (
    <div className="relative min-h-screen overflow-hidden">
      
      <div
        className="absolute inset-0 z-0 bg-cover bg-center"
        style={{
          backgroundImage: "url('/banff2.jpeg')",
          filter: 'blur(2.5px)',
          transform: 'scale(1.02)',
        }}
      />

      
      <div className="relative z-10 bg-white/80 dark:bg-black/60 backdrop-blur-md min-h-screen">
        <main className="max-w-6xl mx-auto p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
         
          <aside className="space-y-4">
            <div className="p-4 border rounded-lg bg-red-100 shadow-md">
              <h2 className="text-lg font-semibold mb-2">🔴 Severe Weather Alerts</h2>
              <p className="text-sm text-red-800">No current alerts.</p>
            </div>
            <div className="p-4 border rounded-lg bg-blue-50 shadow-md">
              <h2 className="text-lg font-semibold mb-2">📊 Weekly Trend</h2>
              <p className="text-sm text-gray-700">Chart coming soon...</p>
            </div>
            <div className="p-4 border rounded-lg bg-green-50 shadow-md">
              <h2 className="text-lg font-semibold mb-2">🌧 Rain Probability</h2>
              <p className="text-sm text-gray-700">Today: 20% chance of rain</p>
            </div>
            <div className="p-4 border rounded-lg bg-yellow-50 shadow-md">
              <h2 className="text-lg font-semibold mb-2">🔥 Hottest City</h2>
              <p className="text-sm text-gray-700">Kuwait City — 44°C</p>
            </div>
            <div className="p-4 border rounded-lg bg-blue-100 shadow-md">
              <h2 className="text-lg font-semibold mb-2">❄️ Coldest Capital</h2>
              <p className="text-sm text-gray-700">Ulaanbaatar — -12°C</p>
            </div>
            <div className="p-4 border rounded-lg bg-purple-100 shadow-md">
              <h2 className="text-lg font-semibold mb-2">💧 Most Humid Place</h2>
              <p className="text-sm text-gray-700">Singapore — 95% humidity</p>
            </div>
          </aside>

          <section className="col-span-2">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Welcome, {userName || 'Clima'}</h1>
              <button
                onClick={toggleTheme}
                className="bg-gray-800 dark:bg-white text-white dark:text-black px-4 py-2 rounded-md hover:opacity-90"
              >
                {theme === 'dark' ? '☀️ Light' : '🌙 Dark'}
              </button>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 mb-6">
              <input
                type="text"
                placeholder="Enter city name"
                className="flex-grow px-4 py-2 border rounded-md"
                value={city}
                onChange={(e) => setCity(e.target.value)}
              />
              <button
                onClick={() => fetchWeather()}
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
              >
                Search
              </button>
              <button
                onClick={handleUseMyLocation}
                className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700"
              >
                📍 Use My Location
              </button>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              {['New York', 'London', 'Tokyo', 'Mumbai'].map((cityName) => (
                <PopularCityWeather key={cityName} city={cityName} />
              ))}
            </div>

            {recentSearches.length > 0 && (
              <div className="mb-4">
                <h3 className="font-semibold text-gray-700 dark:text-gray-300 mb-1">Recent Searches:</h3>
                <ul className="list-disc pl-5 text-sm text-gray-600 dark:text-gray-400">
                  {recentSearches.map((city, idx) => (
                    <li key={idx}>{city}</li>
                  ))}
                </ul>
              </div>
            )}

            {error && <p className="text-red-500 mb-4">{error}</p>}

            {weather && (
              <div className="border p-4 rounded-lg shadow-md text-center bg-gray-100 dark:bg-gray-900 mb-6">
                <h2 className="text-xl font-bold mb-2">
                  {weather.location.name}, {weather.location.country}
                </h2>
                <img src={weather.current.condition.icon} alt={weather.current.condition.text} className="mx-auto" />
                <p className="text-lg">{weather.current.condition.text}</p>
                <p>🌡 Temp: {weather.current.temp_c}°C</p>
                <p>💨 Wind: {weather.current.wind_kph} kph</p>
                <p>💧 Humidity: {weather.current.humidity}%</p>
              </div>
            )}

            {forecast.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold mb-2">15-Day Forecast</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {forecast.map((day) => (
                    <div key={day.date} className="border rounded-lg p-4 text-center bg-gray-100 dark:bg-gray-800 shadow">
                      <h4 className="font-bold text-sm mb-1">{day.date}</h4>
                      <img src={day.day.condition.icon} alt={day.day.condition.text} className="mx-auto" />
                      <p className="text-sm">{day.day.condition.text}</p>
                      <p className="text-sm">🌡 {day.day.avgtemp_c}°C</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <p className="mt-6 italic text-center text-gray-600 dark:text-gray-400">{fact}</p>
          </section>

         
          <footer className="w-full col-span-3 bg-gray-100 dark:bg-gray-800 mt-10 py-4 px-6 rounded-xl shadow">
            <h2 className="font-semibold text-sm mb-2 text-gray-700 dark:text-gray-300">🌍 Latest Weather News</h2>
            <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
              <li>
                <a href="https://www.bbc.com/weather" target="_blank" className="hover:underline">Weather updates from BBC</a>
              </li>
              <li>
                <a href="https://edition.cnn.com/weather" target="_blank" className="hover:underline">Latest storm alerts from CNN</a>
              </li>
              <li>
                <a href="https://www.accuweather.com/en/weather-news" target="_blank" className="hover:underline">Global weather – AccuWeather</a>
              </li>
            </ul>
          </footer>
        </main>
      </div>
    </div>
  );
}
