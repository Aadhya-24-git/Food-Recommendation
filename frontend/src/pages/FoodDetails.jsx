import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import RatingStars from "../components/RatingStars";
import RecommendationReason from "../components/RecommendationReason";
import FoodCard from "../components/FoodCard";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";
import {
  Heart,
  ThumbsDown,
  ShoppingBag,
  Star,
  MapPin,
  Flame,
  CheckCircle2,
  AlertCircle,
  MessageSquare,
  Sparkles,
  ArrowLeft,
  X,
} from "lucide-react";

export const FoodDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isFavorite, setIsFavorite] = useState(false);
  const [ratingsList, setRatingsList] = useState([]);

  // Rating Modal state
  const [rateModalOpen, setRateModalOpen] = useState(false);
  const [newRating, setNewRating] = useState(5);
  const [newReview, setNewReview] = useState("");
  const [submittingRating, setSubmittingRating] = useState(false);

  // Order Modal state
  const [orderModalOpen, setOrderModalOpen] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);

  const fetchFoodDetails = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/foods/${id}`);
      setData(res.data);

      // Log 'view' interaction if logged in
      if (isAuthenticated) {
        api.post("/interactions", {
          food_item_id: parseInt(id),
          interaction_type: "view",
        }).catch(() => {});

        // Check if favorite
        const favsRes = await api.get("/favorites");
        const isFav = favsRes.data.some((f) => f.food_item_id === parseInt(id));
        setIsFavorite(isFav);
      }

      // Fetch reviews
      const ratingsRes = await api.get(`/ratings/food/${id}`);
      setRatingsList(ratingsRes.data || []);
    } catch (err) {
      console.error("Failed to load food details:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFoodDetails();
    window.scrollTo(0, 0);
  }, [id]);

  const handleToggleFavorite = async () => {
    if (!isAuthenticated) {
      alert("Please sign in to favorite foods.");
      return;
    }
    try {
      if (isFavorite) {
        await api.delete(`/favorites/${id}`);
        setIsFavorite(false);
      } else {
        await api.post(`/favorites/${id}`);
        setIsFavorite(true);
      }
    } catch (err) {
      console.error("Favorite toggle error:", err);
    }
  };

  const handleNotInterested = async () => {
    if (!isAuthenticated) return;
    try {
      await api.post("/interactions", {
        food_item_id: parseInt(id),
        interaction_type: "not_interested",
      });
      alert("Marked as Not Interested. Your recommendations will adjust.");
      navigate("/home");
    } catch (err) {
      console.error("Interaction error:", err);
    }
  };

  const handleSubmitRating = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      alert("Please sign in to rate dishes.");
      return;
    }
    try {
      setSubmittingRating(true);
      await api.post("/ratings", {
        food_item_id: parseInt(id),
        rating: newRating,
        review: newReview.trim(),
      });
      setRateModalOpen(false);
      setNewReview("");
      // Refresh reviews & details
      fetchFoodDetails();
    } catch (err) {
      console.error("Rating submission error:", err);
    } finally {
      setSubmittingRating(false);
    }
  };

  const handleSimulateOrder = () => {
    setOrderSuccess(true);
    setTimeout(() => {
      setOrderSuccess(false);
      setOrderModalOpen(false);
    }, 2200);
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

  if (!data || !data.food) {
    return (
      <div className="min-h-screen bg-[#faf7f2] flex flex-col">
        <Navbar />
        <div className="max-w-md mx-auto my-auto text-center p-8 bg-white rounded-3xl border border-stone-200">
          <AlertCircle className="w-12 h-12 text-rose-500 mx-auto mb-3" />
          <h2 className="text-xl font-bold text-stone-900">Food Item Not Found</h2>
          <Link to="/home" className="mt-4 inline-block px-4 py-2 bg-orange-600 text-white rounded-xl text-xs font-bold">
            Return to Home
          </Link>
        </div>
      </div>
    );
  }

  const { food, restaurant, match_percentage, reason_summary, score_breakdown, similar_foods } = data;
  const isVeg = food.food_type?.toLowerCase() === "vegetarian" || food.food_type?.toLowerCase() === "vegan";

  return (
    <div className="min-h-screen bg-[#faf7f2] flex flex-col">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full space-y-10">
        {/* Back navigation */}
        <div>
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-1.5 text-xs font-bold text-stone-600 hover:text-stone-900 cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to previous page
          </button>
        </div>

        {/* Hero Section: Large Image & Essential Details */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Food Image */}
          <div className="lg:col-span-6">
            <div className="relative rounded-3xl overflow-hidden shadow-xl bg-stone-100 aspect-4/3 border border-stone-200">
              <img
                src={food.image_url || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&auto=format&fit=crop&q=80"}
                alt={food.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold flex items-center gap-2 shadow-md">
                <span
                  className={`w-2.5 h-2.5 rounded-full ${
                    isVeg ? "bg-emerald-600" : "bg-red-600"
                  }`}
                ></span>
                <span className="text-stone-800 capitalize">{food.food_type}</span>
              </div>

              {match_percentage !== undefined && (
                <div className="absolute top-4 right-4">
                  <span className="bg-emerald-600 text-white px-3.5 py-1.5 rounded-full text-xs font-black flex items-center gap-1.5 shadow-lg">
                    <Sparkles className="w-4 h-4" />
                    {match_percentage}% Taste Match
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Information, Price, Actions */}
          <div className="lg:col-span-6 space-y-6">
            <div>
              <div className="flex items-center gap-2 text-xs font-bold text-orange-600 uppercase tracking-wider mb-1">
                <span>{food.cuisine} Cuisine</span>
                <span>•</span>
                <span>{food.category}</span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-black text-stone-900 tracking-tight">
                {food.name}
              </h1>

              {restaurant && (
                <Link
                  to={`/restaurant/${restaurant.id}`}
                  className="inline-flex items-center gap-1.5 text-sm font-semibold text-stone-600 hover:text-orange-600 mt-2 transition-colors"
                >
                  <MapPin className="w-4 h-4 text-orange-500" />
                  <span>{restaurant.name}</span>
                  <span className="text-stone-400">({restaurant.location})</span>
                </Link>
              )}
            </div>

            {/* Price & Rating */}
            <div className="flex items-center justify-between p-4 bg-white rounded-2xl border border-stone-200/80 shadow-xs">
              <div>
                <div className="text-xs text-stone-500 font-medium">Price per serving</div>
                <div className="text-3xl font-black text-stone-900">
                  ₹{Number(food.price).toFixed(0)}
                </div>
              </div>

              <div className="text-right">
                <div className="text-xs text-stone-500 font-medium mb-0.5">Rating</div>
                <RatingStars rating={food.rating || 4.5} size={18} />
                <span className="text-[11px] text-stone-400">
                  {ratingsList.length} customer review{ratingsList.length === 1 ? "" : "s"}
                </span>
              </div>
            </div>

            {/* Description */}
            <p className="text-sm text-stone-600 leading-relaxed">{food.description}</p>

            {/* Why Recommended Scoring Card */}
            {match_percentage !== undefined && (
              <div className="bg-amber-50/80 rounded-2xl p-4 border border-amber-200/70 space-y-2">
                <div className="flex items-center gap-2 text-stone-900 font-bold text-sm">
                  <Sparkles className="w-4 h-4 text-orange-600" />
                  <span>Personalized Recommendation Analysis</span>
                </div>
                <p className="text-xs text-stone-700 italic">
                  "{reason_summary || "Calculated based on your selected food preferences."}"
                </p>

                {score_breakdown && Object.keys(score_breakdown).length > 0 && (
                  <div className="pt-2 border-t border-amber-200/60 grid grid-cols-2 gap-2 text-xs">
                    {Object.entries(score_breakdown).map(([factor, pts]) => (
                      <div key={factor} className="flex justify-between">
                        <span className="text-stone-600">{factor}:</span>
                        <span className="font-bold text-emerald-700">
                          {pts > 0 ? `+${pts}` : pts} pts
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Nutrition & Specs Grid */}
            <div className="grid grid-cols-3 gap-3">
              <div className="bg-white p-3 rounded-2xl border border-stone-200/80 text-center shadow-xs">
                <span className="text-[11px] font-semibold text-stone-400 uppercase block">Calories</span>
                <span className="text-lg font-black text-stone-800">
                  {food.calories || 350} <span className="text-xs font-normal">kcal</span>
                </span>
              </div>
              <div className="bg-white p-3 rounded-2xl border border-stone-200/80 text-center shadow-xs">
                <span className="text-[11px] font-semibold text-stone-400 uppercase block">Protein</span>
                <span className="text-lg font-black text-stone-800">
                  {food.protein || 12} <span className="text-xs font-normal">g</span>
                </span>
              </div>
              <div className="bg-white p-3 rounded-2xl border border-stone-200/80 text-center shadow-xs">
                <span className="text-[11px] font-semibold text-stone-400 uppercase block">Spice Level</span>
                <span className="text-sm font-black text-stone-800 flex items-center justify-center gap-1 mt-1">
                  <Flame className="w-3.5 h-3.5 text-red-500 fill-red-500" />
                  {food.spice_level || "Medium"}
                </span>
              </div>
            </div>

            {/* Ingredients */}
            {food.ingredients && (
              <div className="p-4 bg-white rounded-2xl border border-stone-200/80 shadow-xs">
                <h4 className="text-xs font-bold text-stone-800 uppercase tracking-wider mb-1">
                  Key Ingredients
                </h4>
                <p className="text-xs text-stone-600 leading-relaxed">{food.ingredients}</p>
              </div>
            )}

            {/* Interactive Action Buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={() => setOrderModalOpen(true)}
                className="flex-1 py-3.5 px-6 bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 text-white font-bold rounded-2xl shadow-lg shadow-orange-600/20 hover:shadow-orange-600/30 transition-all flex items-center justify-center gap-2 cursor-pointer text-sm"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Order Now (₹{Number(food.price).toFixed(0)})</span>
              </button>

              <button
                onClick={handleToggleFavorite}
                className={`p-3.5 rounded-2xl border transition-all cursor-pointer ${
                  isFavorite
                    ? "bg-rose-50 border-rose-200 text-rose-600"
                    : "bg-white border-stone-200 text-stone-600 hover:bg-stone-50"
                }`}
                title={isFavorite ? "Remove from Favorites" : "Add to Favorites"}
              >
                <Heart className={`w-5 h-5 ${isFavorite ? "fill-rose-500 text-rose-500" : ""}`} />
              </button>

              <button
                onClick={() => setRateModalOpen(true)}
                className="py-3.5 px-4 bg-white border border-stone-200 text-stone-700 hover:bg-stone-50 font-bold rounded-2xl text-xs flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
              >
                <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                <span>Rate Food</span>
              </button>

              {isAuthenticated && (
                <button
                  onClick={handleNotInterested}
                  className="p-3.5 bg-white border border-stone-200 text-stone-400 hover:text-stone-700 rounded-2xl hover:bg-stone-50 transition-colors cursor-pointer"
                  title="Not Interested"
                >
                  <ThumbsDown className="w-5 h-5" />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Customer Reviews Section */}
        <section className="space-y-4 pt-6 border-t border-stone-200/80">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-stone-900 flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-orange-600" />
                Customer Reviews ({ratingsList.length})
              </h2>
              <p className="text-xs text-stone-500 mt-0.5">
                Authentic community feedback and ratings
              </p>
            </div>
            <button
              onClick={() => setRateModalOpen(true)}
              className="px-4 py-2 bg-stone-900 hover:bg-orange-600 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer"
            >
              Write a Review
            </button>
          </div>

          {ratingsList.length === 0 ? (
            <div className="p-8 bg-white rounded-2xl text-center border border-dashed border-stone-200 text-stone-500 text-xs">
              No written reviews yet. Be the first to share your experience with this dish!
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {ratingsList.map((rev) => (
                <div key={rev.id} className="p-4 bg-white rounded-2xl border border-stone-200/80 shadow-xs space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-stone-800 text-xs">
                      {rev.user_name || "Foodie Member"}
                    </span>
                    <RatingStars rating={rev.rating} size={13} />
                  </div>
                  {rev.review && (
                    <p className="text-xs text-stone-600 leading-relaxed italic">
                      "{rev.review}"
                    </p>
                  )}
                  <span className="text-[10px] text-stone-400 block">
                    {new Date(rev.created_at).toLocaleDateString()}
                  </span>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Similar Recommended Foods */}
        {similar_foods && similar_foods.length > 0 && (
          <section className="space-y-4 pt-6 border-t border-stone-200/80">
            <div>
              <h2 className="text-xl font-bold text-stone-900">You Might Also Like</h2>
              <p className="text-xs text-stone-500 mt-0.5">
                More top-rated dishes in {food.cuisine} cuisine and {food.category}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {similar_foods.map((simFood) => (
                <FoodCard key={simFood.id} item={simFood} />
              ))}
            </div>
          </section>
        )}

        {/* Rate Food Modal */}
        {rateModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4">
            <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl space-y-4 relative">
              <button
                onClick={() => setRateModalOpen(false)}
                className="absolute top-4 right-4 p-1 text-stone-400 hover:text-stone-700 rounded-full cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              <h3 className="text-xl font-bold text-stone-900">Rate "{food.name}"</h3>
              <p className="text-xs text-stone-500">
                Your rating directly refines future recommendations for your profile!
              </p>

              <form onSubmit={handleSubmitRating} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase mb-2">
                    Select Rating
                  </label>
                  <RatingStars
                    rating={newRating}
                    size={28}
                    editable={true}
                    onChange={(val) => setNewRating(val)}
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase mb-1">
                    Your Review (Optional)
                  </label>
                  <textarea
                    rows={3}
                    value={newReview}
                    onChange={(e) => setNewReview(e.target.value)}
                    placeholder="Tell other foodies how it tasted, spice balance, texture..."
                    className="w-full p-3 bg-stone-50 border border-stone-200 rounded-xl text-stone-900 text-xs focus:outline-none focus:border-orange-500"
                  ></textarea>
                </div>

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setRateModalOpen(false)}
                    className="flex-1 py-2.5 border border-stone-200 rounded-xl text-xs font-bold text-stone-700 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submittingRating}
                    className="flex-1 py-2.5 bg-orange-600 text-white rounded-xl text-xs font-bold hover:bg-orange-700 transition-colors cursor-pointer"
                  >
                    {submittingRating ? "Submitting..." : "Submit Rating"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Order Simulation Modal */}
        {orderModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4">
            <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-sm w-full shadow-2xl text-center space-y-4 relative">
              <button
                onClick={() => setOrderModalOpen(false)}
                className="absolute top-4 right-4 p-1 text-stone-400 hover:text-stone-700 rounded-full cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              {orderSuccess ? (
                <div className="py-6 space-y-3">
                  <CheckCircle2 className="w-16 h-16 text-emerald-500 mx-auto animate-bounce" />
                  <h3 className="text-xl font-black text-stone-900">Order Placed!</h3>
                  <p className="text-xs text-stone-500">
                    Your order for <strong>{food.name}</strong> from {restaurant?.name} has been sent to the kitchen!
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="w-12 h-12 rounded-2xl bg-orange-100 text-orange-600 flex items-center justify-center mx-auto">
                    <ShoppingBag className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-bold text-stone-900">Confirm Simulated Order</h3>
                  <div className="p-3 bg-stone-50 rounded-xl text-xs text-stone-700 flex justify-between items-center">
                    <span>{food.name} (x1)</span>
                    <span className="font-bold text-stone-900">₹{Number(food.price).toFixed(0)}</span>
                  </div>
                  <p className="text-xs text-stone-400">
                    This is a simulated demo checkout for the college IT project demonstration.
                  </p>
                  <button
                    onClick={handleSimulateOrder}
                    className="w-full py-3 bg-gradient-to-r from-orange-600 to-amber-600 text-white font-bold rounded-xl text-sm shadow-md hover:shadow-lg transition-all cursor-pointer"
                  >
                    Confirm & Place Order
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default FoodDetails;
