import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";
import {
  User,
  Mail,
  Sliders,
  CheckCircle2,
  UtensilsCrossed,
  Sparkles,
  Save,
  Clock,
  Heart,
  Star,
} from "lucide-react";

export const Profile = () => {
  const { user, updateUser } = useAuth();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Form states
  const [name, setName] = useState("");
  const [selectedCuisines, setSelectedCuisines] = useState(["South Indian"]);
  const [foodType, setFoodType] = useState("Vegetarian");
  const [spiceLevel, setSpiceLevel] = useState("Medium");
  const [budgetRange, setBudgetRange] = useState("₹150–₹300");
  const [selectedCategories, setSelectedCategories] = useState(["Dosa"]);
  const [dietary, setDietary] = useState("No restrictions");

  const [stats, setStats] = useState({ favorites_count: 0, ratings_count: 0 });

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
  const dietaryOptions = [
    "No restrictions",
    "High protein",
    "Low calorie",
    "Low carb",
    "Gluten free",
    "Dairy free",
  ];

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const res = await api.get("/profile");
        if (res.data.user) {
          setName(res.data.user.name);
        }
        if (res.data.stats) {
          setStats(res.data.stats);
        }
        if (res.data.preferences) {
          const p = res.data.preferences;
          if (p.preferred_cuisine) {
            setSelectedCuisines(p.preferred_cuisine.split(",").map((c) => c.trim()));
          }
          if (p.food_type) setFoodType(p.food_type);
          if (p.spice_level) setSpiceLevel(p.spice_level);
          if (p.budget_range) setBudgetRange(p.budget_range);
          if (p.favorite_categories) {
            setSelectedCategories(p.favorite_categories.split(",").map((c) => c.trim()));
          }
          if (p.dietary_preference) setDietary(p.dietary_preference);
        }
      } catch (err) {
        console.error("Failed to load profile:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
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

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      await api.put("/profile", {
        preferred_cuisine: selectedCuisines.join(", "),
        food_type: foodType,
        spice_level: spiceLevel,
        budget_range: budgetRange,
        favorite_categories: selectedCategories.join(", "),
        dietary_preference: dietary,
      });

      if (name !== user?.name) {
        updateUser({ name });
      }

      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err) {
      console.error("Save error:", err);
      alert("Failed to update profile.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#faf7f2] flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-orange-500 border-t-transparent"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#faf7f2] flex flex-col">
      <Navbar />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full space-y-8">
        <div>
          <h1 className="text-3xl font-black text-stone-900 flex items-center gap-2">
            <User className="w-7 h-7 text-orange-600" />
            My Profile & Food Preferences
          </h1>
          <p className="text-xs text-stone-500 mt-1">
            Update your taste parameters at any time. Changes immediately recalculate your recommendations!
          </p>
        </div>

        {/* User Quick Info & Activity Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-stone-200/80 shadow-xs flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-orange-100 text-orange-700 font-bold text-xl flex items-center justify-center">
              {user?.name ? user.name[0].toUpperCase() : "U"}
            </div>
            <div>
              <div className="font-bold text-stone-900 text-base">{user?.name}</div>
              <div className="text-xs text-stone-500">{user?.email}</div>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-stone-200/80 shadow-xs flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center">
              <Heart className="w-6 h-6" />
            </div>
            <div>
              <div className="text-2xl font-black text-stone-900">{stats.favorites_count}</div>
              <div className="text-xs text-stone-500">Saved Favorites</div>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-stone-200/80 shadow-xs flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <Star className="w-6 h-6 fill-amber-500" />
            </div>
            <div>
              <div className="text-2xl font-black text-stone-900">{stats.ratings_count}</div>
              <div className="text-xs text-stone-500">Dishes Reviewed</div>
            </div>
          </div>
        </div>

        {/* Success Alert */}
        {saveSuccess && (
          <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-emerald-800 text-xs font-semibold flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
            <span>Preferences updated successfully! Your recommendations have been recalculated.</span>
          </div>
        )}

        {/* Edit Preferences Form */}
        <form onSubmit={handleSave} className="bg-white p-6 sm:p-10 rounded-3xl border border-stone-200/80 shadow-sm space-y-8">
          {/* Full Name */}
          <div>
            <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-2">
              Full Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="max-w-md w-full p-3 bg-stone-50 border border-stone-200 rounded-xl text-stone-900 text-sm focus:outline-none focus:border-orange-500"
            />
          </div>

          {/* Preferred Cuisines */}
          <div>
            <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-2">
              Preferred Cuisines (+30 Match Points)
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
              {cuisinesList.map((c) => {
                const selected = selectedCuisines.includes(c);
                return (
                  <button
                    key={c}
                    type="button"
                    onClick={() => toggleCuisine(c)}
                    className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                      selected
                        ? "bg-orange-600 text-white border-orange-600 shadow-xs"
                        : "bg-stone-50 text-stone-700 border-stone-200 hover:bg-stone-100"
                    }`}
                  >
                    {c}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Food Type */}
          <div>
            <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-2">
              Dietary Preference (+25 Match Points)
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {foodTypes.map((type) => {
                const selected = foodType === type;
                return (
                  <button
                    key={type}
                    type="button"
                    onClick={() => setFoodType(type)}
                    className={`py-2.5 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                      selected
                        ? "bg-emerald-600 text-white border-emerald-600 shadow-xs"
                        : "bg-stone-50 text-stone-700 border-stone-200 hover:bg-stone-100"
                    }`}
                  >
                    {type}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Favorite Categories */}
          <div>
            <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-2">
              Favorite Food Categories (+20 Match Points)
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
              {categoriesList.map((cat) => {
                const selected = selectedCategories.includes(cat);
                return (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => toggleCategory(cat)}
                    className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                      selected
                        ? "bg-rose-500 text-white border-rose-500 shadow-xs"
                        : "bg-stone-50 text-stone-700 border-stone-200 hover:bg-stone-100"
                    }`}
                  >
                    {cat}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Spice & Budget */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-2">
                Spice Level (+10 Match Points)
              </label>
              <div className="grid grid-cols-3 gap-2">
                {spiceLevels.map((s) => {
                  const selected = spiceLevel === s;
                  return (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setSpiceLevel(s)}
                      className={`py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                        selected
                          ? "bg-stone-900 text-white border-stone-900 shadow-xs"
                          : "bg-stone-50 text-stone-700 border-stone-200 hover:bg-stone-100"
                      }`}
                    >
                      {s}
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-2">
                Target Budget Range (+10 Match Points)
              </label>
              <div className="grid grid-cols-2 gap-2">
                {budgetOptions.map((b) => {
                  const selected = budgetRange === b;
                  return (
                    <button
                      key={b}
                      type="button"
                      onClick={() => setBudgetRange(b)}
                      className={`py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                        selected
                          ? "bg-amber-600 text-white border-amber-600 shadow-xs"
                          : "bg-stone-50 text-stone-700 border-stone-200 hover:bg-stone-100"
                      }`}
                    >
                      {b}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Dietary Focus */}
          <div>
            <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-2">
              Nutritional / Dietary Goal
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {dietaryOptions.map((diet) => {
                const selected = dietary === diet;
                return (
                  <button
                    key={diet}
                    type="button"
                    onClick={() => setDietary(diet)}
                    className={`py-2 px-3 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                      selected
                        ? "bg-stone-800 text-white border-stone-800"
                        : "bg-stone-50 text-stone-700 border-stone-200 hover:bg-stone-100"
                    }`}
                  >
                    {diet}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Save Button */}
          <div className="pt-4 border-t border-stone-100 flex items-center justify-end">
            <button
              type="submit"
              disabled={saving}
              className="py-3 px-8 bg-orange-600 hover:bg-orange-700 text-white font-bold rounded-2xl shadow-md hover:shadow-lg transition-all flex items-center gap-2 cursor-pointer text-sm"
            >
              <Save className="w-4 h-4" />
              <span>{saving ? "Saving Changes..." : "Save Preferences"}</span>
            </button>
          </div>
        </form>
      </main>
    </div>
  );
};

export default Profile;
