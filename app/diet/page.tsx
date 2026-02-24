"use client";

import { useEffect, useState } from "react";
import { auth, db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function DietPage() {
  const [profile, setProfile] = useState<any>(null);
  const [macroData, setMacroData] = useState<any[]>([]);
  const [meals, setMeals] = useState<number[]>([]);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!auth.currentUser) return;

      const snap = await getDoc(
        doc(db, "profiles", auth.currentUser.uid)
      );

      if (snap.exists()) {
        const data = snap.data();
        setProfile(data);
        generateDiet(data);
      }
    };

    fetchProfile();
  }, []);

  const generateDiet = (data: any) => {
    const calories = data.targetCalories || 2000;
    const goal = data.goal?.toLowerCase();

    let proteinRatio = 0.3;
    let carbRatio = 0.4;
    let fatRatio = 0.3;

    if (goal === "weight_loss") {
      proteinRatio = 0.4;
      carbRatio = 0.3;
      fatRatio = 0.3;
    }

    if (goal === "muscle_gain") {
      proteinRatio = 0.3;
      carbRatio = 0.5;
      fatRatio = 0.2;
    }

    if (goal === "recomposition") {
      proteinRatio = 0.35;
      carbRatio = 0.4;
      fatRatio = 0.25;
    }

    if (goal === "endurance") {
      proteinRatio = 0.25;
      carbRatio = 0.55;
      fatRatio = 0.2;
    }

    const protein = Math.round((calories * proteinRatio) / 4);
    const carbs = Math.round((calories * carbRatio) / 4);
    const fat = Math.round((calories * fatRatio) / 9);

    setMacroData([
      { name: "Protein", value: protein },
      { name: "Carbs", value: carbs },
      { name: "Fat", value: fat },
    ]);

    const mealsPerDay = 4;
    const caloriesPerMeal = Math.round(calories / mealsPerDay);
    setMeals(Array(mealsPerDay).fill(caloriesPerMeal));
  };

  const COLORS = ["#6366f1", "#22c55e", "#f59e0b"];

  if (!profile) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-blue-900 to-black px-6 py-16 flex flex-col items-center text-white">

      <h1 className="text-4xl font-bold mb-10">
        Weekly Diet Plan
      </h1>

      <div className="grid md:grid-cols-2 gap-10 w-full max-w-5xl">

        {/* Nutrition Card */}
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 shadow-2xl border border-white/20">

          <h2 className="text-xl font-semibold mb-6">
            Daily Nutrition Target
          </h2>

          <div className="space-y-3 mb-6">
            <div className="flex justify-between">
              <span>Total Calories</span>
              <span className="font-semibold">
                {profile.targetCalories} kcal
              </span>
            </div>

            {macroData.map((macro, index) => (
              <div key={index} className="flex justify-between">
                <span>{macro.name}</span>
                <span className="font-semibold">
                  {macro.value} g
                </span>
              </div>
            ))}
          </div>

          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={macroData}
                  dataKey="value"
                  outerRadius={90}
                  label
                >
                  {macroData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

        </div>

        {/* Meal Structure */}
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 shadow-2xl border border-white/20">

          <h2 className="text-xl font-semibold mb-6">
            Meal Structure
          </h2>

          <div className="space-y-4">
            {meals.map((cal, index) => (
              <div
                key={index}
                className="flex justify-between p-4 bg-white/5 rounded-lg border border-white/10"
              >
                <span>Meal {index + 1}</span>
                <span>{cal} kcal</span>
              </div>
            ))}
          </div>

        </div>

      </div>

    </div>
  );
}