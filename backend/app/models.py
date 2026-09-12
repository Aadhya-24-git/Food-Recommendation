from datetime import datetime
from sqlalchemy import Column, Integer, String, Float, ForeignKey, DateTime, Text, Boolean
from sqlalchemy.orm import relationship
from .database import Base


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    email = Column(String(150), unique=True, index=True, nullable=False)
    password_hash = Column(String(255), nullable=False)
    is_admin = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    preferences = relationship("UserPreferences", back_populates="user", uselist=False, cascade="all, delete-orphan")
    favorites = relationship("Favorite", back_populates="user", cascade="all, delete-orphan")
    ratings = relationship("Rating", back_populates="user", cascade="all, delete-orphan")
    interactions = relationship("UserInteraction", back_populates="user", cascade="all, delete-orphan")
    search_history = relationship("SearchHistory", back_populates="user", cascade="all, delete-orphan")


class UserPreferences(Base):
    __tablename__ = "user_preferences"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), unique=True, nullable=False)
    preferred_cuisine = Column(String(255), default="South Indian")  # comma-separated if multiple
    food_type = Column(String(50), default="Vegetarian")  # Vegetarian, Non-Vegetarian, Vegan, Eggitarian
    spice_level = Column(String(50), default="Medium")  # Mild, Medium, Spicy
    budget_range = Column(String(50), default="₹150–₹300")  # Under ₹150, ₹150–₹300, ₹300–₹500, ₹500+
    favorite_categories = Column(String(255), default="Dosa, Biryani")  # comma-separated
    dietary_preference = Column(String(100), default="No restrictions")  # No restrictions, Low calorie, High protein, etc.

    user = relationship("User", back_populates="preferences")


class Restaurant(Base):
    __tablename__ = "restaurants"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(150), nullable=False, index=True)
    description = Column(Text, nullable=True)
    location = Column(String(200), nullable=False)
    rating = Column(Float, default=4.2)
    price_range = Column(String(50), default="₹₹")  # ₹, ₹₹, ₹₹₹
    image_url = Column(String(500), nullable=True)

    food_items = relationship("FoodItem", back_populates="restaurant", cascade="all, delete-orphan")


class FoodItem(Base):
    __tablename__ = "food_items"

    id = Column(Integer, primary_key=True, index=True)
    restaurant_id = Column(Integer, ForeignKey("restaurants.id", ondelete="CASCADE"), nullable=False)
    name = Column(String(150), nullable=False, index=True)
    description = Column(Text, nullable=True)
    category = Column(String(100), nullable=False, index=True)  # Biryani, Dosa, Pizza, Burger, Noodles, etc.
    cuisine = Column(String(100), nullable=False, index=True)  # South Indian, North Indian, Chinese, etc.
    food_type = Column(String(50), nullable=False, index=True)  # Vegetarian, Non-Vegetarian, Vegan, Eggitarian
    spice_level = Column(String(50), default="Medium")  # Mild, Medium, Spicy
    price = Column(Float, nullable=False)
    calories = Column(Integer, default=350)
    protein = Column(Float, default=12.0)
    rating = Column(Float, default=4.5)
    image_url = Column(String(500), nullable=True)
    ingredients = Column(Text, nullable=True)

    restaurant = relationship("Restaurant", back_populates="food_items")
    favorites = relationship("Favorite", back_populates="food_item", cascade="all, delete-orphan")
    ratings = relationship("Rating", back_populates="food_item", cascade="all, delete-orphan")
    interactions = relationship("UserInteraction", back_populates="food_item", cascade="all, delete-orphan")


class Favorite(Base):
    __tablename__ = "favorites"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    food_item_id = Column(Integer, ForeignKey("food_items.id", ondelete="CASCADE"), nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="favorites")
    food_item = relationship("FoodItem", back_populates="favorites")


class Rating(Base):
    __tablename__ = "ratings"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    food_item_id = Column(Integer, ForeignKey("food_items.id", ondelete="CASCADE"), nullable=False)
    rating = Column(Float, nullable=False)
    review = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="ratings")
    food_item = relationship("FoodItem", back_populates="ratings")


class UserInteraction(Base):
    __tablename__ = "user_interactions"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    food_item_id = Column(Integer, ForeignKey("food_items.id", ondelete="CASCADE"), nullable=False)
    interaction_type = Column(String(50), nullable=False)  # view, favorite, rating, not_interested
    created_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="interactions")
    food_item = relationship("FoodItem", back_populates="interactions")


class SearchHistory(Base):
    __tablename__ = "search_history"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="SET NULL"), nullable=True)
    search_query = Column(String(255), nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="search_history")
