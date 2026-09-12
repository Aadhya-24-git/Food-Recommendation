import React, { useState } from "react";
import { Star } from "lucide-react";

export const RatingStars = ({
  rating = 0,
  max = 5,
  size = 16,
  editable = false,
  onChange = null,
  showNumber = true,
}) => {
  const [hoverRating, setHoverRating] = useState(0);

  const displayRating = hoverRating || rating;

  return (
    <div className="flex items-center gap-1.5">
      <div className="flex items-center">
        {Array.from({ length: max }, (_, index) => {
          const starValue = index + 1;
          const isFilled = starValue <= Math.round(displayRating);

          return (
            <button
              type="button"
              key={index}
              disabled={!editable}
              onClick={() => editable && onChange && onChange(starValue)}
              onMouseEnter={() => editable && setHoverRating(starValue)}
              onMouseLeave={() => editable && setHoverRating(0)}
              className={`${
                editable ? "cursor-pointer transition-transform hover:scale-110" : "cursor-default"
              } p-0.5`}
            >
              <Star
                size={size}
                className={`${
                  isFilled
                    ? "fill-amber-400 text-amber-400 drop-shadow-xs"
                    : "fill-stone-100 text-stone-300"
                }`}
              />
            </button>
          );
        })}
      </div>
      {showNumber && (
        <span className="text-xs font-bold text-stone-700">
          {Number(rating).toFixed(1)}
        </span>
      )}
    </div>
  );
};

export default RatingStars;
