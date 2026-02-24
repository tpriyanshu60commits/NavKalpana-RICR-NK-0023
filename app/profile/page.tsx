"use client";

import { useState, useEffect } from "react";
import { auth, db } from "@/lib/firebase";
import { doc, setDoc, onSnapshot } from "firebase/firestore";
import CustomSelect from "@/components/customselect";

export default function ProfilePage() {
  const [age, setAge] = useState("");
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");
  const [goal, setGoal] = useState("");
  const [sex, setSex] = useState("");
  const [activityLevel, setActivityLevel] = useState("");
  const [experienceLevel, setExperienceLevel] = useState("");
  const [goalWeight, setGoalWeight] = useState("");

  const [profileData, setProfileData] = useState<any>(null);

  // 🔥 Real-time profile listener
  useEffect(() => {
    const unsubscribeAuth = auth.onAuthStateChanged((user) => {
      if (!user) return;

      const docRef = doc(db, "profiles", user.uid);

      const unsubscribeSnapshot = onSnapshot(docRef, (docSnap) => {
        if (docSnap.exists()) {
          setProfileData(docSnap.data());
        }
      });

      return () => unsubscribeSnapshot();
    });

    return () => unsubscribeAuth();
  }, []);

  const saveProfile = async () => {
    if (!auth.currentUser) {
      alert("Not logged in");
      return;
    }

    const heightInMeters = Number(height) / 100;
    const bmi = Number(weight) / (heightInMeters * heightInMeters);

    const maintenanceCalories =
      10 * Number(weight) +
      6.25 * Number(height) -
      5 * Number(age) +
      5;

    let targetCalories = maintenanceCalories;

if (goal === "weight_loss") {
  targetCalories = maintenanceCalories - 400;
}

if (goal === "muscle_gain") {
  targetCalories = maintenanceCalories + 300;
}

if (goal === "maintain") {
  targetCalories = maintenanceCalories;
}


if (sex === "female" && targetCalories < 1200) {
  targetCalories = 1200;
}

if (sex === "male" && targetCalories < 1500) {
  targetCalories = 1500;
}

    try {
      await setDoc(doc(db, "profiles", auth.currentUser.uid), {
  age: Number(age),
  height: Number(height),
  weight: Number(weight),
  sex: sex,
  activityLevel: activityLevel,
  experienceLevel: experienceLevel,
  goal: goal,
  bmi: Number(bmi.toFixed(2)),
  maintenanceCalories: Math.round(maintenanceCalories),
  targetCalories: Math.round(targetCalories),
  goalWeight: Number(goalWeight)
  //role: "user",
});

      alert("Profile saved!");
    } catch (error: any) {
      alert(error.message);
    }
  };

 return (
  <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-blue-900 to-black flex items-center justify-center px-4 py-16">

    <div className="w-full max-w-4xl grid md:grid-cols-2 gap-10">

      {/* Profile Form Card */}
      <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 shadow-2xl border border-white/20">

        <h2 className="text-2xl font-bold text-white mb-6">
          Personal Profile
        </h2>

        <div className="space-y-4">

          <input
            className="w-full p-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-400"
            placeholder="Age"
            onChange={(e) => setAge(e.target.value)}
          />

          <input
            className="w-full p-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-400"
            placeholder="Height (cm)"
            onChange={(e) => setHeight(e.target.value)}
          />

          <input
            className="w-full p-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-400"
            placeholder="Weight (kg)"
            onChange={(e) => setWeight(e.target.value)}
          />

          
          <CustomSelect
  placeholder="Select Biological Sex"
  options={["Male", "Female", "Transgender"]}
  onSelect={(value) => setSex(value)}
/>

         <CustomSelect
  placeholder="Activity Level"
  options={["Sedentary", "Moderate", "High"]}
  onSelect={(value) => setActivityLevel(value)}
/>

          <CustomSelect
  placeholder="Experience Level"
  options={["Beginner", "Intermediate", "Advanced"]}
  onSelect={(value) => setExperienceLevel(value)}
/>

         <CustomSelect
  placeholder="Select Goal"
  options={["Weight Loss", "Muscle Gain", " Recomposition", "Endurance"]}
  onSelect={(value) => setGoal(value)}
/>

          <input
            className="w-full p-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-400"
            placeholder="Target Weight (kg)"
            onChange={(e) => setGoalWeight(e.target.value)}
          />

          <button
            onClick={saveProfile}
            className="w-full bg-indigo-600 hover:bg-indigo-700 transition-all duration-300 text-white py-3 rounded-lg font-semibold shadow-lg"
          >
            Save Profile
          </button>

        </div>
      </div>

      {/* Stats Card */}
      {profileData && (
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 shadow-2xl border border-white/20 text-white">

          <h2 className="text-2xl font-bold mb-6">
            Your Stats
          </h2>

          <div className="space-y-4">

            <div className="flex justify-between">
              <span>BMI</span>
              <span className="font-semibold">{profileData.bmi}</span>
            </div>

            <div className="flex justify-between">
              <span>Maintenance Calories</span>
              <span className="font-semibold">
                {profileData.maintenanceCalories}
              </span>
            </div>

            <div className="flex justify-between text-indigo-300">
              <span>Adaptive Target</span>
              <span className="font-bold">
                {profileData.targetCalories}
              </span>
            </div>

          </div>

        </div>
      )}

    </div>
  </div>
);
}