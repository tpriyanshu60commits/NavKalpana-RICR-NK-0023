"use client";

import { useState, useEffect } from "react";
import { auth, db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";

export default function WorkoutPage() {
  const [plan, setPlan] = useState<string[]>([]);
  const [profile, setProfile] = useState<any>(null);
  const [progress, setProgress] = useState<any>(null);
  const fatigue = progress?.fatigueLevel;
const fatigueHistory = progress?.fatigueHistory || [];

  useEffect(() => {
    const fetchData = async () => {
      if (!auth.currentUser) return;

      const profileSnap = await getDoc(
        doc(db, "profiles", auth.currentUser.uid)
      );

      const progressSnap = await getDoc(
        doc(db, "progress", auth.currentUser.uid)
      );

      if (profileSnap.exists()) setProfile(profileSnap.data());
      if (progressSnap.exists()) setProgress(progressSnap.data());
    };

    fetchData();
  }, []);

  const generatePlan = () => {
    if (!profile) return;

    const goal = profile.goal;
    const level = profile.experienceLevel || "beginner";
    const adherence = progress?.habitScore || 60;

    let workout: string[] = [];

     if (fatigue === "very_tired") {
  workout = [
    "Mobility + Stretching",
    "Light Walk",
    "Breathing Exercises",
    "Rest",
    "Light Core",
    "Rest",
    "Rest"
  ];
}
if (fatigue === "slightly_fatigued") {
  workout = workout.map(day => day + " (Reduced Volume)");
} 


const lastThree: string[] = fatigueHistory.slice(-3);

if (
  lastThree.length === 3 &&
  lastThree.every(level => level === "very_tired")
) {
  workout = [
    "Forced Recovery Week",
    "Mobility",
    "Light Cardio",
    "Stretching",
    "Rest",
    "Rest",
    "Rest"
  ];
}

    // 🔥 Weight Loss
    if (goal === "Weight Loss") {
      workout = [
        "Day 1: Full Body HIIT",
        "Day 2: Cardio + Core",
        "Day 3: Upper Body",
        "Day 4: Cardio Intervals",
        "Day 5: Lower Body",
        "Day 6: Light Cardio",
        "Day 7: Rest",
      ];
    }

    // 🔥 Muscle Gain
    else if (goal === "Muscle Gain") {
      workout = [
        "Day 1: Chest + Triceps",
        "Day 2: Back + Biceps",
        "Day 3: Legs",
        "Day 4: Shoulders",
        "Day 5: Arms + Abs",
        "Day 6: Light Cardio",
        "Day 7: Rest",
      ];
    }

    // 🔥 Recomposition
    else if (goal === "Recomposition") {
      workout = [
        "Day 1: Upper Strength",
        "Day 2: Cardio + Core",
        "Day 3: Lower Strength",
        "Day 4: HIIT",
        "Day 5: Push/Pull Mix",
        "Day 6: Mobility",
        "Day 7: Rest",
      ];
    }

    // 🔥 Endurance
    else if (goal === "Endurance") {
      workout = [
        "Day 1: Long Run",
        "Day 2: Tempo Run",
        "Day 3: Cross Training",
        "Day 4: Intervals",
        "Day 5: Strength Conditioning",
        "Day 6: Light Recovery",
        "Day 7: Rest",
      ];
    }

   
    // 🔥 Adaptive Intensity Based on Adherence
    if (adherence < 50) {
      workout = workout.map((day) => day + " (Reduced Intensity)");
    }

    if (adherence > 80) {
      workout = workout.map((day) => day + " (Progressive Overload)");
    }

    // 🔥 Experience Adjustment
    if (level === "advanced") {
      workout = workout.map((day) => day + " + Extra Volume");
    }

    setPlan(workout);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-blue-900 to-black flex flex-col items-center px-6 py-16">

      <h1 className="text-4xl font-bold text-white mb-6">
        Adaptive Workout Plan
      </h1>

      <button
        onClick={generatePlan}
        className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg shadow-lg transition"
      >
        Generate Workout Plan
      </button>

      {plan.length > 0 && (
        <div className="mt-10 w-full max-w-2xl bg-white/10 backdrop-blur-md rounded-2xl p-8 shadow-2xl border border-white/20 text-white">

          <h2 className="text-2xl font-semibold mb-6">
            Your Weekly Plan
          </h2>

          <div className="space-y-3">
            {plan.map((day, index) => (
              <div
                key={index}
                className="p-3 bg-white/5 rounded-lg border border-white/10"
              >
                {day}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}