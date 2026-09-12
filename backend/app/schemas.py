from typing import Optional, List, Dict, Any
from datetime import datetime
from pydantic import BaseModel, EmailStr, Field


# --- Auth & User Schemas ---
class UserCreate(BaseModel):
    name: str = Field(..., min_length=2, max_length=100)
    email: EmailStr
    password: str = Field(..., min_length=6)
    confirm_password: Optional[str] = None


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: "UserOut"


class TokenData(BaseModel):
    user_id: Optional[int] = None
    email: Optional[str] = None


class UserOut(BaseModel):
    id: int
    name: str
    email: str
    is_admin: bool
    created_at: datetime

    class Config:
        from_attributes = True


# --- User Preferences Schemas ---
class UserPreferencesBase(BaseModel):
    preferred_cuisine: str = "South Indian"
    food_type: str = "Vegetarian"
    spice_level: str = "Medium"
    budget_range: str = "₹150–₹300"
    favorite_categories: str = "Dosa, Biryani"
    dietary_preference: str = "No restrictions"


class UserPreferencesCreate(UserPreferencesBase):
    pass


class UserPreferencesUpdate(BaseModel):
    preferred_cuisine: Optional[str] = None
    food_type: Optional[str] = None
    spice_level: Optional[str] = None
    budget_range: Optional[str] = None
    favorite_categories: Optional[str] = None
    dietary_preference: Optional[str] = None


class UserPreferencesOut(UserPreferencesBase):
    id: int
    user_id: int

    class Config:
        from_attributes = True


# --- Restaurant Schemas ---
class RestaurantBase(BaseModel):
    name: str
    description: Optional[str] = None
    location: str
    rating: float = 4.2
    price_range: str = "₹₹"
    image_url: Optional[str] = None


class RestaurantCreate(RestaurantBase):
    pass


class RestaurantUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    location: Optional[str] = None
    rating: Optional[float] = None
    price_range: Optional[str] = None
    image_url: Optional[str] = None


class RestaurantOut(RestaurantBase):
    id: int

    class Config:
        from_attributes = True


# --- Food Item Schemas ---
class FoodItemBase(BaseModel):
    name: str
    description: Optional[str] = None
    category: str
    cuisine: str
    food_type: str
    spice_level: str = "Medium"
    price: float
    calories: int = 350
    protein: float = 12.0
    rating: float = 4.5
    image_url: Optional[str] = None
    ingredients: Optional[str] = None
    restaurant_id: int


class FoodItemCreate(FoodItemBase):
    pass


class FoodItemUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    category: Optional[str] = None
    cuisine: Optional[str] = None
    food_type: Optional[str] = None
    spice_level: Optional[str] = None
    price: Optional[float] = None
    calories: Optional[int] = None
    protein: Optional[float] = None
    rating: Optional[float] = None
    image_url: Optional[str] = None
    ingredients: Optional[str] = None
    restaurant_id: Optional[int] = None


class FoodItemOut(FoodItemBase):
    id: int
    restaurant_name: Optional[str] = None

    class Config:
        from_attributes = True


class FoodItemWithRestaurantOut(FoodItemOut):
    restaurant: Optional[RestaurantOut] = None

    class Config:
        from_attributes = True


class RestaurantWithFoodsOut(RestaurantOut):
    food_items: List[FoodItemOut] = []

    class Config:
        from_attributes = True


# --- Recommendation Schema ---
class RecommendationOut(BaseModel):
    food: FoodItemWithRestaurantOut
    match_score: float
    match_percentage: int
    reason: str
    score_breakdown: Dict[str, Any] = {}
    is_favorite: bool = False


# --- Favorite Schemas ---
class FavoriteOut(BaseModel):
    id: int
    user_id: int
    food_item_id: int
    created_at: datetime
    food_item: Optional[FoodItemWithRestaurantOut] = None

    class Config:
        from_attributes = True


# --- Rating Schemas ---
class RatingCreate(BaseModel):
    food_item_id: int
    rating: float = Field(..., ge=1, le=5)
    review: Optional[str] = None


class RatingOut(BaseModel):
    id: int
    user_id: int
    food_item_id: int
    rating: float
    review: Optional[str] = None
    created_at: datetime
    user_name: Optional[str] = None

    class Config:
        from_attributes = True


# --- Interaction Schemas ---
class InteractionCreate(BaseModel):
    food_item_id: int
    interaction_type: str  # view, favorite, rating, not_interested


class InteractionOut(BaseModel):
    id: int
    user_id: int
    food_item_id: int
    interaction_type: str
    created_at: datetime

    class Config:
        from_attributes = True


# --- Search History Schemas ---
class SearchHistoryOut(BaseModel):
    id: int
    search_query: str
    created_at: datetime

    class Config:
        from_attributes = True


# --- Admin Stats Schemas ---
class AdminStatsOut(BaseModel):
    total_users: int
    total_restaurants: int
    total_foods: int
    total_ratings: int
    total_favorites: int
    most_popular_food: Optional[str] = None
    most_popular_cuisine: Optional[str] = None
