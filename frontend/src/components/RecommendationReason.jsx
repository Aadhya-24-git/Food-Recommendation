import React, { useState } from "react";
import { Sparkles, ChevronDown, ChevronUp, Info } from "lucide-react";

export const RecommendationReason = ({
  percentage = 85,
  reason = "",
  scoreBreakdown = {},
  compact = false,
}) => {
  const [showDetails, setShowDetails] = useState(false);

  const getBadgeStyle = (pct) => {
    if (pct >= 85) return "bg-emerald-600 text-white shadow-emerald-500/20";
    if (pct >= 65) return "bg-amber-500 text-white shadow-amber-500/20";
    return "bg-stone-600 text-white shadow-stone-500/20";
  };

  if (compact) {
    return (
      <div className="flex items-center gap-1.5">
        <span
          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-bold shadow-xs ${getBadgeStyle(
            percentage
          )}`}
        >
          <Sparkles className="w-3 h-3" />
          {percentage}% Match
        </span>
      </div>
    );
  }

  return (
    <div className="bg-amber-50/70 border border-amber-200/70 rounded-xl p-3 text-xs text-stone-700">
      <div className="flex items-center justify-between gap-2 mb-1.5">
        <div className="flex items-center gap-1.5">
          <span
            className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold shadow-xs ${getBadgeStyle(
              percentage
            )}`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            {percentage}% Match
          </span>
          <span className="font-semibold text-stone-800">Why recommended</span>
        </div>

        {Object.keys(scoreBreakdown).length > 0 && (
          <button
            type="button"
            onClick={() => setShowDetails(!showDetails)}
            className="flex items-center gap-1 text-[11px] font-medium text-orange-700 hover:text-orange-900 cursor-pointer"
          >
            <span>Algorithm breakdown</span>
            {showDetails ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
          </button>
        )}
      </div>

      <p className="text-stone-600 leading-relaxed italic">
        "{reason || "Recommended based on overall popular rating and variety."}"
      </p>

      {/* College Project Viva / Transparent Rule Breakdown */}
      {showDetails && Object.keys(scoreBreakdown).length > 0 && (
        <div className="mt-2.5 pt-2 border-t border-amber-200/60">
          <div className="text-[11px] font-semibold text-stone-700 mb-1 flex items-center gap-1">
            <Info className="w-3 h-3 text-amber-600" />
            Rule-Based Scoring Formula:
          </div>
          <div className="grid grid-cols-2 gap-x-2 gap-y-1">
            {Object.entries(scoreBreakdown).map(([factor, pts]) => (
              <div key={factor} className="flex justify-between items-center text-[11px]">
                <span className="text-stone-600">{factor}:</span>
                <span
                  className={`font-semibold ${
                    pts > 0 ? "text-emerald-700" : pts < 0 ? "text-red-600" : "text-stone-500"
                  }`}
                >
                  {pts > 0 ? `+${pts}` : pts} pts
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default RecommendationReason;
