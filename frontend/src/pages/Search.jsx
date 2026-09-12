import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import FoodCard from "../components/FoodCard";
import FilterPanel from "../components/FilterPanel";
import SearchBar from "../components/SearchBar";
import api from "../services/api";
import { Search as SearchIcon, Clock, Sparkles } from "lucide-react";

export const Search = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialQuery = searchParams.get("q") || "";
  const initialCuisine = searchParams.get("cuisine") || "";

  const [query, setQuery] = useState(initialQuery);
  const [foods, setFoods] = useState([]);
  const [loading, setLoading] = useState(false);
  const [recentSearches, setRecentSearches] = useState([]);

  const [filters, setFilters] = useState({
    cuisine: initialCuisine,
    food_type: "",
    spice_level: "",
    max_price: "",
    min_rating: "",
  });

  // Fetch search history
  const fetchSearchHistory = async () => {
    try {
      const res = await api.get("/search/history");
      setRecentSearches(res.data || []);
    } catch (err) {
      // Non-critical, ignore if unauthenticated
    }
  };

  const fetchResults = async (q = query, activeFilters = filters) => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (q && q.trim()) params.append("q", q.trim());
      if (activeFilters.cuisine) params.append("cuisine", activeFilters.cuisine);
      if (activeFilters.food_type) params.append("food_type", activeFilters.food_type);
      if (activeFilters.spice_level) params.append("spice_level", activeFilters.spice_level);
      if (activeFilters.max_price) params.append("max_price", activeFilters.max_price);
      if (activeFilters.min_rating) params.append("min_rating", activeFilters.min_rating);

      const res = await api.get(`/search?${params.toString()}`);
      setFoods(res.data);
    } catch (err) {
      console.error("Search error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSearchHistory();
    fetchResults(initialQuery, filters);
  }, []);

  const handleSearchSubmit = (newQuery) => {
    setQuery(newQuery);
    setSearchParams(newQuery ? { q: newQuery } : {});
    fetchResults(newQuery, filters);
    fetchSearchHistory();
  };

  const handleFilterChange = (key, value) => {
    const updated = { ...filters, [key]: value };
    setFilters(updated);
    fetchResults(query, updated);
  };

  const handleResetFilters = () => {
    const reset = {
      cuisine: "",
      food_type: "",
      spice_level: "",
      max_price: "",
      min_rating: "",
    };
    setFilters(reset);
    fetchResults(query, reset);
  };

  return (
    <div className="min-h-screen bg-[#faf7f2] flex flex-col">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full space-y-8">
        {/* Header & Search Bar */}
        <div className="space-y-4">
          <div>
            <h1 className="text-3xl font-black text-stone-900">Explore & Search Food</h1>
            <p className="text-xs text-stone-500 mt-1">
              Search by food name, restaurant, cuisine, or category with real-time filters
            </p>
          </div>

          <SearchBar
            initialValue={query}
            onSearch={handleSearchSubmit}
            placeholder="Search e.g. Biryani, Masala Dosa, Pizza, Hakka Noodles..."
          />

          {/* Recent Searches Tags */}
          {recentSearches.length > 0 && (
            <div className="flex items-center gap-2 flex-wrap text-xs text-stone-500 pt-1">
              <span className="flex items-center gap-1 font-semibold text-stone-700">
                <Clock className="w-3.5 h-3.5 text-stone-400" />
                Recent:
              </span>
              {recentSearches.slice(0, 6).map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleSearchSubmit(item.search_query)}
                  className="px-2.5 py-1 bg-white hover:bg-orange-50 hover:text-orange-700 rounded-lg border border-stone-200 text-stone-600 transition-colors cursor-pointer"
                >
                  {item.search_query}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Layout: Filters Sidebar + Results Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Filter Sidebar */}
          <div className="lg:col-span-4 sticky top-24">
            <FilterPanel
              filters={filters}
              onChange={handleFilterChange}
              onReset={handleResetFilters}
            />
          </div>

          {/* Food Grid Results */}
          <div className="lg:col-span-8 space-y-4">
            <div className="flex items-center justify-between text-xs text-stone-500">
              <span className="font-semibold text-stone-700">
                Showing {foods.length} dish{foods.length === 1 ? "" : "es"} found
              </span>
              {query && (
                <span>
                  Query: <strong className="text-stone-900 font-bold">"{query}"</strong>
                </span>
              )}
            </div>

            {loading ? (
              <div className="py-24 text-center">
                <div className="animate-spin rounded-full h-10 w-10 border-4 border-orange-500 border-t-transparent mx-auto mb-3"></div>
                <p className="text-xs text-stone-500 font-medium">Fetching culinary delights...</p>
              </div>
            ) : foods.length === 0 ? (
              <div className="bg-white rounded-3xl p-12 text-center border border-dashed border-stone-300 space-y-3">
                <div className="w-12 h-12 rounded-full bg-orange-50 text-orange-600 flex items-center justify-center mx-auto">
                  <SearchIcon className="w-6 h-6" />
                </div>
                <h3 className="text-base font-bold text-stone-800">No dishes match your search</h3>
                <p className="text-xs text-stone-500 max-w-sm mx-auto">
                  Try clearing some filters or searching for broader terms like "Biryani", "Dosa", or "Paneer".
                </p>
                <button
                  onClick={handleResetFilters}
                  className="px-4 py-2 bg-orange-600 text-white rounded-xl text-xs font-bold hover:bg-orange-700 transition-colors cursor-pointer"
                >
                  Reset Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {foods.map((food) => (
                  <FoodCard key={food.id} item={food} />
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Search;
