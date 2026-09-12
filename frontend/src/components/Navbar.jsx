import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  UtensilsCrossed,
  Compass,
  Heart,
  User,
  Sparkles,
  PieChart,
  ShieldAlert,
  LogOut,
  Menu,
  X,
} from "lucide-react";

export const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-orange-100 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Brand Logo */}
          <Link to={isAuthenticated ? "/home" : "/"} className="flex items-center gap-2 group">
            <div className="w-10 h-10 rounded-xl bg-linear-to-tr from-orange-600 to-amber-500 flex items-center justify-center text-white shadow-md shadow-orange-500/20 group-hover:scale-105 transition-transform">
              <UtensilsCrossed className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xl font-bold bg-linear-to-r from-orange-600 via-rose-600 to-amber-600 bg-clip-text text-transparent">
                FoodieAI
              </span>
              <span className="hidden sm:inline-block ml-1 text-xs px-1.5 py-0.5 rounded-full bg-orange-100 text-orange-700 font-medium">
                Smart Recommendations
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center gap-1 lg:gap-2">
            {isAuthenticated ? (
              <>
                <Link
                  to="/home"
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive("/home")
                      ? "bg-orange-50 text-orange-600 font-semibold"
                      : "text-stone-600 hover:text-stone-900 hover:bg-stone-50"
                  }`}
                >
                  <Sparkles className="w-4 h-4 text-orange-500" />
                  Home
                </Link>

                <Link
                  to="/search"
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive("/search")
                      ? "bg-orange-50 text-orange-600 font-semibold"
                      : "text-stone-600 hover:text-stone-900 hover:bg-stone-50"
                  }`}
                >
                  <Compass className="w-4 h-4 text-amber-500" />
                  Explore & Search
                </Link>

                <Link
                  to="/favorites"
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive("/favorites")
                      ? "bg-orange-50 text-orange-600 font-semibold"
                      : "text-stone-600 hover:text-stone-900 hover:bg-stone-50"
                  }`}
                >
                  <Heart className="w-4 h-4 text-rose-500" />
                  Favorites
                </Link>

                <Link
                  to="/taste-profile"
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive("/taste-profile")
                      ? "bg-orange-50 text-orange-600 font-semibold"
                      : "text-stone-600 hover:text-stone-900 hover:bg-stone-50"
                  }`}
                >
                  <PieChart className="w-4 h-4 text-emerald-500" />
                  My Taste Profile
                </Link>

                {user?.is_admin && (
                  <Link
                    to="/admin"
                    className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      isActive("/admin")
                        ? "bg-red-50 text-red-600 font-semibold"
                        : "text-stone-600 hover:text-red-700 hover:bg-red-50"
                    }`}
                  >
                    <ShieldAlert className="w-4 h-4 text-red-500" />
                    Admin
                  </Link>
                )}
              </>
            ) : (
              <>
                <Link
                  to="/"
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive("/") ? "text-orange-600 font-semibold" : "text-stone-600 hover:text-stone-900"
                  }`}
                >
                  Discover
                </Link>
                <Link
                  to="/search"
                  className="px-3 py-2 rounded-lg text-sm font-medium text-stone-600 hover:text-stone-900"
                >
                  Browse Foods
                </Link>
              </>
            )}
          </div>

          {/* Desktop Right Side / User Dropdown */}
          <div className="hidden md:flex items-center gap-3">
            {isAuthenticated ? (
              <div className="flex items-center gap-3 pl-2 border-l border-stone-200">
                <Link
                  to="/profile"
                  className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-stone-100 transition-colors"
                >
                  <div className="w-8 h-8 rounded-full bg-orange-100 text-orange-700 font-semibold flex items-center justify-center text-sm border border-orange-200">
                    {user?.name ? user.name[0].toUpperCase() : "U"}
                  </div>
                  <span className="text-sm font-medium text-stone-700 hidden lg:inline">
                    {user?.name}
                  </span>
                </Link>
                <button
                  onClick={handleLogout}
                  title="Log out"
                  className="p-2 text-stone-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="px-4 py-2 text-sm font-medium text-stone-700 hover:text-orange-600 transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 text-sm font-medium text-white bg-linear-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 rounded-lg shadow-sm hover:shadow transition-all"
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-stone-600 hover:text-stone-900 hover:bg-stone-100 focus:outline-none"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu modal dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-orange-100 bg-white px-4 pt-2 pb-4 space-y-2">
          {isAuthenticated ? (
            <>
              <div className="flex items-center gap-3 py-2 px-2 border-b border-stone-100">
                <div className="w-9 h-9 rounded-full bg-orange-100 text-orange-700 font-semibold flex items-center justify-center">
                  {user?.name ? user.name[0].toUpperCase() : "U"}
                </div>
                <div>
                  <div className="text-sm font-semibold text-stone-800">{user?.name}</div>
                  <div className="text-xs text-stone-500">{user?.email}</div>
                </div>
              </div>

              <Link
                to="/home"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2 px-3 py-2 rounded-lg text-stone-700 hover:bg-orange-50"
              >
                <Sparkles className="w-4 h-4 text-orange-500" />
                Home Recommendations
              </Link>
              <Link
                to="/search"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2 px-3 py-2 rounded-lg text-stone-700 hover:bg-orange-50"
              >
                <Compass className="w-4 h-4 text-amber-500" />
                Explore & Search
              </Link>
              <Link
                to="/favorites"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2 px-3 py-2 rounded-lg text-stone-700 hover:bg-orange-50"
              >
                <Heart className="w-4 h-4 text-rose-500" />
                Favorites
              </Link>
              <Link
                to="/taste-profile"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2 px-3 py-2 rounded-lg text-stone-700 hover:bg-orange-50"
              >
                <PieChart className="w-4 h-4 text-emerald-500" />
                My Taste Profile
              </Link>
              <Link
                to="/profile"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2 px-3 py-2 rounded-lg text-stone-700 hover:bg-orange-50"
              >
                <User className="w-4 h-4 text-stone-500" />
                Edit Food Preferences
              </Link>
              {user?.is_admin && (
                <Link
                  to="/admin"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg text-red-600 hover:bg-red-50"
                >
                  <ShieldAlert className="w-4 h-4 text-red-500" />
                  Admin Dashboard
                </Link>
              )}
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  handleLogout();
                }}
                className="w-full flex items-center gap-2 px-3 py-2 text-left text-red-600 hover:bg-red-50 rounded-lg cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
                Log Out
              </button>
            </>
          ) : (
            <div className="space-y-2 pt-2">
              <Link
                to="/"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-lg text-stone-700 hover:bg-stone-50"
              >
                Discover FoodieAI
              </Link>
              <Link
                to="/search"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-lg text-stone-700 hover:bg-stone-50"
              >
                Browse Menu
              </Link>
              <div className="flex gap-2 pt-2">
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex-1 py-2 text-center text-sm font-medium border border-stone-200 rounded-lg text-stone-700"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex-1 py-2 text-center text-sm font-medium text-white bg-orange-600 rounded-lg"
                >
                  Get Started
                </Link>
              </div>
            </div>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
