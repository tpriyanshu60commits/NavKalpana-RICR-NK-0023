"use client";
import { useState, useRef, useEffect } from "react";

interface Props {
  options: string[];
  placeholder: string;
  onSelect: (value: string) => void;
}

export default function CustomSelect({
  options,
  placeholder,
  onSelect,
}: Props) {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (event: any) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (value: string) => {
    setSelected(value);
    onSelect(value);
    setOpen(false);
  };

  return (
    <div ref={dropdownRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full p-3 rounded-lg bg-white/10 border border-white/20 text-white text-left flex items-center justify-between hover:border-indigo-400 transition"
      >
        <span className={selected ? "text-white" : "text-gray-400"}>
          {selected || placeholder}
        </span>

        {/* Arrow */}
        <svg
          className={`w-5 h-5 transition-transform duration-300 ${
            open ? "rotate-180" : ""
          }`}
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {open && (
        <div className="absolute w-full mt-2 bg-slate-900 border border-white/20 rounded-lg shadow-xl z-50 overflow-hidden animate-fadeIn">
          {options.map((option, index) => (
            <div
              key={index}
              onClick={() => handleSelect(option)}
              className="p-3 hover:bg-indigo-600 hover:text-white cursor-pointer transition"
            >
              {option}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}