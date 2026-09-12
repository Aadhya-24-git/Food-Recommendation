from typing import List, Optional
from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from sqlalchemy import or_

from ..database import get_db
from ..models import FoodItem, Restaurant, SearchHistory, User
from ..schemas import FoodItemWithRestaurantOut, SearchHistoryOut
from ..utils.security import get_optional_current_user

router = APIRouter(prefix="/api/search", tags=["Search"])


@router.get("", response_model=List[FoodItemWithRestaurantOut])
def search_foods(
    q: Optional[str] = Query(None, description="Search term for food, restaurant, cuisine, or category"),
    cuisine: Optional[str] = None,
    food_type: Optional[str] = None,
    spice_level: Optional[str] = None,
    max_price: Optional[float] = None,
    min_rating: Optional[float] = None,
    current_user: Optional[User] = Depends(get_optional_current_user),
    db: Session = Depends(get_db)
):
    query = db.query(FoodItem).join(Restaurant)

    if q and q.strip():
        search_term = f"%{q.strip()}%"
        query = query.filter(
            or_(
                FoodItem.name.ilike(search_term),
                FoodItem.description.ilike(search_term),
                FoodItem.category.ilike(search_term),
                FoodItem.cuisine.ilike(search_term),
                Restaurant.name.ilike(search_term)
            )
        )

        # Save to search history if authenticated
        if current_user:
            hist = SearchHistory(user_id=current_user.id, search_query=q.strip())
            db.add(hist)
            db.commit()

    if cuisine:
        query = query.filter(FoodItem.cuisine.ilike(f"%{cuisine}%"))
    if food_type:
        query = query.filter(FoodItem.food_type.ilike(f"%{food_type}%"))
    if spice_level:
        query = query.filter(FoodItem.spice_level.ilike(f"%{spice_level}%"))
    if max_price is not None:
        query = query.filter(FoodItem.price <= max_price)
    if min_rating is not None:
        query = query.filter(FoodItem.rating >= min_rating)

    return query.limit(50).all()


@router.get("/history", response_model=List[SearchHistoryOut])
def get_search_history(
    current_user: Optional[User] = Depends(get_optional_current_user),
    db: Session = Depends(get_db)
):
    if not current_user:
        return []
    history = (
        db.query(SearchHistory)
        .filter(SearchHistory.user_id == current_user.id)
        .order_by(SearchHistory.created_at.desc())
        .limit(10)
        .all()
    )
    return history
