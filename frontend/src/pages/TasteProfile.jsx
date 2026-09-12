import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import api from "../services/api";
import {
  PieChart,
  UtensilsCrossed,
  Heart,
  Star,
  Flame,
  Wallet,
  Leaf,
  BarChart2,
  Sparkles,
} from "lucide-react";

export const TasteProfile = () => {
  const [taste, setTaste] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTasteProfile = async () => {
      try {
        setLoading(true);
        const res = await api.get("/profile/taste");
        setTaste(res.data);
      } catch (err) {
        console.error("Failed to load taste profile:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchTasteProfile();
  }, []);

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

  const cuisineDist = taste?.cuisine_distribution || {};
  const categoryDist = taste?.category_distribution || {};

  // Maximum value for percentage bars
  const maxCuisineCount = Math.max(...Object.values(cuisineDist), 1);
  const maxCategoryCount = Math.max(...Object.values(categoryDist), 1);

  return (
    <div className="min-h-screen bg-[#faf7f2] flex flex-col">
      <Navbar />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full space-y-8">
        <div>
          <h1 className="text-3xl font-black text-stone-900 flex items-center gap-2">
            <PieChart className="w-7 h-7 text-emerald-600" />
            My Taste Profile & Analytics
          </h1>
          <p className="text-xs text-stone-500 mt-1">
            Visual analytics reflecting your flavor preferences, engagement history, and dining habits
          </p>
        </div>

        {/* 4 Primary Flavor Trait Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-3xl border border-stone-200/80 shadow-xs space-y-2">
            <div className="w-10 h-10 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center">
              <UtensilsCrossed className="w-5 h-5" />
            </div>
            <div className="text-xs font-semibold text-stone-400 uppercase tracking-wider">
              Favorite Cuisine
            </div>
            <div className="text-xl font-black text-stone-900 line-clamp-1">
              {taste?.favorite_cuisine || "South Indian"}
            </div>
            <p className="text-[11px] text-stone-500">Highest matching preference</p>
          </div>

          <div className="bg-white p-5 rounded-3xl border border-stone-200/80 shadow-xs space-y-2">
            <div className="w-10 h-10 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center">
              <Heart className="w-5 h-5" />
            </div>
            <div className="text-xs font-semibold text-stone-400 uppercase tracking-wider">
              Top Category
            </div>
            <div className="text-xl font-black text-stone-900 line-clamp-1">
              {taste?.favorite_category || "Dosa"}
            </div>
            <p className="text-[11px] text-stone-500">Most engaged dish category</p>
          </div>

          <div className="bg-white p-5 rounded-3xl border border-stone-200/80 shadow-xs space-y-2">
            <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center">
              <Wallet className="w-5 h-5" />
            </div>
            <div className="text-xs font-semibold text-stone-400 uppercase tracking-wider">
              Preferred Budget
            </div>
            <div className="text-xl font-black text-stone-900 line-clamp-1">
              {taste?.preferred_budget || "₹150–₹300"}
            </div>
            <p className="text-[11px] text-stone-500">Comfort spending range</p>
          </div>

          <div className="bg-white p-5 rounded-3xl border border-stone-200/80 shadow-xs space-y-2">
            <div className="w-10 h-10 rounded-xl bg-red-100 text-red-600 flex items-center justify-center">
              <Flame className="w-5 h-5" />
            </div>
            <div className="text-xs font-semibold text-stone-400 uppercase tracking-wider">
              Spice Profile
            </div>
            <div className="text-xl font-black text-stone-900 line-clamp-1">
              {taste?.preferred_spice || "Medium"} Spice
            </div>
            <p className="text-[11px] text-stone-500">Spice tolerance level</p>
          </div>
        </div>

        {/* 3 Activity Metrics Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white p-5 rounded-3xl border border-stone-200/80 shadow-xs text-center">
            <div className="text-3xl font-black text-stone-900">{taste?.total_rated || 0}</div>
            <div className="text-xs font-bold text-stone-700 mt-1">Dishes Rated & Reviewed</div>
            <p className="text-[11px] text-stone-400 mt-0.5">Influences category scoring</p>
          </div>

          <div className="bg-white p-5 rounded-3xl border border-stone-200/80 shadow-xs text-center">
            <div className="text-3xl font-black text-rose-600">{taste?.total_favorited || 0}</div>
            <div className="text-xs font-bold text-stone-700 mt-1">Dishes Favorited</div>
            <p className="text-[11px] text-stone-400 mt-0.5">Adds +10 points to category</p>
          </div>

          <div className="bg-white p-5 rounded-3xl border border-stone-200/80 shadow-xs text-center">
            <div className="text-3xl font-black text-amber-500 flex items-center justify-center gap-1">
              <Star className="w-6 h-6 fill-amber-400" />
              <span>{taste?.average_rating_given ? Number(taste.average_rating_given).toFixed(1) : "0.0"}</span>
            </div>
            <div className="text-xs font-bold text-stone-700 mt-1">Average Rating Given</div>
            <p className="text-[11px] text-stone-400 mt-0.5">Across all community feedback</p>
          </div>
        </div>

        {/* Visual Taste Distribution Charts */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Cuisine Affinity Breakdown */}
          <div className="bg-white p-6 rounded-3xl border border-stone-200/80 shadow-xs space-y-4">
            <div className="flex items-center gap-2">
              <BarChart2 className="w-5 h-5 text-orange-600" />
              <h2 className="text-base font-bold text-stone-900">
                Cuisine Affinity Distribution
              </h2>
            </div>
            <p className="text-xs text-stone-500">
              Calculated based on your preferences, rated dishes, and favorite history
            </p>

            <div className="space-y-3 pt-2">
              {Object.entries(cuisineDist).length === 0 ? (
                <div className="text-xs text-stone-400 italic py-4">
                  Start interacting with foods to see your cuisine distribution.
                </div>
              ) : (
                Object.entries(cuisineDist).map(([cuisine, count]) => {
                  const percentage = Math.round((count / maxCuisineCount) * 100);
                  return (
                    <div key={cuisine} className="space-y-1">
                      <div className="flex justify-between text-xs font-semibold text-stone-700">
                        <span>{cuisine}</span>
                        <span className="text-orange-600">{count} affinity pts</span>
                      </div>
                      <div className="w-full bg-stone-100 rounded-full h-2.5 overflow-hidden">
                        <div
                          className="bg-gradient-to-r from-orange-500 to-amber-500 h-2.5 rounded-full transition-all duration-700"
                          style={{ width: `${Math.max(percentage, 15)}%` }}
                        ></div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Category Engagement Breakdown */}
          <div className="bg-white p-6 rounded-3xl border border-stone-200/80 shadow-xs space-y-4">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-rose-500" />
              <h2 className="text-base font-bold text-stone-900">
                Top Category Preferences
              </h2>
            </div>
            <p className="text-xs text-stone-500">
              Dishes you love to explore and order repeatedly
            </p>

            <div className="space-y-3 pt-2">
              {Object.entries(categoryDist).length === 0 ? (
                <div className="text-xs text-stone-400 italic py-4">
                  Start favoriting dishes to see your favorite food categories here.
                </div>
              ) : (
                Object.entries(categoryDist).map(([category, count]) => {
                  const percentage = Math.round((count / maxCategoryCount) * 100);
                  return (
                    <div key={category} className="space-y-1">
                      <div className="flex justify-between text-xs font-semibold text-stone-700">
                        <span>{category}</span>
                        <span className="text-rose-600">{count} engagement pts</span>
                      </div>
                      <div className="w-full bg-stone-100 rounded-full h-2.5 overflow-hidden">
                        <div
                          className="bg-gradient-to-r from-rose-500 to-pink-500 h-2.5 rounded-full transition-all duration-700"
                          style={{ width: `${Math.max(percentage, 15)}%` }}
                        ></div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default TasteProfile;
