import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import {
  UtensilsCrossed,
  Sparkles,
  ArrowRight,
  Check,
  Flame,
  Wallet,
  Leaf,
  Heart,
} from "lucide-react";

export const Onboarding = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const cuisinesList = [
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

  const foodTypes = ["Vegetarian", "Non-Vegetarian", "Vegan", "Eggitarian"];
  const spiceLevels = ["Mild", "Medium", "Spicy"];
  const budgetOptions = ["Under ₹150", "₹150–₹300", "₹300–₹500", "₹500+"];
  const categoriesList = [
    "Biryani",
    "Dosa",
    "Pizza",
    "Burger",
    "Noodles",
    "Fried Rice",
    "Paneer",
    "Chicken",
    "Desserts",
    "Snacks",
  ];
  const dietaryRestrictions = [
    "No restrictions",
    "High protein",
    "Low calorie",
    "Low carb",
    "Gluten free",
    "Dairy free",
  ];

  // Selected state
  const [selectedCuisines, setSelectedCuisines] = useState(["South Indian"]);
  const [foodType, setFoodType] = useState("Vegetarian");
  const [spiceLevel, setSpiceLevel] = useState("Medium");
  const [budgetRange, setBudgetRange] = useState("₹150–₹300");
  const [selectedCategories, setSelectedCategories] = useState(["Dosa", "Biryani"]);
  const [dietary, setDietary] = useState("No restrictions");

  useEffect(() => {
    // Load initial if already set
    const fetchExisting = async () => {
      try {
        setLoading(true);
        const res = await api.get("/preferences");
        if (res.data) {
          if (res.data.preferred_cuisine) {
            setSelectedCuisines(res.data.preferred_cuisine.split(",").map((c) => c.trim()));
          }
          if (res.data.food_type) setFoodType(res.data.food_type);
          if (res.data.spice_level) setSpiceLevel(res.data.spice_level);
          if (res.data.budget_range) setBudgetRange(res.data.budget_range);
          if (res.data.favorite_categories) {
            setSelectedCategories(res.data.favorite_categories.split(",").map((c) => c.trim()));
          }
          if (res.data.dietary_preference) setDietary(res.data.dietary_preference);
        }
      } catch (err) {
        console.error("Failed to load existing preferences:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchExisting();
  }, []);

  const toggleCuisine = (c) => {
    if (selectedCuisines.includes(c)) {
      if (selectedCuisines.length > 1) {
        setSelectedCuisines(selectedCuisines.filter((item) => item !== c));
      }
    } else {
      setSelectedCuisines([...selectedCuisines, c]);
    }
  };

  const toggleCategory = (cat) => {
    if (selectedCategories.includes(cat)) {
      if (selectedCategories.length > 1) {
        setSelectedCategories(selectedCategories.filter((item) => item !== cat));
      }
    } else {
      setSelectedCategories([...selectedCategories, cat]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      await api.put("/preferences", {
        preferred_cuisine: selectedCuisines.join(", "),
        food_type: foodType,
        spice_level: spiceLevel,
        budget_range: budgetRange,
        favorite_categories: selectedCategories.join(", "),
        dietary_preference: dietary,
      });
      navigate("/home");
    } catch (err) {
      console.error("Failed to save preferences:", err);
      alert("Failed to save preferences. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#faf7f2]">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-orange-500 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#faf7f2] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-orange-600 to-amber-500 flex items-center justify-center text-white mx-auto shadow-lg shadow-orange-500/20 mb-3">
            <Sparkles className="w-6 h-6" />
          </div>
          <h1 className="text-3xl font-extrabold text-stone-900">
            Tell Us What You Love to Eat
          </h1>
          <p className="text-sm text-stone-600 mt-2 max-w-lg mx-auto">
            Our transparent scoring algorithm uses your taste criteria to compute exact match
            percentages (+30 Cuisine, +25 Diet, +20 Category, +10 Budget, +10 Spice).
          </p>
        </div>

        {/* Preference Form */}
        <form onSubmit={handleSubmit} className="bg-white rounded-3xl p-6 sm:p-10 shadow-xl border border-stone-200/80 space-y-8">
          {/* 1. Cuisines */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <UtensilsCrossed className="w-4 h-4 text-orange-600" />
              <h2 className="text-sm font-bold text-stone-900 uppercase tracking-wider">
                1. Preferred Cuisines <span className="text-xs font-normal text-stone-500">(Pick one or more)</span>
              </h2>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2.5">
              {cuisinesList.map((c) => {
                const selected = selectedCuisines.includes(c);
                return (
                  <button
                    key={c}
                    type="button"
                    onClick={() => toggleCuisine(c)}
                    className={`py-3 px-3 rounded-2xl text-xs font-bold transition-all border text-center flex items-center justify-center gap-1.5 cursor-pointer ${
                      selected
                        ? "bg-orange-600 text-white border-orange-600 shadow-md shadow-orange-600/20"
                        : "bg-stone-50 hover:bg-stone-100 text-stone-700 border-stone-200"
                    }`}
                  >
                    {selected && <Check className="w-3.5 h-3.5" />}
                    <span>{c}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 2. Food Type (Diet) */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Leaf className="w-4 h-4 text-emerald-600" />
              <h2 className="text-sm font-bold text-stone-900 uppercase tracking-wider">
                2. Food / Dietary Type
              </h2>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {foodTypes.map((type) => {
                const selected = foodType === type;
                return (
                  <button
                    key={type}
                    type="button"
                    onClick={() => setFoodType(type)}
                    className={`py-3 px-3 rounded-2xl text-xs font-bold transition-all border text-center cursor-pointer ${
                      selected
                        ? "bg-emerald-600 text-white border-emerald-600 shadow-md shadow-emerald-600/20"
                        : "bg-stone-50 hover:bg-stone-100 text-stone-700 border-stone-200"
                    }`}
                  >
                    {type}
                  </button>
                );
              })}
            </div>
          </div>

          {/* 3. Favorite Food Categories */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Heart className="w-4 h-4 text-rose-500" />
              <h2 className="text-sm font-bold text-stone-900 uppercase tracking-wider">
                3. Favorite Food Categories <span className="text-xs font-normal text-stone-500">(Pick your favorites)</span>
              </h2>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2.5">
              {categoriesList.map((cat) => {
                const selected = selectedCategories.includes(cat);
                return (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => toggleCategory(cat)}
                    className={`py-2.5 px-3 rounded-2xl text-xs font-bold transition-all border text-center flex items-center justify-center gap-1.5 cursor-pointer ${
                      selected
                        ? "bg-rose-500 text-white border-rose-500 shadow-md shadow-rose-500/20"
                        : "bg-stone-50 hover:bg-stone-100 text-stone-700 border-stone-200"
                    }`}
                  >
                    {selected && <Check className="w-3.5 h-3.5" />}
                    <span>{cat}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 4. Spice & Budget Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Spice Preference */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Flame className="w-4 h-4 text-red-500" />
                <h2 className="text-sm font-bold text-stone-900 uppercase tracking-wider">
                  4. Spice Tolerance
                </h2>
              </div>
              <div className="grid grid-cols-3 gap-2">
                {spiceLevels.map((s) => {
                  const selected = spiceLevel === s;
                  return (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setSpiceLevel(s)}
                      className={`py-2.5 rounded-2xl text-xs font-bold transition-all border text-center cursor-pointer ${
                        selected
                          ? "bg-stone-900 text-white border-stone-900 shadow-xs"
                          : "bg-stone-50 hover:bg-stone-100 text-stone-700 border-stone-200"
                      }`}
                    >
                      {s}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Target Budget Range */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Wallet className="w-4 h-4 text-amber-600" />
                <h2 className="text-sm font-bold text-stone-900 uppercase tracking-wider">
                  5. Budget Range
                </h2>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {budgetOptions.map((b) => {
                  const selected = budgetRange === b;
                  return (
                    <button
                      key={b}
                      type="button"
                      onClick={() => setBudgetRange(b)}
                      className={`py-2.5 px-2 rounded-2xl text-xs font-bold transition-all border text-center cursor-pointer ${
                        selected
                          ? "bg-amber-600 text-white border-amber-600 shadow-xs"
                          : "bg-stone-50 hover:bg-stone-100 text-stone-700 border-stone-200"
                      }`}
                    >
                      {b}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* 6. Dietary Focus */}
          <div>
            <h2 className="text-sm font-bold text-stone-900 uppercase tracking-wider mb-2">
              6. Special Dietary Focus
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {dietaryRestrictions.map((diet) => {
                const selected = dietary === diet;
                return (
                  <button
                    key={diet}
                    type="button"
                    onClick={() => setDietary(diet)}
                    className={`py-2 px-3 rounded-2xl text-xs font-semibold transition-all border text-center cursor-pointer ${
                      selected
                        ? "bg-stone-800 text-white border-stone-800"
                        : "bg-stone-50 hover:bg-stone-100 text-stone-600 border-stone-200"
                    }`}
                  >
                    {diet}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Save Button */}
          <div className="pt-4 border-t border-stone-100">
            <button
              type="submit"
              disabled={saving}
              className="w-full py-3.5 bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 text-white font-bold rounded-2xl shadow-lg shadow-orange-600/25 hover:shadow-orange-600/35 transition-all flex items-center justify-center gap-2 cursor-pointer text-base"
            >
              {saving ? (
                <span>Calibrating Recommendation Engine...</span>
              ) : (
                <>
                  <span>Save Taste Preferences & Explore Menu</span>
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Onboarding;
