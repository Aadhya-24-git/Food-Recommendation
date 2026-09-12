import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import RatingStars from "../components/RatingStars";
import api from "../services/api";
import { Heart, Trash2, Eye, MapPin, ShoppingBag, Sparkles } from "lucide-react";

export const Favorites = () => {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchFavorites = async () => {
    try {
      setLoading(true);
      const res = await api.get("/favorites");
      setFavorites(res.data);
    } catch (err) {
      console.error("Failed to load favorites:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFavorites();
  }, []);

  const handleRemoveFavorite = async (foodId) => {
    try {
      await api.delete(`/favorites/${foodId}`);
      setFavorites(favorites.filter((f) => f.food_item_id !== foodId));
    } catch (err) {
      console.error("Failed to remove favorite:", err);
    }
  };

  return (
    <div className="min-h-screen bg-[#faf7f2] flex flex-col">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full space-y-6">
        <div>
          <h1 className="text-3xl font-black text-stone-900 flex items-center gap-2">
            <Heart className="w-7 h-7 text-rose-500 fill-rose-500" />
            My Saved Favorites
          </h1>
          <p className="text-xs text-stone-500 mt-1">
            Your personal collection of loved dishes. Our algorithm boosts scores for similar food categories!
          </p>
        </div>

        {loading ? (
          <div className="py-24 text-center">
            <div className="animate-spin rounded-full h-10 w-10 border-4 border-orange-500 border-t-transparent mx-auto mb-3"></div>
            <p className="text-xs text-stone-500 font-medium">Loading saved foods...</p>
          </div>
        ) : favorites.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-dashed border-stone-300 space-y-4 max-w-md mx-auto my-12">
            <div className="w-16 h-16 rounded-full bg-rose-50 text-rose-500 flex items-center justify-center mx-auto">
              <Heart className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-stone-900">No favorites yet.</h3>
            <p className="text-xs text-stone-500 leading-relaxed">
              Save foods you love and they'll appear here. Favoriting dishes helps our rule-based
              engine learn what you crave!
            </p>
            <Link
              to="/home"
              className="inline-block px-5 py-2.5 bg-orange-600 hover:bg-orange-700 text-white rounded-xl text-xs font-bold shadow-md transition-all"
            >
              Discover Recommendations
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {favorites.map((fav) => {
              const food = fav.food_item;
              if (!food) return null;
              const isVeg = food.food_type?.toLowerCase() === "vegetarian" || food.food_type?.toLowerCase() === "vegan";

              return (
                <div
                  key={fav.id}
                  className="bg-white rounded-2xl overflow-hidden border border-stone-200/80 shadow-xs hover:shadow-lg transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="relative h-44 w-full overflow-hidden bg-stone-100">
                      <img
                        src={food.image_url || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&auto=format&fit=crop&q=80"}
                        alt={food.name}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-md px-2.5 py-1 rounded-full text-xs font-semibold flex items-center gap-1.5 shadow-sm">
                        <span
                          className={`w-2.5 h-2.5 rounded-full ${
                            isVeg ? "bg-emerald-500" : "bg-red-600"
                          }`}
                        ></span>
                        <span className="text-stone-700 capitalize">{food.food_type}</span>
                      </div>

                      <button
                        onClick={() => handleRemoveFavorite(food.id)}
                        title="Remove from favorites"
                        className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 hover:bg-red-50 text-stone-400 hover:text-red-600 flex items-center justify-center transition-colors shadow-sm cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="p-4 space-y-2">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="font-bold text-stone-900 text-base line-clamp-1">
                            {food.name}
                          </h3>
                          {food.restaurant && (
                            <Link
                              to={`/restaurant/${food.restaurant.id}`}
                              className="text-xs text-stone-500 hover:text-orange-600 flex items-center gap-1 mt-0.5"
                            >
                              <MapPin className="w-3 h-3 text-orange-500" />
                              {food.restaurant.name}
                            </Link>
                          )}
                        </div>
                        <span className="font-extrabold text-stone-900 text-lg">
                          ₹{Number(food.price).toFixed(0)}
                        </span>
                      </div>

                      <div className="pt-2 border-t border-stone-100 flex items-center justify-between text-xs text-stone-500">
                        <span className="px-2 py-0.5 bg-stone-100 rounded-md font-medium">
                          {food.cuisine}
                        </span>
                        <RatingStars rating={food.rating || 4.5} size={14} />
                      </div>
                    </div>
                  </div>

                  <div className="p-4 pt-0">
                    <Link
                      to={`/food/${food.id}`}
                      className="w-full py-2.5 bg-stone-900 hover:bg-orange-600 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-colors shadow-xs"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      View Dish Details
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
};

export default Favorites;
