"use client";

import { useState, useEffect } from "react";
import { auth } from "@/lib/firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
} from "firebase/auth";
import { useRouter } from "next/navigation";
export default function AuthPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const router = useRouter();
   
  useEffect(() => {
  const unsubscribe = onAuthStateChanged(auth, (user) => {
    if (user) {
      router.push("/"); // or "/dashboard" if that’s your route
    }
  });

  return () => unsubscribe();
}, []);
  const handleAuth = async () => {
  setError("");

  try {
    if (isLogin) {
      await signInWithEmailAndPassword(auth, email, password);
    } else {
      await createUserWithEmailAndPassword(auth, email, password);
    }
  } catch (err: any) {
    setError(err.message);
  }
};
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-blue-900 to-black flex items-center justify-center px-6">

      <div className="w-full max-w-4xl grid md:grid-cols-2 bg-white/10 backdrop-blur-md rounded-2xl shadow-2xl border border-white/20 overflow-hidden">

        {/* Left Side Branding */}
        <div className="hidden md:flex flex-col justify-center items-center p-10 text-white bg-indigo-700/30">
          <h1 className="text-4xl font-bold mb-4">FitAI</h1>
          <p className="text-sm text-center opacity-80">
            Adaptive fitness intelligence that evolves with your progress.
          </p>
        </div>

        {/* Right Side Form */}
        <div className="p-10 text-white">

          <h2 className="text-2xl font-semibold mb-6">
            {isLogin ? "Welcome Back" : "Create Account"}
          </h2>

          <div className="space-y-4">

            <input
              type="email"
              placeholder="Email"
              className="w-full p-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-400"
              onChange={(e) => setEmail(e.target.value)}
            />

            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                className="w-full p-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                onChange={(e) => setPassword(e.target.value)}
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 text-sm text-gray-300 hover:text-white"
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>

            {error && (
              <div className="text-red-400 text-sm bg-red-500/10 p-2 rounded">
                {error}
              </div>
            )}

            <button
              onClick={handleAuth}
              className="w-full bg-indigo-600 hover:bg-indigo-700 transition-all duration-300 text-white py-3 rounded-lg font-semibold shadow-lg"
            >
              {isLogin ? "Login" : "Sign Up"}
            </button>

            <div className="text-sm text-center mt-4">
              {isLogin ? (
                <>
                  Don’t have an account?{" "}
                  <button
                    onClick={() => setIsLogin(false)}
                    className="text-indigo-400 hover:underline"
                  >
                    Sign Up
                  </button>
                </>
              ) : (
                <>
                  Already have an account?{" "}
                  <button
                    onClick={() => setIsLogin(true)}
                    className="text-indigo-400 hover:underline"
                  >
                    Login
                  </button>
                </>
              )}
            </div>

          </div>

        </div>

      </div>

    </div>
  );
}