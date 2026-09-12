import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Navbar from "../components/Navbar";
import FoodCard from "../components/FoodCard";
import SearchBar from "../components/SearchBar";
import api from "../services/api";
import {
  Sparkles,
  Trophy,
  Wallet,
  Star,
  Compass,
  Heart,
  Sliders,
  ChevronRight,
} from "lucide-react";

export const Home = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [preferences, setPreferences] = useState(null);

  // Recommendation section states
  const [recommended, setRecommended] = useState([]);
  const [bestMatches, setBestMatches] = useState([]);
  const [becauseYouLike, setBecauseYouLike] = useState([]);
  const [underBudget, setUnderBudget] = useState([]);
  const [highlyRated, setHighlyRated] = useState([]);
  const [tryNew, setTryNew] = useState([]);

  // Time-aware greeting
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 17) return "Good afternoon";
    return "Good evening";
  };

  const loadFeedData = async () => {
    try {
      setLoading(true);

      // Fetch user preferences
      const prefRes = await api.get("/preferences");
      setPreferences(prefRes.data);

      const favCategory = prefRes.data?.favorite_categories?.split(",")[0]?.trim() || "Biryani";

      // Fetch recommendation sections in parallel
      const [recRes, bestRes, budgetRes, popRes, tryRes, catRes] = await Promise.all([
        api.get("/recommendations?limit=8"),
        api.get("/recommendations/best-match?limit=6"),
        api.get("/recommendations/budget?limit=6"),
        api.get("/recommendations/popular?limit=6"),
        api.get("/recommendations/try-new?limit=6"),
        api.get(`/recommendations?limit=6&category=${encodeURIComponent(favCategory)}`),
      ]);

      setRecommended(recRes.data);
      setBestMatches(bestRes.data);
      setUnderBudget(budgetRes.data);
      setHighlyRated(popRes.data);
      setTryNew(tryRes.data);
      setBecauseYouLike(catRes.data);
    } catch (err) {
      console.error("Failed to load recommendation feeds:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFeedData();
  }, []);

  const handleSearchSubmit = (query) => {
    if (query.trim()) {
      navigate(`/search?q=${encodeURIComponent(query.trim())}`);
    } else {
      navigate("/search");
    }
  };

  const handleNotInterestedDismiss = (foodId) => {
    // Remove dismissed item from all visible feeds
    setRecommended((prev) => prev.filter((item) => (item.food?.id || item.id) !== foodId));
    setBestMatches((prev) => prev.filter((item) => (item.food?.id || item.id) !== foodId));
    setUnderBudget((prev) => prev.filter((item) => (item.food?.id || item.id) !== foodId));
    setHighlyRated((prev) => prev.filter((item) => (item.food?.id || item.id) !== foodId));
    setTryNew((prev) => prev.filter((item) => (item.food?.id || item.id) !== foodId));
    setBecauseYouLike((prev) => prev.filter((item) => (item.food?.id || item.id) !== foodId));
  };

  return (
    <div className="min-h-screen bg-[#faf7f2] flex flex-col">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full space-y-12">
        {/* Welcome Header & Search Hero */}
        <div className="bg-gradient-to-r from-orange-600 via-rose-600 to-amber-600 rounded-3xl p-6 sm:p-10 text-white shadow-xl shadow-orange-600/15 relative overflow-hidden">
          <div className="relative z-10 max-w-2xl space-y-4">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Personalized Food Recommendations</span>
            </div>

            <h1 className="text-3xl sm:text-4xl font-black tracking-tight">
              {getGreeting()}, {user?.name || "Foodie"} 👋
            </h1>

            <p className="text-orange-100 text-sm leading-relaxed">
              We've calculated recommendations tailored to your taste for{" "}
              <span className="font-bold underline decoration-amber-300">
                {preferences?.preferred_cuisine || "authentic food"}
              </span>{" "}
              ({preferences?.food_type || "Vegetarian"}).
            </p>

            <div className="pt-2">
              <SearchBar
                onSearch={handleSearchSubmit}
                placeholder="What are you craving today? (e.g., Masala Dosa, Biryani, Pasta)..."
              />
            </div>
          </div>

          {/* Background culinary design element */}
          <div className="absolute right-4 bottom-0 opacity-15 pointer-events-none hidden lg:block text-9xl">
            🍛
          </div>
        </div>

        {/* Quick Taste Summary Bar */}
        <div className="bg-white rounded-2xl p-4 border border-stone-200/80 shadow-xs flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-2 text-xs text-stone-700">
            <span className="font-bold text-stone-900 flex items-center gap-1">
              <Sliders className="w-3.5 h-3.5 text-orange-600" />
              Active Taste Filter:
            </span>
            <span className="bg-stone-100 px-2.5 py-1 rounded-lg font-medium">
              Cuisine: {preferences?.preferred_cuisine}
            </span>
            <span className="bg-emerald-50 text-emerald-800 px-2.5 py-1 rounded-lg font-medium border border-emerald-200">
              {preferences?.food_type}
            </span>
            <span className="bg-amber-50 text-amber-800 px-2.5 py-1 rounded-lg font-medium border border-amber-200">
              Budget: {preferences?.budget_range}
            </span>
            <span className="bg-stone-100 px-2.5 py-1 rounded-lg font-medium">
              Spice: {preferences?.spice_level}
            </span>
          </div>

          <button
            onClick={() => navigate("/profile")}
            className="text-xs font-bold text-orange-600 hover:text-orange-700 flex items-center gap-1 cursor-pointer"
          >
            <span>Adjust Taste Profile</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {loading ? (
          <div className="py-20 flex flex-col items-center justify-center space-y-3">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-orange-500 border-t-transparent"></div>
            <p className="text-sm font-semibold text-stone-600">
              Running rule-based scoring engine across menu items...
            </p>
          </div>
        ) : (
          <div className="space-y-12">
            {/* 1. Recommended For You (Top Matches with highest points) */}
            <section className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center">
                      <Sparkles className="w-4 h-4" />
                    </div>
                    <h2 className="text-2xl font-black text-stone-900">Recommended For You</h2>
                  </div>
                  <p className="text-xs text-stone-500 mt-1">
                    Highest total score matching your cuisine, budget, spice, and dietary preferences
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {recommended.slice(0, 8).map((item) => (
                  <FoodCard
                    key={item.food?.id || item.id}
                    item={item}
                    onNotInterested={handleNotInterestedDismiss}
                  />
                ))}
              </div>
            </section>

            {/* 2. Best Matches (>= 80% Match Percentage) */}
            {bestMatches.length > 0 && (
              <section className="space-y-4 pt-4 border-t border-stone-200/70">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
                        <Trophy className="w-4 h-4" />
                      </div>
                      <h2 className="text-2xl font-black text-stone-900">Best Matches (80%+)</h2>
                    </div>
                    <p className="text-xs text-stone-500 mt-1">
                      Dishes satisfying almost all your personal taste parameters
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {bestMatches.slice(0, 6).map((item) => (
                    <FoodCard
                      key={item.food?.id || item.id}
                      item={item}
                      onNotInterested={handleNotInterestedDismiss}
                    />
                  ))}
                </div>
              </section>
            )}

            {/* 3. Because You Like [Category/Cuisine] */}
            {becauseYouLike.length > 0 && (
              <section className="space-y-4 pt-4 border-t border-stone-200/70">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center">
                        <Heart className="w-4 h-4" />
                      </div>
                      <h2 className="text-2xl font-black text-stone-900">
                        Because You Like{" "}
                        <span className="text-rose-600">
                          {preferences?.favorite_categories?.split(",")[0] || "Dosa"}
                        </span>
                      </h2>
                    </div>
                    <p className="text-xs text-stone-500 mt-1">
                      Targeted suggestions based on your designated favorite dish category
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {becauseYouLike.slice(0, 4).map((item) => (
                    <FoodCard
                      key={item.food?.id || item.id}
                      item={item}
                      onNotInterested={handleNotInterestedDismiss}
                    />
                  ))}
                </div>
              </section>
            )}

            {/* 4. Under Your Budget */}
            {underBudget.length > 0 && (
              <section className="space-y-4 pt-4 border-t border-stone-200/70">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center">
                        <Wallet className="w-4 h-4" />
                      </div>
                      <h2 className="text-2xl font-black text-stone-900">
                        Under Your Budget ({preferences?.budget_range || "₹150–₹300"})
                      </h2>
                    </div>
                    <p className="text-xs text-stone-500 mt-1">
                      Delicious choices that comfortably fit within your spending target
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {underBudget.slice(0, 4).map((item) => (
                    <FoodCard
                      key={item.food?.id || item.id}
                      item={item}
                      onNotInterested={handleNotInterestedDismiss}
                    />
                  ))}
                </div>
              </section>
            )}

            {/* 5. Highly Rated (★ 4.5+) */}
            {highlyRated.length > 0 && (
              <section className="space-y-4 pt-4 border-t border-stone-200/70">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center">
                        <Star className="w-4 h-4 fill-amber-500 text-amber-500" />
                      </div>
                      <h2 className="text-2xl font-black text-stone-900">Highly Rated Dishes</h2>
                    </div>
                    <p className="text-xs text-stone-500 mt-1">
                      Top-rated items celebrated by the FoodieAI community
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {highlyRated.slice(0, 4).map((item) => (
                    <FoodCard
                      key={item.food?.id || item.id}
                      item={item}
                      onNotInterested={handleNotInterestedDismiss}
                    />
                  ))}
                </div>
              </section>
            )}

            {/* 6. Try Something New */}
            {tryNew.length > 0 && (
              <section className="space-y-4 pt-4 border-t border-stone-200/70">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center">
                        <Compass className="w-4 h-4" />
                      </div>
                      <h2 className="text-2xl font-black text-stone-900">Try Something New</h2>
                    </div>
                    <p className="text-xs text-stone-500 mt-1">
                      Expand your palate with top-rated dishes outside your primary preferred cuisine
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {tryNew.slice(0, 4).map((item) => (
                    <FoodCard
                      key={item.food?.id || item.id}
                      item={item}
                      onNotInterested={handleNotInterestedDismiss}
                    />
                  ))}
                </div>
              </section>
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export default Home;
