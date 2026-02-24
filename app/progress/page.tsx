"use client";

import { useState } from "react";
import { auth, db } from "@/lib/firebase";
import { doc, setDoc, getDoc } from "firebase/firestore";
import CustomSelect from "@/components/customselect";

export default function ProgressPage() {
  const [weight, setWeight] = useState("");
  const [workoutAdherence, setWorkoutAdherence] = useState("");
  const [dietAdherence, setDietAdherence] = useState("");
  const [fatigueLevel, setFatigueLevel] = useState("");

  const habitScore =
    Number(workoutAdherence || 0) * 0.6 +
    Number(dietAdherence || 0) * 0.4;

  const saveProgress = async () => {
    if (!auth.currentUser) return;

    const progressRef = doc(db, "progress", auth.currentUser.uid);

    // 🔥 Fetch existing progress data (IMPORTANT)
    const progressSnap = await getDoc(progressRef);

    let existingHistory: number[] = [];
    let existingFatigueHistory: string[] = [];

    if (progressSnap.exists()) {
      const data = progressSnap.data();
      existingHistory = data.history || [];
      existingFatigueHistory = data.fatigueHistory || [];
    }

    const updatedHistory = [...existingHistory, Number(weight)];
    const updatedFatigueHistory = [...existingFatigueHistory, fatigueLevel];

    await setDoc(
      progressRef,
      {
        currentWeight: Number(weight),
        workoutAdherence: Number(workoutAdherence),
        dietAdherence: Number(dietAdherence),
        habitScore: Number(habitScore.toFixed(2)),
        fatigueLevel: fatigueLevel,
        history: updatedHistory, // ✅ Proper append
        fatigueHistory: updatedFatigueHistory, // ✅ Proper append
      },
      { merge: true }
    );

    alert("Progress saved successfully.");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-blue-900 to-black flex items-center justify-center px-4 py-16">

      <div className="w-full max-w-xl bg-white/10 backdrop-blur-md rounded-2xl p-8 shadow-2xl border border-white/20">

        <h2 className="text-2xl font-bold text-white mb-6 text-center">
          Weekly Progress
        </h2>

        <div className="space-y-5">

          <input
            className="w-full p-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-400"
            placeholder="Current Weight (kg)"
            onChange={(e) => setWeight(e.target.value)}
          />

          <input
            className="w-full p-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-400"
            placeholder="Workout Adherence %"
            onChange={(e) => setWorkoutAdherence(e.target.value)}
          />

          <input
            className="w-full p-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-400"
            placeholder="Diet Adherence %"
            onChange={(e) => setDietAdherence(e.target.value)}
          />

          <CustomSelect
            placeholder="Select Energy Level"
            options={[
              "energized",
              "normal",
              "slightly_fatigued",
              "very_tired",
            ]}
            onSelect={(value) => setFatigueLevel(value)}
          />

          {/* Live Habit Score Preview */}
          <div className="mt-4">
            <div className="flex justify-between text-white mb-2">
              <span>Habit Score</span>
              <span>{habitScore.toFixed(1)}</span>
            </div>

            <div className="w-full bg-gray-700 rounded-full h-3">
              <div
                className={`h-3 rounded-full transition-all duration-300 ${
                  habitScore < 50
                    ? "bg-red-500"
                    : habitScore < 80
                    ? "bg-yellow-500"
                    : "bg-green-500"
                }`}
                style={{ width: `${habitScore}%` }}
              ></div>
            </div>
          </div>

          <button
            onClick={saveProgress}
            className="w-full bg-indigo-600 hover:bg-indigo-700 transition-all duration-300 text-white py-3 rounded-lg font-semibold shadow-lg"
          >
            Save Progress
          </button>

        </div>
      </div>
    </div>
  );
}