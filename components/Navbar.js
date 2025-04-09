'use client';

import Link from 'next/link';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();

  return (
    <nav className="flex justify-between items-center px-6 py-4 bg-blue-600 text-white shadow">
      <Link href="/" className="text-xl font-bold">
        Clima ☁️
      </Link>

      <div className="flex items-center gap-4">
        {!user && (
          <>
            <Link href="/login" className="hover:underline">
              Login
            </Link>
            <Link href="/signup" className="hover:underline">
              Sign Up
            </Link>
          </>
        )}

        {user && (
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
