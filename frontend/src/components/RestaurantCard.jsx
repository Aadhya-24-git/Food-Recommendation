import React from "react";
import { Link } from "react-router-dom";
import { MapPin, Utensils } from "lucide-react";
import RatingStars from "./RatingStars";

export const RestaurantCard = ({ restaurant }) => {
  return (
    <Link
      to={`/restaurant/${restaurant.id}`}
      className="group bg-white rounded-2xl overflow-hidden border border-stone-200/80 hover:border-orange-200 shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col"
    >
      <div className="relative h-40 w-full overflow-hidden bg-stone-100">
        <img
          src={
            restaurant.image_url ||
            "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=600&auto=format&fit=crop&q=80"
          }
          alt={restaurant.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60"></div>
        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white text-xs font-semibold">
          <span className="bg-black/50 backdrop-blur-md px-2 py-0.5 rounded-md">
            {restaurant.price_range || "₹₹"}
          </span>
          <span className="bg-orange-600/90 backdrop-blur-md px-2 py-0.5 rounded-md flex items-center gap-1">
            <Utensils className="w-3 h-3" />
            Kitchen
          </span>
        </div>
      </div>

      <div className="p-4 space-y-2 flex-1 flex flex-col justify-between">
        <div>
          <h3 className="font-bold text-stone-900 text-base group-hover:text-orange-600 transition-colors line-clamp-1">
            {restaurant.name}
          </h3>
          <p className="text-xs text-stone-500 flex items-center gap-1 mt-1 line-clamp-1">
            <MapPin className="w-3.5 h-3.5 text-orange-500 shrink-0" />
            {restaurant.location}
          </p>
          {restaurant.description && (
            <p className="text-xs text-stone-600 mt-2 line-clamp-2 leading-relaxed">
              {restaurant.description}
            </p>
          )}
        </div>

        <div className="pt-3 border-t border-stone-100 flex items-center justify-between">
          <RatingStars rating={restaurant.rating || 4.5} size={14} />
          <span className="text-xs font-semibold text-orange-600 group-hover:translate-x-0.5 transition-transform">
            View Menu →
          </span>
        </div>
      </div>
    </Link>
  );
};

export default RestaurantCard;
