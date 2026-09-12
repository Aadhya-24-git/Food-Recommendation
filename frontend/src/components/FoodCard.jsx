import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Heart, ThumbsDown, Sparkles, Flame, Eye } from "lucide-react";
import RatingStars from "./RatingStars";
import RecommendationReason from "./RecommendationReason";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";

export const FoodCard = ({
  item,
  onNotInterested = null,
  onFavoriteToggle = null,
}) => {
  const { isAuthenticated } = useAuth();
  const [isFavorite, setIsFavorite] = useState(item.is_favorite || false);
  const [favLoading, setFavLoading] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  // Unpack food details whether from recommendation wrapper or direct food object
  const food = item.food || item;
  const matchPercentage = item.match_percentage;
  const reason = item.reason;
  const breakdown = item.score_breakdown || {};

  const handleToggleFavorite = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isAuthenticated) {
      alert("Please log in to save favorites.");
      return;
    }

    try {
      setFavLoading(true);
      if (isFavorite) {
        await api.delete(`/favorites/${food.id}`);
        setIsFavorite(false);
      } else {
        await api.post(`/favorites/${food.id}`);
        setIsFavorite(true);
      }
      if (onFavoriteToggle) {
        onFavoriteToggle(food.id, !isFavorite);
      }
    } catch (err) {
      console.error("Error toggling favorite:", err);
    } finally {
      setFavLoading(false);
    }
  };

  const handleNotInterested = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isAuthenticated) return;

    try {
      setDismissed(true);
      await api.post("/interactions", {
        food_item_id: food.id,
        interaction_type: "not_interested",
      });
      if (onNotInterested) {
        onNotInterested(food.id);
      }
    } catch (err) {
      console.error("Error logging interaction:", err);
    }
  };

  if (dismissed) {
    return (
      <div className="p-4 bg-stone-100 rounded-2xl text-center border border-dashed border-stone-300 text-stone-500 text-sm flex flex-col items-center justify-center min-h-[300px]">
        <span>Marked as "Not Interested"</span>
        <span className="text-xs text-stone-400 mt-1">Recommendations will adjust to your taste.</span>
      </div>
    );
  }

  // Dietary badge indicators
  const isVeg = food.food_type?.toLowerCase() === "vegetarian" || food.food_type?.toLowerCase() === "vegan";
  const isNonVeg = food.food_type?.toLowerCase() === "non-vegetarian";

  return (
    <div className="group bg-white rounded-2xl overflow-hidden border border-stone-200/80 hover:border-orange-200 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between">
      <div>
        {/* Food Image Container */}
        <div className="relative h-48 w-full overflow-hidden bg-stone-100">
          <img
            src={
              food.image_url ||
              "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&auto=format&fit=crop&q=80"
            }
            alt={food.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
            onError={(e) => {
              e.target.src = "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&auto=format&fit=crop&q=80";
            }}
          />

          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60 group-hover:opacity-70 transition-opacity"></div>

          {/* Food Type Indicator (Indian standard veg/non-veg dot) */}
          <div className="absolute top-3 left-3 flex items-center gap-1.5 bg-white/90 backdrop-blur-md px-2.5 py-1 rounded-full text-xs font-semibold shadow-sm">
            <span
              className={`w-2.5 h-2.5 rounded-full border ${
                isVeg
                  ? "bg-emerald-500 border-emerald-700"
                  : isNonVeg
                  ? "bg-red-600 border-red-800"
                  : "bg-amber-500 border-amber-700"
              }`}
            ></span>
            <span className="text-stone-700 font-medium capitalize">{food.food_type}</span>
          </div>

          {/* Quick Favorite Button */}
          <button
            onClick={handleToggleFavorite}
            disabled={favLoading}
            title={isFavorite ? "Remove from Favorites" : "Add to Favorites"}
            className="absolute top-3 right-3 w-9 h-9 rounded-full bg-white/90 hover:bg-white backdrop-blur-md flex items-center justify-center text-stone-600 shadow-sm hover:scale-110 transition-all cursor-pointer"
          >
            <Heart
              className={`w-5 h-5 ${
                isFavorite ? "fill-rose-500 text-rose-500" : "text-stone-600 hover:text-rose-500"
              }`}
            />
          </button>

          {/* Spice Level Badge if spicy */}
          {food.spice_level && food.spice_level !== "Mild" && (
            <div className="absolute bottom-3 left-3 bg-red-600/90 text-white px-2 py-0.5 rounded-md text-[11px] font-semibold flex items-center gap-1 backdrop-blur-xs">
              <Flame className="w-3 h-3 fill-white" />
              {food.spice_level}
            </div>
          )}

          {/* Match Score Badge (if present) */}
          {matchPercentage !== undefined && (
            <div className="absolute bottom-3 right-3">
              <span
                className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold shadow-md ${
                  matchPercentage >= 85
                    ? "bg-emerald-600 text-white"
                    : matchPercentage >= 65
                    ? "bg-amber-500 text-white"
                    : "bg-stone-700 text-white"
                }`}
              >
                <Sparkles className="w-3 h-3" />
                {matchPercentage}% Match
              </span>
            </div>
          )}
        </div>

        {/* Content Section */}
        <div className="p-4 space-y-3">
          {/* Title and Restaurant */}
          <div>
            <div className="flex items-start justify-between gap-2">
              <h3 className="font-bold text-stone-900 text-lg leading-tight group-hover:text-orange-600 transition-colors line-clamp-1">
                {food.name}
              </h3>
            </div>
            <div className="flex items-center justify-between text-xs text-stone-500 mt-1">
              <span className="font-medium text-stone-700">
                {food.restaurant?.name || "Popular Kitchen"}
              </span>
              <span className="px-2 py-0.5 bg-stone-100 rounded-md text-stone-600 font-medium">
                {food.cuisine}
              </span>
            </div>
          </div>

          {/* Rating and Price */}
          <div className="flex items-center justify-between pt-1 border-t border-stone-100">
            <RatingStars rating={food.rating || 4.5} size={15} />
            <div className="text-stone-900 font-extrabold text-lg">
              ₹{Number(food.price).toFixed(0)}
            </div>
          </div>

          {/* Recommendation Reason Box (if available) */}
          {reason && (
            <RecommendationReason
              percentage={matchPercentage || 85}
              reason={reason}
              scoreBreakdown={breakdown}
            />
          )}

          {/* Nutrition Mini Badges */}
          <div className="flex items-center gap-2 text-[11px] text-stone-500 font-medium">
            {food.calories && (
              <span className="bg-stone-100 px-2 py-0.5 rounded-md">
                🔥 {food.calories} kcal
              </span>
            )}
            {food.protein && (
              <span className="bg-stone-100 px-2 py-0.5 rounded-md">
                💪 {food.protein}g protein
              </span>
            )}
            <span className="bg-stone-100 px-2 py-0.5 rounded-md capitalize">
              🍴 {food.category}
            </span>
          </div>
        </div>
      </div>

      {/* Action Buttons Footer */}
      <div className="p-4 pt-0 flex items-center gap-2">
        <Link
          to={`/food/${food.id}`}
          className="flex-1 py-2 px-3 bg-stone-900 hover:bg-orange-600 text-white text-xs font-semibold rounded-xl flex items-center justify-center gap-1.5 transition-colors shadow-xs"
        >
          <Eye className="w-3.5 h-3.5" />
          View Details
        </Link>

        {isAuthenticated && (
          <button
            type="button"
            onClick={handleNotInterested}
            title="Not Interested"
            className="p-2 border border-stone-200 hover:border-stone-400 text-stone-400 hover:text-stone-700 rounded-xl transition-colors cursor-pointer"
          >
            <ThumbsDown className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
};

export default FoodCard;
