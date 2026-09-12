import React from "react";
import { Link } from "react-router-dom";
import {
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Zap,
  Sliders,
  Award,
  ChevronRight,
  Utensils,
  Flame,
  CheckCircle2,
} from "lucide-react";
import Navbar from "../components/Navbar";

export const Landing = () => {
  const cuisines = [
    {
      name: "South Indian",
      image: "https://images.unsplash.com/photo-1668236543090-82eba5ee5976?w=500&auto=format&fit=crop&q=80",
      desc: "Crisp dosas, fluffy idlis & fragrant filter coffee",
    },
    {
      name: "North Indian",
      image: "https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=500&auto=format&fit=crop&q=80",
      desc: "Rich paneer gravies, buttery naans & tandoori grills",
    },
    {
      name: "Biryani & Rice",
      image: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=500&auto=format&fit=crop&q=80",
      desc: "Dum-cooked aged basmati infused with saffron & spices",
    },
    {
      name: "Italian Delights",
      image: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=500&auto=format&fit=crop&q=80",
      desc: "Wood-fired stone pizzas & creamy handmade pastas",
    },
    {
      name: "Indo-Chinese",
      image: "https://images.unsplash.com/photo-1541696432-82c6da8ce7bf?w=500&auto=format&fit=crop&q=80",
      desc: "Fiery schezwan noodles, dim sums & spicy gravies",
    },
    {
      name: "Artisanal Desserts",
      image: "https://images.unsplash.com/photo-1551024709-8f23befc6f87?w=500&auto=format&fit=crop&q=80",
      desc: "Warm choco lava, waffles, cheesecakes & gelato",
    },
  ];

  const steps = [
    {
      num: "01",
      title: "Set Your Taste Profile",
      desc: "Select your favorite cuisines, diet (Veg/Non-Veg/Vegan), spice tolerance, and target budget.",
      icon: Sliders,
    },
    {
      num: "02",
      title: "Rule-Based Scoring Engine",
      desc: "Our transparent algorithm compares 100+ dishes against your parameters using weighted scoring points.",
      icon: Zap,
    },
    {
      num: "03",
      title: "Get Explainable Recommendations",
      desc: "Discover dishes with exact match percentages and transparent reasons like 'Fits your ₹300 budget'.",
      icon: Sparkles,
    },
  ];

  return (
    <div className="min-h-screen bg-[#faf7f2] flex flex-col justify-between">
      <Navbar />

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-8 pb-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Hero Text */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-orange-100 text-orange-800 text-xs font-bold uppercase tracking-wider">
                <Sparkles className="w-4 h-4 text-orange-600" />
                Transparent Rule-Based Recommendation Engine
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-stone-900 tracking-tight leading-tight">
                Find food <br />
                <span className="bg-linear-to-r from-orange-600 via-rose-600 to-amber-600 bg-clip-text text-transparent">
                  you'll love.
                </span>
              </h1>

              <p className="text-lg text-stone-600 max-w-xl leading-relaxed">
                Get personalized food recommendations based on your taste, preferences,
                and budget. No black-box machine learning—just honest, explainable food scoring.
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-wrap items-center gap-4 pt-2">
                <Link
                  to="/register"
                  className="px-7 py-3.5 bg-linear-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 text-white font-bold rounded-2xl shadow-lg shadow-orange-600/25 hover:shadow-orange-600/35 transition-all flex items-center gap-2 group text-base"
                >
                  <span>Get Started</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>

                <Link
                  to="/search"
                  className="px-7 py-3.5 bg-white hover:bg-stone-50 text-stone-800 font-bold rounded-2xl border border-stone-200 shadow-xs hover:shadow transition-all text-base"
                >
                  Explore Foods
                </Link>
              </div>

              {/* Social Proof / Stats */}
              <div className="pt-6 border-t border-stone-200/80 grid grid-cols-3 gap-4">
                <div>
                  <div className="text-2xl font-black text-stone-900">20+</div>
                  <div className="text-xs text-stone-500 font-medium">Curated Kitchens</div>
                </div>
                <div>
                  <div className="text-2xl font-black text-stone-900">120+</div>
                  <div className="text-xs text-stone-500 font-medium">Specialty Dishes</div>
                </div>
                <div>
                  <div className="text-2xl font-black text-stone-900">100%</div>
                  <div className="text-xs text-stone-500 font-medium">Explainable Logic</div>
                </div>
              </div>
            </div>

            {/* Right Hero Food Showcase Card Stack */}
            <div className="lg:col-span-5 relative">
              <div className="relative mx-auto max-w-md">
                {/* Main Hero Card */}
                <div className="bg-white rounded-3xl p-4 shadow-2xl border border-stone-100 relative z-20">
                  <div className="relative h-60 rounded-2xl overflow-hidden mb-4">
                    <img
                      src="https://images.unsplash.com/photo-1668236543090-82eba5ee5976?w=600&auto=format&fit=crop&q=80"
                      alt="Masala Dosa Recommendation"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-3 right-3 bg-emerald-600 text-white px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 shadow-md">
                      <Sparkles className="w-3.5 h-3.5" />
                      96% Match
                    </div>
                    <div className="absolute bottom-3 left-3 bg-white/90 backdrop-blur-md px-2.5 py-1 rounded-full text-xs font-bold text-emerald-800 flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                      Pure Vegetarian
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-lg font-bold text-stone-900">Classic Masala Dosa</h3>
                        <p className="text-xs text-stone-500">Dosa Corner & Tiffins • South Indian</p>
                      </div>
                      <span className="text-xl font-extrabold text-stone-900">₹120</span>
                    </div>

                    <div className="p-3 bg-amber-50/80 rounded-xl border border-amber-200/60 text-xs text-stone-700">
                      <div className="font-semibold text-stone-900 flex items-center gap-1 mb-0.5">
                        <Sparkles className="w-3.5 h-3.5 text-orange-600" />
                        Why Recommended:
                      </div>
                      "Matches your South Indian cuisine and vegetarian preferences, fits your budget of ₹300, and is highly rated."
                    </div>
                  </div>
                </div>

                {/* Floating Decorative Card Behind */}
                <div className="absolute -bottom-6 -right-6 bg-white/90 backdrop-blur-md p-4 rounded-2xl shadow-xl border border-orange-100 z-30 hidden sm:flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-orange-500 text-white flex items-center justify-center font-bold">
                    🔥
                  </div>
                  <div>
                    <div className="text-xs font-bold text-stone-900">Live Weighted Scoring</div>
                    <div className="text-[11px] text-stone-500">Cuisine +30 • Type +25 • Budget +10</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Popular Cuisines Carousel / Grid */}
      <section className="py-16 bg-white border-y border-stone-200/70">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10">
            <div>
              <span className="text-xs font-bold text-orange-600 uppercase tracking-widest">
                Diverse Menus
              </span>
              <h2 className="text-3xl font-extrabold text-stone-900 mt-1">
                Explore Popular Cuisines
              </h2>
            </div>
            <Link
              to="/search"
              className="text-sm font-bold text-orange-600 hover:text-orange-700 flex items-center gap-1 mt-2 sm:mt-0"
            >
              Browse All Foods <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {cuisines.map((c) => (
              <Link
                key={c.name}
                to={`/search?cuisine=${encodeURIComponent(c.name.split(" ")[0])}`}
                className="group relative h-48 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all"
              >
                <img
                  src={c.image}
                  alt={c.name}
                  className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent"></div>
                <div className="absolute bottom-4 left-4 right-4 text-white">
                  <h3 className="text-lg font-bold group-hover:text-amber-300 transition-colors">
                    {c.name}
                  </h3>
                  <p className="text-xs text-stone-300 mt-1 line-clamp-1">{c.desc}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works (College Project Transparent Algorithm Explainer) */}
      <section className="py-16 bg-[#faf7f2]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-bold text-orange-600 uppercase tracking-widest">
              Simple & Explainable
            </span>
            <h2 className="text-3xl font-extrabold text-stone-900 mt-1">
              How FoodieAI Recommends Food
            </h2>
            <p className="text-sm text-stone-600 mt-2">
              Designed for transparency: every recommended dish has a mathematical point breakdown
              based on matching your personal taste criteria.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {steps.map((step) => {
              const Icon = step.icon;
              return (
                <div
                  key={step.num}
                  className="bg-white rounded-3xl p-6 border border-stone-200/80 shadow-xs hover:shadow-md transition-shadow relative"
                >
                  <div className="text-4xl font-black text-orange-200 mb-4">{step.num}</div>
                  <div className="w-12 h-12 rounded-2xl bg-orange-50 text-orange-600 flex items-center justify-center mb-4">
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-bold text-stone-900 mb-2">{step.title}</h3>
                  <p className="text-xs text-stone-600 leading-relaxed">{step.desc}</p>
                </div>
              );
            })}
          </div>

          {/* Scoring Table Summary Box */}
          <div className="mt-12 bg-white rounded-3xl p-6 border border-stone-200/80 shadow-xs max-w-3xl mx-auto">
            <h4 className="text-sm font-bold text-stone-900 mb-3 flex items-center gap-2">
              <Award className="w-4 h-4 text-orange-600" />
              Recommendation Scoring Matrix (Out of 100 Points):
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
              <div className="p-2.5 bg-stone-50 rounded-xl">
                <span className="font-semibold text-stone-800">Cuisine Match</span>
                <span className="block text-orange-600 font-bold mt-0.5">+30 Points</span>
              </div>
              <div className="p-2.5 bg-stone-50 rounded-xl">
                <span className="font-semibold text-stone-800">Dietary Type</span>
                <span className="block text-emerald-600 font-bold mt-0.5">+25 Points</span>
              </div>
              <div className="p-2.5 bg-stone-50 rounded-xl">
                <span className="font-semibold text-stone-800">Favorite Category</span>
                <span className="block text-orange-600 font-bold mt-0.5">+20 Points</span>
              </div>
              <div className="p-2.5 bg-stone-50 rounded-xl">
                <span className="font-semibold text-stone-800">Spice Preference</span>
                <span className="block text-amber-600 font-bold mt-0.5">+10 Points</span>
              </div>
              <div className="p-2.5 bg-stone-50 rounded-xl">
                <span className="font-semibold text-stone-800">Budget Range</span>
                <span className="block text-emerald-600 font-bold mt-0.5">+10 Points</span>
              </div>
              <div className="p-2.5 bg-stone-50 rounded-xl">
                <span className="font-semibold text-stone-800">High Rating (★4.5+)</span>
                <span className="block text-amber-500 font-bold mt-0.5">+5 Points</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-stone-900 text-stone-400 py-12 border-t border-stone-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-orange-600 text-white flex items-center justify-center font-bold">
                🍽️
              </div>
              <span className="text-lg font-bold text-white">FoodieAI</span>
              <span className="text-xs text-stone-500 ml-2">College Project Edition</span>
            </div>

            <div className="text-xs text-stone-500 text-center sm:text-right">
              Powered by Python FastAPI, React.js & Neon PostgreSQL.
              <br />
              Transparent Rule-Based Recommendation Engine (No Machine Learning).
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
