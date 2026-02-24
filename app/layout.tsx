"use client";

import "./globals.css";
import Link from "next/link";
import { auth } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { useEffect, useState } from "react";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  return (
    <html lang="en">
      <body className="bg-gray-900 text-gray-100 min-h-screen">

        {/* NAVBAR */}
        <nav className="bg-gray-950 border-b border-gray-800">
          <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">

            <div className="text-xl font-bold">
              FitAI
            </div>

            <div className="flex items-center gap-8 text-sm text-gray-400">

              <Link href="/" className="hover:text-white transition">
                Dashboard
              </Link>

              <Link href="/profile" className="hover:text-white transition">
                Profile
              </Link>

              <Link href="/diet" className="hover:text-white transition">
                Diet
              </Link>

              <Link href="/workout" className="hover:text-white transition">
                Workout
              </Link>

              <Link href="/progress" className="hover:text-white transition">
                Progress
              </Link>

              <Link href="/measurments" className="hover:text-white transition">
                Measurements
              </Link>

              {/* Account Dropdown */}
              <div className="relative group cursor-pointer">

                <div className="bg-gray-800 px-4 py-2 rounded-lg hover:bg-gray-700 transition">
                  {user ? user.email : "Account"}
                </div>

                {/* Dropdown */}
                <div className="absolute right-0 mt-2 w-40 bg-gray-800 rounded-lg shadow-lg opacity-0 group-hover:opacity-100 invisible group-hover:visible transition-all duration-200">

                  {!user && (
                    <Link
                      href="/auth"
                      className="block px-4 py-2 hover:bg-gray-700 rounded-t-lg"
                    >
                      Login
                    </Link>
                  )}

                  {user && (
                    <button
                      onClick={() => auth.signOut()}
                      className="w-full text-left px-4 py-2 hover:bg-gray-700 rounded-b-lg"
                    >
                      Logout
                    </button>
                  )}

                </div>

              </div>

            </div>
          </div>
        </nav>

        <main className="max-w-6xl mx-auto px-6 py-16">
          {children}
        </main>

      </body>
    </html>
  );
}