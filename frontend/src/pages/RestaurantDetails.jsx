import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import FoodCard from "../components/FoodCard";
import RatingStars from "../components/RatingStars";
import api from "../services/api";
import { MapPin, Utensils, ArrowLeft, AlertCircle } from "lucide-react";

export const RestaurantDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [restaurant, setRestaurant] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState("All");

  useEffect(() => {
    const fetchRestaurant = async () => {
      try {
        setLoading(true);
        const res = await api.get(`/restaurants/${id}`);
        setRestaurant(res.data);
      } catch (err) {
        console.error("Failed to load restaurant:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchRestaurant();
    window.scrollTo(0, 0);
  }, [id]);

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

  if (!restaurant) {
    return (
      <div className="min-h-screen bg-[#faf7f2] flex flex-col">
        <Navbar />
        <div className="max-w-md mx-auto my-auto text-center p-8 bg-white rounded-3xl border border-stone-200">
          <AlertCircle className="w-12 h-12 text-rose-500 mx-auto mb-3" />
          <h2 className="text-xl font-bold text-stone-900">Restaurant Not Found</h2>
          <Link to="/home" className="mt-4 inline-block px-4 py-2 bg-orange-600 text-white rounded-xl text-xs font-bold">
            Return to Home
          </Link>
        </div>
      </div>
    );
  }

  const foodItems = restaurant.food_items || [];
  const categories = ["All", ...new Set(foodItems.map((f) => f.category))];
  const filteredFoods =
    activeCategory === "All"
      ? foodItems
      : foodItems.filter((f) => f.category === activeCategory);

  return (
    <div className="min-h-screen bg-[#faf7f2] flex flex-col">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full space-y-8">
        <div>
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-1.5 text-xs font-bold text-stone-600 hover:text-stone-900 cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to previous page
          </button>
        </div>

        {/* Restaurant Header Banner Card */}
        <div className="relative rounded-3xl overflow-hidden shadow-xl bg-stone-900 text-white">
          <div className="relative h-64 sm:h-80 w-full overflow-hidden">
            <img
              src={restaurant.image_url || "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1200&auto=format&fit=crop&q=80"}
              alt={restaurant.name}
              className="w-full h-full object-cover opacity-50"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/40 to-transparent"></div>

            <div className="absolute bottom-6 left-6 right-6 space-y-2">
              <div className="flex items-center gap-2">
                <span className="bg-orange-600 px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider">
                  {restaurant.price_range || "₹₹"}
                </span>
                <span className="bg-white/20 backdrop-blur-md px-2.5 py-0.5 rounded-full text-xs font-medium">
                  {foodItems.length} Specialties on Menu
                </span>
              </div>

              <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
                {restaurant.name}
              </h1>

              <div className="flex flex-wrap items-center gap-4 text-xs text-stone-300">
                <span className="flex items-center gap-1">
                  <MapPin className="w-4 h-4 text-orange-400" />
                  {restaurant.location}
                </span>
                <RatingStars rating={restaurant.rating || 4.5} size={15} />
              </div>

              {restaurant.description && (
                <p className="text-xs sm:text-sm text-stone-200 max-w-2xl leading-relaxed pt-1">
                  {restaurant.description}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Menu Section */}
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-stone-200">
            <div>
              <h2 className="text-2xl font-black text-stone-900 flex items-center gap-2">
                <Utensils className="w-5 h-5 text-orange-600" />
                Restaurant Menu
              </h2>
              <p className="text-xs text-stone-500 mt-0.5">
                Freshly prepared and curated by {restaurant.name}
              </p>
            </div>

            {/* Category Filter Chips */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                    activeCategory === cat
                      ? "bg-orange-600 text-white shadow-xs"
                      : "bg-white text-stone-700 hover:bg-stone-100 border border-stone-200"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Dishes Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredFoods.map((food) => (
              <FoodCard key={food.id} item={food} />
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default RestaurantDetails;
