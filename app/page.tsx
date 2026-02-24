"use client";
import {LineChart,Line,XAxis,YAxis,Tooltip,CartesianGrid,ResponsiveContainer,BarChart,Bar,PieChart,Pie,Cell} from "recharts";
import { useState, useEffect } from "react";
import { auth, db } from "@/lib/firebase";
import { doc, onSnapshot } from "firebase/firestore";

export default function Dashboard() {
  const [profile, setProfile] = useState<any>(null);
  const [progress, setProgress] = useState<any>(null);

  useEffect(() => {
    const unsubscribeAuth = auth.onAuthStateChanged((user) => {
      if (!user) return;

      const profileRef = doc(db, "profiles", user.uid);
      const progressRef = doc(db, "progress", user.uid);

      const unsubProfile = onSnapshot(profileRef, (snap) => {
        if (snap.exists()) setProfile(snap.data());
      });

      const unsubProgress = onSnapshot(progressRef, (snap) => {
        if (snap.exists()) setProgress(snap.data());
      });

      return () => {
        unsubProfile();
        unsubProgress();
      };
    });

    return () => unsubscribeAuth();
  }, []);

  // 🔥 Forecast Engine
  const calculateForecast = () => {
    if (!profile || !progress || !progress.history) return null;

    const history = progress.history;
    if (history.length < 2) return null;

    const firstWeight = history[0];
    const latestWeight = history[history.length - 1];

    const totalChange = latestWeight - firstWeight;
    const weeksTracked = history.length - 1;

    if (weeksTracked <= 0) return null;

    const avgWeeklyChange = totalChange / weeksTracked;
    if (!profile.goalWeight) return null;

    const goalWeight = profile.goalWeight;
    const remainingWeight = goalWeight - latestWeight;

    if (profile.goal === "weight_loss" && avgWeeklyChange >= 0) return null;
    if (profile.goal === "muscle_gain" && avgWeeklyChange <= 0) return null;
    if (avgWeeklyChange === 0) return null;

    const estimatedWeeks = Math.abs(
      Math.round(remainingWeight / avgWeeklyChange)
    );

    if (!isFinite(estimatedWeeks) || estimatedWeeks <= 0) return null;

    return estimatedWeeks;
  };

  const forecastWeeks = calculateForecast();

  // 🔥 Drop-Off Risk Detection
  const calculateDropOffRisk = () => {
    if (!progress || !progress.history) return null;

    const history = progress.history;

    if (history.length >= 3) {
      const lastThree = history.slice(-3);
      if (
        lastThree[0] === lastThree[1] &&
        lastThree[1] === lastThree[2]
      ) {
        return "⚠️ Plateau detected for 3 weeks.";
      }
    }

    if (progress.habitScore < 50) {
      return "⚠️ Low adherence risk detected.";
    }

    return null;
  };

  const dropOffMessage = calculateDropOffRisk();

  const chartData =
  progress?.history?.map((weight: number, index: number) => ({
    week: `Week ${index + 1}`,
    weight,
  })) || [];

  const weightChart =
  progress?.history?.map((weight: number, index: number) => ({
    week: `W${index + 1}`,
    weight,
  })) || [];

const habitData = [
  {
    name: "Habit Score",
    value: progress?.habitScore || 0,
  },
];

const adherencePie = [
  {
    name: "Workout",
    value: progress?.workoutAdherence || 0,
  },
  {
    name: "Diet",
    value: progress?.dietAdherence || 0,
  },
];

const weightComparison =
  progress?.history?.slice(-2).map((weight: number, index: number) => ({
    label: index === 0 ? "Last Week" : "This Week",
    weight,
  })) || [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex flex-col items-center px-6 py-16">

      <h1 className="text-5xl font-extrabold mb-4 tracking-tight text-gray-900">
        FitAI
      </h1>

      {/* 🔥 System Status Badge */}
      {progress && (
        <div className="mb-6">
          {progress.habitScore >= 80 && (
            <div className="px-4 py-2 rounded-full bg-green-100 text-green-700 font-medium text-sm">
              🟢 System Optimized – High adherence detected
            </div>
          )}
          {progress.habitScore >= 50 && progress.habitScore < 80 && (
            <div className="px-4 py-2 rounded-full bg-yellow-100 text-yellow-700 font-medium text-sm">
              🟡 System Adapting – Moderate adherence
            </div>
          )}
          {progress.habitScore < 50 && (
            <div className="px-4 py-2 rounded-full bg-red-100 text-red-700 font-medium text-sm">
              🔴 Needs Attention – Low adherence detected
            </div>
          )}
        </div>
      )}

      <p className="text-lg text-gray-600 mb-12 text-center max-w-xl">
        An adaptive fitness intelligence system that personalizes workouts,
        adjusts calories, and evolves based on your real progress.
      </p>

      <div className="grid md:grid-cols-2 gap-10 w-full max-w-5xl">

        {profile && (
          <div className="bg-white/70 backdrop-blur-md shadow-xl rounded-2xl p-8 border border-gray-200">
            <h2 className="text-2xl font-semibold mb-6 text-gray-800">
              Body Metrics
            </h2>

            <div className="space-y-3">
              <div className="flex justify-between">
                <span>BMI</span>
                <span className="font-semibold">{profile.bmi}</span>
              </div>

              <div className="flex justify-between">
                <span>Maintenance Calories</span>
                <span className="font-semibold">
                  {profile.maintenanceCalories}
                </span>
              </div>

              <div className="flex justify-between text-blue-600 text-lg">
                <span>Adaptive Target</span>
                <span className="font-bold">
                  {profile.targetCalories}
                </span>
              </div>
            </div>

            {profile.adaptationMessage && (
              <div className="mt-6 p-4 rounded-lg bg-blue-100 border border-blue-300 text-blue-800 text-sm">
                🧠 {profile.adaptationMessage}
              </div>
            )}
          </div>
        )}

        {progress && (
          <div className="bg-white/70 backdrop-blur-md shadow-xl rounded-2xl p-8 border border-gray-200">
            <h2 className="text-2xl font-semibold mb-6 text-gray-800">
              Weekly Adaptation
            </h2>

            <div className="space-y-3">
              <div>
                <div className="flex justify-between mb-2">
                  <span>Habit Score</span>
                  <span className="font-semibold">
                    {progress.habitScore}
                  </span>
                </div>

                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div
                    className={`h-3 rounded-full ${
                      progress.habitScore < 50
                        ? "bg-red-500"
                        : progress.habitScore < 80
                        ? "bg-yellow-500"
                        : "bg-green-500"
                    }`}
                    style={{ width: `${progress.habitScore}%` }}
                  ></div>
                </div>
              </div>

              <div className="flex justify-between">
                <span>Current Weight</span>
                <span className="font-semibold">
                  {progress.currentWeight}
                </span>
              </div>
              {/*  Energy & Recovery Status */}
{progress?.fatigueLevel && (
  <div className="mt-4 p-3 rounded-lg bg-yellow-500/20 border border-yellow-400 text-yellow-300 text-sm">
    ⚡ Energy Status: {progress.fatigueLevel.replace("_", " ")}
  </div>
)}
            </div>
          </div>
        )}
      </div>

      {/* 🔥 Forecast */}
      {forecastWeeks && (
        <div className="mt-10 p-6 bg-purple-100 border border-purple-300 rounded-xl text-purple-800 max-w-md text-center">
          📅 Estimated time to reach goal: {forecastWeeks} weeks
        </div>
      )}

      {/* 🔥 Drop-Off Warning */}
      {dropOffMessage && (
        <div className="mt-6 p-4 bg-red-100 border border-red-300 rounded-xl text-red-700 text-center max-w-md">
          {dropOffMessage}
        </div>
      )}
        {weightChart.length > 1 && (
  <div className="mt-16 grid md:grid-cols-2 gap-8 w-full max-w-6xl">

    {/* 📈 Weight Trend */}
    <div className="bg-white rounded-xl p-6 shadow-md border border-gray-200">
      <h3 className="text-lg font-semibold mb-4 text-gray-800">
        Weight Trend
      </h3>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={weightChart}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="week" />
            <YAxis />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="weight"
              stroke="#3B82F6"
              strokeWidth={3}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>

    {/* 📊 Habit Score Bar */}
    <div className="bg-white rounded-xl p-6 shadow-md border border-gray-200">
      <h3 className="text-lg font-semibold mb-4 text-gray-800">
        Habit Performance
      </h3>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={habitData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis domain={[0, 100]} />
            <Tooltip />
            <Bar dataKey="value" fill="#10B981" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>

    {/*  Diet vs Workout Pie */}
    <div className="bg-white rounded-xl p-6 shadow-md border border-gray-200">
      <h3 className="text-lg font-semibold mb-4 text-gray-800">
        Adherence Breakdown
      </h3>
      <div className="h-64 flex justify-center">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={adherencePie}
              dataKey="value"
              nameKey="name"
              outerRadius={80}
              label
            >
              <Cell fill="#3B82F6" />
              <Cell fill="#F59E0B" />
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>

    {/* Weekly Weight Comparison */}
    {weightComparison.length === 2 && (
      <div className="bg-white rounded-xl p-6 shadow-md border border-gray-200">
        <h3 className="text-lg font-semibold mb-4 text-gray-800">
          Weekly Comparison
        </h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={weightComparison}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="label" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="weight" fill="#6366F1" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    )}

  </div>
)}
    </div>
  );
}