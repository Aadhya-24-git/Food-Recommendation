from typing import Dict, Any
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import func

from ..database import get_db
from ..models import User, UserPreferences, Favorite, Rating, FoodItem, UserInteraction
from ..schemas import UserOut, UserPreferencesUpdate
from ..utils.security import get_current_user

router = APIRouter(prefix="/api/profile", tags=["Profile & Taste Analytics"])


@router.get("")
def get_user_profile(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    pref = db.query(UserPreferences).filter(UserPreferences.user_id == current_user.id).first()
    fav_count = db.query(Favorite).filter(Favorite.user_id == current_user.id).count()
    rating_count = db.query(Rating).filter(Rating.user_id == current_user.id).count()

    return {
        "user": {
            "id": current_user.id,
            "name": current_user.name,
            "email": current_user.email,
            "is_admin": current_user.is_admin,
            "created_at": current_user.created_at,
        },
        "preferences": pref,
        "stats": {
            "favorites_count": fav_count,
            "ratings_count": rating_count,
        }
    }


@router.put("")
def update_user_profile(
    name: str = None,
    pref_data: UserPreferencesUpdate = None,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    if name:
        current_user.name = name

    pref = db.query(UserPreferences).filter(UserPreferences.user_id == current_user.id).first()
    if not pref:
        pref = UserPreferences(user_id=current_user.id)
        db.add(pref)

    if pref_data:
        for k, v in pref_data.model_dump(exclude_unset=True).items():
            setattr(pref, k, v)

    db.commit()
    db.refresh(current_user)
    db.refresh(pref)

    return {
        "user": current_user,
        "preferences": pref
    }


@router.get("/taste")
def get_taste_profile(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    pref = db.query(UserPreferences).filter(UserPreferences.user_id == current_user.id).first()

    # Ratings statistics
    user_ratings = (
        db.query(Rating, FoodItem)
        .join(FoodItem, Rating.food_item_id == FoodItem.id)
        .filter(Rating.user_id == current_user.id)
        .all()
    )

    ratings_count = len(user_ratings)
    avg_rating = 0.0
    if ratings_count > 0:
        avg_rating = round(sum(r.rating for r, _ in user_ratings) / ratings_count, 2)

    # Favorites count & breakdown
    user_favs = (
        db.query(Favorite, FoodItem)
        .join(FoodItem, Favorite.food_item_id == FoodItem.id)
        .filter(Favorite.user_id == current_user.id)
        .all()
    )
    fav_count = len(user_favs)

    # Calculate cuisine breakdown from favorites & high ratings
    cuisine_counts: Dict[str, int] = {}
    category_counts: Dict[str, int] = {}

    for _, food in user_favs:
        cuisine_counts[food.cuisine] = cuisine_counts.get(food.cuisine, 0) + 2
        category_counts[food.category] = category_counts.get(food.category, 0) + 2

    for r, food in user_ratings:
        if r.rating >= 4.0:
            cuisine_counts[food.cuisine] = cuisine_counts.get(food.cuisine, 0) + 1
            category_counts[food.category] = category_counts.get(food.category, 0) + 1

    # Most frequent or fallback to preference
    top_cuisine = pref.preferred_cuisine.split(",")[0].strip() if pref and pref.preferred_cuisine else "South Indian"
    if cuisine_counts:
        top_cuisine = max(cuisine_counts, key=cuisine_counts.get)

    top_category = pref.favorite_categories.split(",")[0].strip() if pref and pref.favorite_categories else "Biryani"
    if category_counts:
        top_category = max(category_counts, key=category_counts.get)

    return {
        "favorite_cuisine": top_cuisine,
        "favorite_category": top_category,
        "preferred_budget": pref.budget_range if pref else "₹150–₹300",
        "preferred_spice": pref.spice_level if pref else "Medium",
        "preferred_food_type": pref.food_type if pref else "Vegetarian",
        "dietary_preference": pref.dietary_preference if pref else "No restrictions",
        "total_rated": ratings_count,
        "total_favorited": fav_count,
        "average_rating_given": avg_rating,
        "cuisine_distribution": cuisine_counts,
        "category_distribution": category_counts
    }
