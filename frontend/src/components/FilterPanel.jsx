import React from "react";
import { Filter, RotateCcw } from "lucide-react";

export const FilterPanel = ({ filters, onChange, onReset }) => {
  const cuisines = [
    "All",
    "South Indian",
    "North Indian",
    "Chinese",
    "Italian",
    "Mexican",
    "Korean",
    "Japanese",
    "Arabian",
    "Fast Food",
    "Desserts",
  ];

  const foodTypes = ["All", "Vegetarian", "Non-Vegetarian", "Vegan", "Eggitarian"];
  const spiceLevels = ["All", "Mild", "Medium", "Spicy"];
  const budgetOptions = [
    { label: "All Prices", value: "" },
    { label: "Under ₹150", value: "150" },
    { label: "Under ₹300", value: "300" },
    { label: "Under ₹500", value: "500" },
  ];
  const ratingOptions = [
    { label: "All Ratings", value: "" },
    { label: "4.0+ Stars", value: "4.0" },
    { label: "4.5+ Stars", value: "4.5" },
  ];

  return (
    <div className="bg-white rounded-2xl p-5 border border-stone-200/80 shadow-xs space-y-5">
      <div className="flex items-center justify-between pb-3 border-b border-stone-100">
        <div className="flex items-center gap-2 text-stone-900 font-bold text-base">
          <Filter className="w-4 h-4 text-orange-600" />
          <span>Filters</span>
        </div>
        <button
          onClick={onReset}
          className="text-xs text-orange-600 hover:text-orange-700 font-semibold flex items-center gap-1 cursor-pointer"
        >
          <RotateCcw className="w-3 h-3" />
          Reset All
        </button>
      </div>

      {/* Cuisine Filter */}
      <div>
        <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-2">
          Cuisine
        </label>
        <div className="flex flex-wrap gap-1.5">
          {cuisines.map((c) => {
            const isSelected = (!filters.cuisine && c === "All") || filters.cuisine === c;
            return (
              <button
                key={c}
                type="button"
                onClick={() => onChange("cuisine", c === "All" ? "" : c)}
                className={`px-3 py-1 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                  isSelected
                    ? "bg-orange-600 text-white shadow-xs"
                    : "bg-stone-100 text-stone-700 hover:bg-stone-200"
                }`}
              >
                {c}
              </button>
            );
          })}
        </div>
      </div>

      {/* Food Type Filter */}
      <div>
        <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-2">
          Dietary Type
        </label>
        <div className="flex flex-wrap gap-1.5">
          {foodTypes.map((type) => {
            const isSelected = (!filters.food_type && type === "All") || filters.food_type === type;
            return (
              <button
                key={type}
                type="button"
                onClick={() => onChange("food_type", type === "All" ? "" : type)}
                className={`px-3 py-1 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                  isSelected
                    ? "bg-emerald-600 text-white shadow-xs"
                    : "bg-stone-100 text-stone-700 hover:bg-stone-200"
                }`}
              >
                {type}
              </button>
            );
          })}
        </div>
      </div>

      {/* Spice Level */}
      <div>
        <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-2">
          Spice Level
        </label>
        <div className="grid grid-cols-4 gap-1.5">
          {spiceLevels.map((s) => {
            const isSelected = (!filters.spice_level && s === "All") || filters.spice_level === s;
            return (
              <button
                key={s}
                type="button"
                onClick={() => onChange("spice_level", s === "All" ? "" : s)}
                className={`py-1 text-center rounded-lg text-xs font-medium transition-all cursor-pointer ${
                  isSelected
                    ? "bg-stone-900 text-white shadow-xs"
                    : "bg-stone-100 text-stone-700 hover:bg-stone-200"
                }`}
              >
                {s}
              </button>
            );
          })}
        </div>
      </div>

      {/* Budget / Price Max */}
      <div>
        <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-2">
          Budget Tier
        </label>
        <div className="grid grid-cols-2 gap-1.5">
          {budgetOptions.map((b) => {
            const isSelected = filters.max_price === b.value;
            return (
              <button
                key={b.label}
                type="button"
                onClick={() => onChange("max_price", b.value)}
                className={`py-1.5 px-2 text-center rounded-lg text-xs font-medium transition-all cursor-pointer ${
                  isSelected
                    ? "bg-amber-600 text-white shadow-xs"
                    : "bg-stone-100 text-stone-700 hover:bg-stone-200"
                }`}
              >
                {b.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Rating Filter */}
      <div>
        <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-2">
          Customer Rating
        </label>
        <div className="grid grid-cols-3 gap-1.5">
          {ratingOptions.map((r) => {
            const isSelected = filters.min_rating === r.value;
            return (
              <button
                key={r.label}
                type="button"
                onClick={() => onChange("min_rating", r.value)}
                className={`py-1.5 text-center rounded-lg text-xs font-medium transition-all cursor-pointer ${
                  isSelected
                    ? "bg-amber-500 text-white shadow-xs"
                    : "bg-stone-100 text-stone-700 hover:bg-stone-200"
                }`}
              >
                {r.label}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default FilterPanel;
