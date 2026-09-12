import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import api from "../services/api";
import {
  ShieldAlert,
  Users,
  Utensils,
  ShoppingBag,
  Star,
  Heart,
  Plus,
  Edit2,
  Trash2,
  Trophy,
  X,
  CheckCircle,
} from "lucide-react";

export const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [usersList, setUsersList] = useState([]);
  const [foodsList, setFoodsList] = useState([]);
  const [restaurantsList, setRestaurantsList] = useState([]);
  const [loading, setLoading] = useState(true);

  // Active Tab: 'overview' | 'foods' | 'restaurants' | 'users'
  const [activeTab, setActiveTab] = useState("overview");

  // Modals
  const [foodModalOpen, setFoodModalOpen] = useState(false);
  const [editingFood, setEditingFood] = useState(null);
  const [foodForm, setFoodForm] = useState({
    name: "",
    description: "",
    category: "Biryani",
    cuisine: "South Indian",
    food_type: "Vegetarian",
    spice_level: "Medium",
    price: 150,
    calories: 350,
    protein: 12,
    rating: 4.5,
    image_url: "",
    ingredients: "",
    restaurant_id: 1,
  });

  const [restaurantModalOpen, setRestaurantModalOpen] = useState(false);
  const [editingRestaurant, setEditingRestaurant] = useState(null);
  const [restaurantForm, setRestaurantForm] = useState({
    name: "",
    description: "",
    location: "",
    rating: 4.5,
    price_range: "₹₹",
    image_url: "",
  });

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [dashRes, foodsRes, restsRes] = await Promise.all([
        api.get("/admin/dashboard"),
        api.get("/foods?limit=100"),
        api.get("/restaurants?limit=50"),
      ]);

      setStats(dashRes.data.stats);
      setUsersList(dashRes.data.users);
      setFoodsList(foodsRes.data);
      setRestaurantsList(restsRes.data);
      if (restsRes.data.length > 0 && !foodForm.restaurant_id) {
        setFoodForm((prev) => ({ ...prev, restaurant_id: restsRes.data[0].id }));
      }
    } catch (err) {
      console.error("Failed to load admin data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  // Food Handlers
  const handleOpenAddFood = () => {
    setEditingFood(null);
    setFoodForm({
      name: "",
      description: "",
      category: "Dosa",
      cuisine: "South Indian",
      food_type: "Vegetarian",
      spice_level: "Medium",
      price: 150,
      calories: 350,
      protein: 12,
      rating: 4.5,
      image_url: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&auto=format&fit=crop&q=80",
      ingredients: "Fresh organic ingredients",
      restaurant_id: restaurantsList[0]?.id || 1,
    });
    setFoodModalOpen(true);
  };

  const handleOpenEditFood = (food) => {
    setEditingFood(food);
    setFoodForm({
      name: food.name,
      description: food.description || "",
      category: food.category,
      cuisine: food.cuisine,
      food_type: food.food_type,
      spice_level: food.spice_level,
      price: food.price,
      calories: food.calories || 350,
      protein: food.protein || 12,
      rating: food.rating || 4.5,
      image_url: food.image_url || "",
      ingredients: food.ingredients || "",
      restaurant_id: food.restaurant_id,
    });
    setFoodModalOpen(true);
  };

  const handleSaveFood = async (e) => {
    e.preventDefault();
    try {
      if (editingFood) {
        await api.put(`/admin/foods/${editingFood.id}`, foodForm);
      } else {
        await api.post("/admin/foods", foodForm);
      }
      setFoodModalOpen(false);
      fetchDashboardData();
    } catch (err) {
      console.error("Failed to save food:", err);
      alert("Error saving food item.");
    }
  };

  const handleDeleteFood = async (id, name) => {
    if (!window.confirm(`Are you sure you want to delete '${name}'?`)) return;
    try {
      await api.delete(`/admin/foods/${id}`);
      fetchDashboardData();
    } catch (err) {
      console.error("Failed to delete food:", err);
    }
  };

  // Restaurant Handlers
  const handleOpenAddRestaurant = () => {
    setEditingRestaurant(null);
    setRestaurantForm({
      name: "",
      description: "",
      location: "",
      rating: 4.5,
      price_range: "₹₹",
      image_url: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=600&auto=format&fit=crop&q=80",
    });
    setRestaurantModalOpen(true);
  };

  const handleOpenEditRestaurant = (rest) => {
    setEditingRestaurant(rest);
    setRestaurantForm({
      name: rest.name,
      description: rest.description || "",
      location: rest.location,
      rating: rest.rating || 4.5,
      price_range: rest.price_range || "₹₹",
      image_url: rest.image_url || "",
    });
    setRestaurantModalOpen(true);
  };

  const handleSaveRestaurant = async (e) => {
    e.preventDefault();
    try {
      if (editingRestaurant) {
        await api.put(`/admin/restaurants/${editingRestaurant.id}`, restaurantForm);
      } else {
        await api.post("/admin/restaurants", restaurantForm);
      }
      setRestaurantModalOpen(false);
      fetchDashboardData();
    } catch (err) {
      console.error("Failed to save restaurant:", err);
      alert("Error saving restaurant.");
    }
  };

  const handleDeleteRestaurant = async (id, name) => {
    if (!window.confirm(`Are you sure you want to delete '${name}' and its menu items?`)) return;
    try {
      await api.delete(`/admin/restaurants/${id}`);
      fetchDashboardData();
    } catch (err) {
      console.error("Failed to delete restaurant:", err);
    }
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

  return (
    <div className="min-h-screen bg-[#faf7f2] flex flex-col">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-black text-stone-900 flex items-center gap-2">
              <ShieldAlert className="w-8 h-8 text-red-600" />
              Admin Control Dashboard
            </h1>
            <p className="text-xs text-stone-500 mt-1">
              System analytics and CRUD management for restaurants, foods, and users
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleOpenAddFood}
              className="px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              Add Food Item
            </button>
            <button
              onClick={handleOpenAddRestaurant}
              className="px-4 py-2 bg-stone-900 hover:bg-stone-800 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              Add Restaurant
            </button>
          </div>
        </div>

        {/* 7 Statistics Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
          <div className="bg-white p-4 rounded-2xl border border-stone-200/80 text-center shadow-xs">
            <Users className="w-5 h-5 text-blue-500 mx-auto mb-1" />
            <div className="text-xl font-black text-stone-900">{stats?.total_users || 0}</div>
            <div className="text-[11px] text-stone-500 font-medium">Total Users</div>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-stone-200/80 text-center shadow-xs">
            <Utensils className="w-5 h-5 text-amber-500 mx-auto mb-1" />
            <div className="text-xl font-black text-stone-900">{stats?.total_restaurants || 0}</div>
            <div className="text-[11px] text-stone-500 font-medium">Restaurants</div>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-stone-200/80 text-center shadow-xs">
            <ShoppingBag className="w-5 h-5 text-orange-500 mx-auto mb-1" />
            <div className="text-xl font-black text-stone-900">{stats?.total_foods || 0}</div>
            <div className="text-[11px] text-stone-500 font-medium">Food Items</div>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-stone-200/80 text-center shadow-xs">
            <Star className="w-5 h-5 text-yellow-500 fill-yellow-400 mx-auto mb-1" />
            <div className="text-xl font-black text-stone-900">{stats?.total_ratings || 0}</div>
            <div className="text-[11px] text-stone-500 font-medium">Ratings</div>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-stone-200/80 text-center shadow-xs">
            <Heart className="w-5 h-5 text-rose-500 fill-rose-500 mx-auto mb-1" />
            <div className="text-xl font-black text-stone-900">{stats?.total_favorites || 0}</div>
            <div className="text-[11px] text-stone-500 font-medium">Favorites</div>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-stone-200/80 text-center shadow-xs col-span-2 sm:col-span-1">
            <Trophy className="w-5 h-5 text-emerald-500 mx-auto mb-1" />
            <div className="text-sm font-black text-stone-900 truncate">
              {stats?.most_popular_food || "Masala Dosa"}
            </div>
            <div className="text-[11px] text-stone-500 font-medium">Top Food</div>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-stone-200/80 text-center shadow-xs col-span-2 sm:col-span-1">
            <div className="text-sm font-black text-stone-900 truncate">
              {stats?.most_popular_cuisine || "South Indian"}
            </div>
            <div className="text-[11px] text-stone-500 font-medium">Top Cuisine</div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 border-b border-stone-200">
          <button
            onClick={() => setActiveTab("overview")}
            className={`px-4 py-2.5 text-xs font-bold border-b-2 cursor-pointer transition-colors ${
              activeTab === "overview"
                ? "border-orange-600 text-orange-600"
                : "border-transparent text-stone-500 hover:text-stone-800"
            }`}
          >
            Overview & Users ({usersList.length})
          </button>
          <button
            onClick={() => setActiveTab("foods")}
            className={`px-4 py-2.5 text-xs font-bold border-b-2 cursor-pointer transition-colors ${
              activeTab === "foods"
                ? "border-orange-600 text-orange-600"
                : "border-transparent text-stone-500 hover:text-stone-800"
            }`}
          >
            Manage Foods ({foodsList.length})
          </button>
          <button
            onClick={() => setActiveTab("restaurants")}
            className={`px-4 py-2.5 text-xs font-bold border-b-2 cursor-pointer transition-colors ${
              activeTab === "restaurants"
                ? "border-orange-600 text-orange-600"
                : "border-transparent text-stone-500 hover:text-stone-800"
            }`}
          >
            Manage Restaurants ({restaurantsList.length})
          </button>
        </div>

        {/* Tab 1: Overview & Registered Users */}
        {activeTab === "overview" && (
          <div className="bg-white rounded-3xl border border-stone-200/80 shadow-xs overflow-hidden">
            <div className="p-5 border-b border-stone-100">
              <h3 className="font-bold text-stone-900 text-sm">Recently Registered Users</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-stone-600">
                <thead className="bg-stone-50 text-stone-700 font-bold uppercase">
                  <tr>
                    <th className="p-3.5">ID</th>
                    <th className="p-3.5">Name</th>
                    <th className="p-3.5">Email</th>
                    <th className="p-3.5">Role</th>
                    <th className="p-3.5">Registered At</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {usersList.map((u) => (
                    <tr key={u.id} className="hover:bg-stone-50/70">
                      <td className="p-3.5 font-bold">{u.id}</td>
                      <td className="p-3.5 font-semibold text-stone-900">{u.name}</td>
                      <td className="p-3.5">{u.email}</td>
                      <td className="p-3.5">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            u.is_admin
                              ? "bg-red-100 text-red-700"
                              : "bg-blue-100 text-blue-700"
                          }`}
                        >
                          {u.is_admin ? "Admin" : "Student"}
                        </span>
                      </td>
                      <td className="p-3.5 text-stone-400">
                        {new Date(u.created_at).toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 2: Foods Management Table */}
        {activeTab === "foods" && (
          <div className="bg-white rounded-3xl border border-stone-200/80 shadow-xs overflow-hidden">
            <div className="p-5 border-b border-stone-100 flex items-center justify-between">
              <h3 className="font-bold text-stone-900 text-sm">Dishes & Menu Catalog</h3>
              <button
                onClick={handleOpenAddFood}
                className="px-3 py-1.5 bg-orange-600 hover:bg-orange-700 text-white rounded-xl text-xs font-bold flex items-center gap-1 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                Add New Dish
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-stone-600">
                <thead className="bg-stone-50 text-stone-700 font-bold uppercase">
                  <tr>
                    <th className="p-3.5">Dish</th>
                    <th className="p-3.5">Cuisine</th>
                    <th className="p-3.5">Category</th>
                    <th className="p-3.5">Type</th>
                    <th className="p-3.5">Price</th>
                    <th className="p-3.5">Rating</th>
                    <th className="p-3.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {foodsList.map((food) => (
                    <tr key={food.id} className="hover:bg-stone-50/70">
                      <td className="p-3.5 font-bold text-stone-900 flex items-center gap-2">
                        <img
                          src={food.image_url || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=100&auto=format&fit=crop&q=80"}
                          alt={food.name}
                          className="w-8 h-8 rounded-lg object-cover"
                        />
                        <span>{food.name}</span>
                      </td>
                      <td className="p-3.5">{food.cuisine}</td>
                      <td className="p-3.5">{food.category}</td>
                      <td className="p-3.5 font-medium">{food.food_type}</td>
                      <td className="p-3.5 font-black text-stone-900">₹{Number(food.price).toFixed(0)}</td>
                      <td className="p-3.5">★ {Number(food.rating).toFixed(1)}</td>
                      <td className="p-3.5 text-right space-x-2">
                        <button
                          onClick={() => handleOpenEditFood(food)}
                          className="p-1 text-stone-500 hover:text-orange-600 cursor-pointer"
                          title="Edit Food"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteFood(food.id, food.name)}
                          className="p-1 text-stone-400 hover:text-red-600 cursor-pointer"
                          title="Delete Food"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 3: Restaurants Management Table */}
        {activeTab === "restaurants" && (
          <div className="bg-white rounded-3xl border border-stone-200/80 shadow-xs overflow-hidden">
            <div className="p-5 border-b border-stone-100 flex items-center justify-between">
              <h3 className="font-bold text-stone-900 text-sm">Registered Restaurants</h3>
              <button
                onClick={handleOpenAddRestaurant}
                className="px-3 py-1.5 bg-stone-900 hover:bg-stone-800 text-white rounded-xl text-xs font-bold flex items-center gap-1 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                Add Restaurant
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-stone-600">
                <thead className="bg-stone-50 text-stone-700 font-bold uppercase">
                  <tr>
                    <th className="p-3.5">Restaurant</th>
                    <th className="p-3.5">Location</th>
                    <th className="p-3.5">Price Range</th>
                    <th className="p-3.5">Rating</th>
                    <th className="p-3.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {restaurantsList.map((rest) => (
                    <tr key={rest.id} className="hover:bg-stone-50/70">
                      <td className="p-3.5 font-bold text-stone-900 flex items-center gap-2">
                        <img
                          src={rest.image_url || "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=100&auto=format&fit=crop&q=80"}
                          alt={rest.name}
                          className="w-8 h-8 rounded-lg object-cover"
                        />
                        <span>{rest.name}</span>
                      </td>
                      <td className="p-3.5">{rest.location}</td>
                      <td className="p-3.5 font-semibold">{rest.price_range}</td>
                      <td className="p-3.5">★ {Number(rest.rating).toFixed(1)}</td>
                      <td className="p-3.5 text-right space-x-2">
                        <button
                          onClick={() => handleOpenEditRestaurant(rest)}
                          className="p-1 text-stone-500 hover:text-orange-600 cursor-pointer"
                          title="Edit Restaurant"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteRestaurant(rest.id, rest.name)}
                          className="p-1 text-stone-400 hover:text-red-600 cursor-pointer"
                          title="Delete Restaurant"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Modal: Add/Edit Food */}
        {foodModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 overflow-y-auto">
            <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl space-y-4 my-8 relative">
              <button
                onClick={() => setFoodModalOpen(false)}
                className="absolute top-4 right-4 p-1 text-stone-400 hover:text-stone-700 rounded-full cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              <h3 className="text-xl font-bold text-stone-900">
                {editingFood ? "Edit Food Item" : "Add New Food Item"}
              </h3>

              <form onSubmit={handleSaveFood} className="space-y-3">
                <div>
                  <label className="block text-[11px] font-bold text-stone-700 uppercase mb-1">
                    Food Name
                  </label>
                  <input
                    type="text"
                    required
                    value={foodForm.name}
                    onChange={(e) => setFoodForm({ ...foodForm, name: e.target.value })}
                    className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[11px] font-bold text-stone-700 uppercase mb-1">
                      Restaurant
                    </label>
                    <select
                      value={foodForm.restaurant_id}
                      onChange={(e) => setFoodForm({ ...foodForm, restaurant_id: parseInt(e.target.value) })}
                      className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs"
                    >
                      {restaurantsList.map((r) => (
                        <option key={r.id} value={r.id}>
                          {r.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-stone-700 uppercase mb-1">
                      Price (₹)
                    </label>
                    <input
                      type="number"
                      required
                      value={foodForm.price}
                      onChange={(e) => setFoodForm({ ...foodForm, price: parseFloat(e.target.value) })}
                      className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <label className="block text-[11px] font-bold text-stone-700 uppercase mb-1">
                      Cuisine
                    </label>
                    <input
                      type="text"
                      required
                      value={foodForm.cuisine}
                      onChange={(e) => setFoodForm({ ...foodForm, cuisine: e.target.value })}
                      className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-stone-700 uppercase mb-1">
                      Category
                    </label>
                    <input
                      type="text"
                      required
                      value={foodForm.category}
                      onChange={(e) => setFoodForm({ ...foodForm, category: e.target.value })}
                      className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-stone-700 uppercase mb-1">
                      Food Type
                    </label>
                    <select
                      value={foodForm.food_type}
                      onChange={(e) => setFoodForm({ ...foodForm, food_type: e.target.value })}
                      className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs"
                    >
                      <option value="Vegetarian">Vegetarian</option>
                      <option value="Non-Vegetarian">Non-Vegetarian</option>
                      <option value="Vegan">Vegan</option>
                      <option value="Eggitarian">Eggitarian</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <label className="block text-[11px] font-bold text-stone-700 uppercase mb-1">
                      Spice Level
                    </label>
                    <select
                      value={foodForm.spice_level}
                      onChange={(e) => setFoodForm({ ...foodForm, spice_level: e.target.value })}
                      className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs"
                    >
                      <option value="Mild">Mild</option>
                      <option value="Medium">Medium</option>
                      <option value="Spicy">Spicy</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-stone-700 uppercase mb-1">
                      Calories
                    </label>
                    <input
                      type="number"
                      value={foodForm.calories}
                      onChange={(e) => setFoodForm({ ...foodForm, calories: parseInt(e.target.value) })}
                      className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-stone-700 uppercase mb-1">
                      Protein (g)
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      value={foodForm.protein}
                      onChange={(e) => setFoodForm({ ...foodForm, protein: parseFloat(e.target.value) })}
                      className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-stone-700 uppercase mb-1">
                    Image URL
                  </label>
                  <input
                    type="url"
                    value={foodForm.image_url}
                    onChange={(e) => setFoodForm({ ...foodForm, image_url: e.target.value })}
                    className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-stone-700 uppercase mb-1">
                    Description
                  </label>
                  <textarea
                    rows={2}
                    value={foodForm.description}
                    onChange={(e) => setFoodForm({ ...foodForm, description: e.target.value })}
                    className="w-full p-2 bg-stone-50 border border-stone-200 rounded-xl text-xs"
                  />
                </div>

                <div className="flex gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setFoodModalOpen(false)}
                    className="flex-1 py-2.5 border border-stone-200 rounded-xl text-xs font-bold text-stone-700 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2.5 bg-orange-600 text-white rounded-xl text-xs font-bold hover:bg-orange-700 cursor-pointer"
                  >
                    Save Dish
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Modal: Add/Edit Restaurant */}
        {restaurantModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 overflow-y-auto">
            <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl space-y-4 my-8 relative">
              <button
                onClick={() => setRestaurantModalOpen(false)}
                className="absolute top-4 right-4 p-1 text-stone-400 hover:text-stone-700 rounded-full cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              <h3 className="text-xl font-bold text-stone-900">
                {editingRestaurant ? "Edit Restaurant" : "Add New Restaurant"}
              </h3>

              <form onSubmit={handleSaveRestaurant} className="space-y-3">
                <div>
                  <label className="block text-[11px] font-bold text-stone-700 uppercase mb-1">
                    Restaurant Name
                  </label>
                  <input
                    type="text"
                    required
                    value={restaurantForm.name}
                    onChange={(e) => setRestaurantForm({ ...restaurantForm, name: e.target.value })}
                    className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-stone-700 uppercase mb-1">
                    Location / Area
                  </label>
                  <input
                    type="text"
                    required
                    value={restaurantForm.location}
                    onChange={(e) => setRestaurantForm({ ...restaurantForm, location: e.target.value })}
                    className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[11px] font-bold text-stone-700 uppercase mb-1">
                      Price Range
                    </label>
                    <select
                      value={restaurantForm.price_range}
                      onChange={(e) => setRestaurantForm({ ...restaurantForm, price_range: e.target.value })}
                      className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs"
                    >
                      <option value="₹">₹ (Affordable)</option>
                      <option value="₹₹">₹₹ (Moderate)</option>
                      <option value="₹₹₹">₹₹₹ (Premium)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-stone-700 uppercase mb-1">
                      Initial Rating
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      min="1"
                      max="5"
                      value={restaurantForm.rating}
                      onChange={(e) => setRestaurantForm({ ...restaurantForm, rating: parseFloat(e.target.value) })}
                      className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-stone-700 uppercase mb-1">
                    Banner Image URL
                  </label>
                  <input
                    type="url"
                    value={restaurantForm.image_url}
                    onChange={(e) => setRestaurantForm({ ...restaurantForm, image_url: e.target.value })}
                    className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-stone-700 uppercase mb-1">
                    Description
                  </label>
                  <textarea
                    rows={2}
                    value={restaurantForm.description}
                    onChange={(e) => setRestaurantForm({ ...restaurantForm, description: e.target.value })}
                    className="w-full p-2 bg-stone-50 border border-stone-200 rounded-xl text-xs"
                  />
                </div>

                <div className="flex gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setRestaurantModalOpen(false)}
                    className="flex-1 py-2.5 border border-stone-200 rounded-xl text-xs font-bold text-stone-700 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2.5 bg-stone-900 text-white rounded-xl text-xs font-bold hover:bg-stone-800 cursor-pointer"
                  >
                    Save Restaurant
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminDashboard;
