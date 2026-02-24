"use client";

import { useState, useEffect } from "react";
import { auth, db } from "@/lib/firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

export default function MeasurementsPage() {
  const [waist, setWaist] = useState("");
  const [chest, setChest] = useState("");
  const [hips, setHips] = useState("");
  const [arms, setArms] = useState("");
  const [thighs, setThighs] = useState("");

  const [history, setHistory] = useState<any[]>([]);

  useEffect(() => {
    fetchMeasurements();
  }, []);

  const fetchMeasurements = async () => {
    if (!auth.currentUser) return;

    const snap = await getDoc(
      doc(db, "measurements", auth.currentUser.uid)
    );

    if (snap.exists()) {
      setHistory(snap.data().history || []);
    }
  };

  const saveMeasurement = async () => {
    if (!auth.currentUser) return;

    const newEntry = {
      date: new Date().toISOString().split("T")[0],
      waist: Number(waist),
      chest: Number(chest),
      hips: Number(hips),
      arms: Number(arms),
      thighs: Number(thighs),
    };

    const updatedHistory = [...history, newEntry];

    await setDoc(
      doc(db, "measurements", auth.currentUser.uid),
      { history: updatedHistory },
      { merge: true }
    );

    setHistory(updatedHistory);
    alert("Measurement saved.");
  };

  const first = history[0];
  const latest = history[history.length - 1];

  const getChange = (field: string) => {
    if (!first || !latest) return 0;
    return latest[field] - first[field];
  };

  const chartData = history.map((item, index) => ({
    month: `Entry ${index + 1}`,
    waist: item.waist,
    chest: item.chest,
  }));

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-blue-900 to-black text-white p-10">

      <h1 className="text-3xl font-bold mb-8">
        Body Measurement Tracking
      </h1>

      <div className="grid md:grid-cols-2 gap-10">

        {/* Input Section */}
        <div className="bg-white/10 p-6 rounded-xl border border-white/20 space-y-4">

          <input placeholder="Waist (cm)" className="inputStyle"
            onChange={(e) => setWaist(e.target.value)} />

          <input placeholder="Chest (cm)" className="inputStyle"
            onChange={(e) => setChest(e.target.value)} />

          <input placeholder="Hips (cm)" className="inputStyle"
            onChange={(e) => setHips(e.target.value)} />

          <input placeholder="Arms (cm)" className="inputStyle"
            onChange={(e) => setArms(e.target.value)} />

          <input placeholder="Thighs (cm)" className="inputStyle"
            onChange={(e) => setThighs(e.target.value)} />

          <button
            onClick={saveMeasurement}
            className="w-full bg-indigo-600 py-2 rounded-lg"
          >
            Save Measurement
          </button>

        </div>

        {/* Change Since Start */}
        {first && latest && (
          <div className="bg-white/10 p-6 rounded-xl border border-white/20">

            <h2 className="text-xl font-semibold mb-4">
              Change Since Start
            </h2>

            <div className="space-y-2">
              <p>Waist: {getChange("waist")} cm</p>
              <p>Chest: {getChange("chest")} cm</p>
              <p>Hips: {getChange("hips")} cm</p>
              <p>Arms: {getChange("arms")} cm</p>
              <p>Thighs: {getChange("thighs")} cm</p>
            </div>

          </div>
        )}

      </div>

      {/* Line Graph */}
      {history.length > 1 && (
        <div className="mt-10 bg-white/10 p-6 rounded-xl border border-white/20">
          <h2 className="text-xl font-semibold mb-4">
            Measurement Trend
          </h2>

          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="waist" stroke="#6366f1" />
                <Line type="monotone" dataKey="chest" stroke="#22c55e" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

    </div>
  );
}