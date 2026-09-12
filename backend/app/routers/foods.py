from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session

from ..database import get_db
from ..models import FoodItem, Restaurant, User, UserPreferences
from ..schemas import FoodItemWithRestaurantOut
from ..utils.security import get_optional_current_user
from ..services.recommendation_engine import calculate_food_score

router = APIRouter(prefix="/api/foods", tags=["Foods"])


@router.get("", response_model=List[FoodItemWithRestaurantOut])
def get_foods(
    cuisine: Optional[str] = None,
    food_type: Optional[str] = None,
    category: Optional[str] = None,
    max_price: Optional[float] = None,
    min_rating: Optional[float] = None,
    skip: int = 0,
    limit: int = 50,
    db: Session = Depends(get_db)
):
    query = db.query(FoodItem).join(Restaurant)

    if cuisine:
        query = query.filter(FoodItem.cuisine.ilike(f"%{cuisine}%"))
    if food_type:
        query = query.filter(FoodItem.food_type.ilike(f"%{food_type}%"))
    if category:
        query = query.filter(FoodItem.category.ilike(f"%{category}%"))
    if max_price is not None:
        query = query.filter(FoodItem.price <= max_price)
    if min_rating is not None:
        query = query.filter(FoodItem.rating >= min_rating)

    foods = query.offset(skip).limit(limit).all()
    return foods


@router.get("/{id}")
def get_food_details(
    id: int,
    current_user: Optional[User] = Depends(get_optional_current_user),
    db: Session = Depends(get_db)
):
    food = db.query(FoodItem).filter(FoodItem.id == id).first()
    if not food:
        raise HTTPException(status_code=404, detail="Food item not found")

    pref = None
    if current_user:
        pref = db.query(UserPreferences).filter(UserPreferences.user_id == current_user.id).first()

    # Calculate match info for this specific item
    score_data = calculate_food_score(
        food=food,
        pref=pref,
        favorited_categories=set(),
        high_rated_categories=set(),
        low_rated_categories=set(),
        not_interested_food_ids=set(),
        not_interested_categories=set()
    )

    # Get similar foods from same restaurant or cuisine
    similar_foods = (
        db.query(FoodItem)
        .filter(FoodItem.id != food.id)
        .filter((FoodItem.cuisine == food.cuisine) | (FoodItem.category == food.category))
        .limit(4)
        .all()
    )

    return {
        "food": food,
        "restaurant": food.restaurant,
        "match_score": score_data["score"],
        "match_percentage": score_data["percentage"],
        "reasons": score_data["reasons"],
        "reason_summary": score_data["reason_summary"],
        "score_breakdown": score_data["breakdown"],
        "similar_foods": similar_foods,
    }
