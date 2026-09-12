from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import func

from ..database import get_db
from ..models import User, Restaurant, FoodItem, Rating, Favorite
from ..schemas import (
    FoodItemCreate, FoodItemUpdate, FoodItemOut,
    RestaurantCreate, RestaurantUpdate, RestaurantOut,
    UserOut
)
from ..utils.security import get_current_admin

router = APIRouter(prefix="/api/admin", tags=["Admin Dashboard"])


@router.get("/dashboard")
def get_admin_dashboard_stats(
    admin: User = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    total_users = db.query(User).count()
    total_restaurants = db.query(Restaurant).count()
    total_foods = db.query(FoodItem).count()
    total_ratings = db.query(Rating).count()
    total_favorites = db.query(Favorite).count()

    # Most popular food (most favorited or rated)
    top_food_row = (
        db.query(FoodItem.name, func.count(Favorite.id).label("fav_count"))
        .outerjoin(Favorite, FoodItem.id == Favorite.food_item_id)
        .group_by(FoodItem.id)
        .order_by(func.count(Favorite.id).desc())
        .first()
    )
    most_popular_food = top_food_row[0] if top_food_row else "Masala Dosa"

    # Most popular cuisine
    top_cuisine_row = (
        db.query(FoodItem.cuisine, func.count(FoodItem.id))
        .group_by(FoodItem.cuisine)
        .order_by(func.count(FoodItem.id).desc())
        .first()
    )
    most_popular_cuisine = top_cuisine_row[0] if top_cuisine_row else "South Indian"

    # List of recent users
    users = db.query(User).order_by(User.created_at.desc()).limit(20).all()

    return {
        "stats": {
            "total_users": total_users,
            "total_restaurants": total_restaurants,
            "total_foods": total_foods,
            "total_ratings": total_ratings,
            "total_favorites": total_favorites,
            "most_popular_food": most_popular_food,
            "most_popular_cuisine": most_popular_cuisine,
        },
        "users": [
            {
                "id": u.id,
                "name": u.name,
                "email": u.email,
                "is_admin": u.is_admin,
                "created_at": u.created_at
            }
            for u in users
        ]
    }


# --- Manage Foods ---
@router.post("/foods", response_model=FoodItemOut, status_code=status.HTTP_201_CREATED)
def create_food(
    food_data: FoodItemCreate,
    admin: User = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    new_food = FoodItem(**food_data.model_dump())
    db.add(new_food)
    db.commit()
    db.refresh(new_food)
    return new_food


@router.put("/foods/{id}", response_model=FoodItemOut)
def update_food(
    id: int,
    food_data: FoodItemUpdate,
    admin: User = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    food = db.query(FoodItem).filter(FoodItem.id == id).first()
    if not food:
        raise HTTPException(status_code=404, detail="Food item not found")

    for key, val in food_data.model_dump(exclude_unset=True).items():
        setattr(food, key, val)

    db.commit()
    db.refresh(food)
    return food


@router.delete("/foods/{id}")
def delete_food(
    id: int,
    admin: User = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    food = db.query(FoodItem).filter(FoodItem.id == id).first()
    if not food:
        raise HTTPException(status_code=404, detail="Food item not found")

    db.delete(food)
    db.commit()
    return {"message": f"Food '{food.name}' deleted successfully"}


# --- Manage Restaurants ---
@router.post("/restaurants", response_model=RestaurantOut, status_code=status.HTTP_201_CREATED)
def create_restaurant(
    rest_data: RestaurantCreate,
    admin: User = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    new_rest = Restaurant(**rest_data.model_dump())
    db.add(new_rest)
    db.commit()
    db.refresh(new_rest)
    return new_rest


@router.put("/restaurants/{id}", response_model=RestaurantOut)
def update_restaurant(
    id: int,
    rest_data: RestaurantUpdate,
    admin: User = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    rest = db.query(Restaurant).filter(Restaurant.id == id).first()
    if not rest:
        raise HTTPException(status_code=404, detail="Restaurant not found")

    for key, val in rest_data.model_dump(exclude_unset=True).items():
        setattr(rest, key, val)

    db.commit()
    db.refresh(rest)
    return rest


@router.delete("/restaurants/{id}")
def delete_restaurant(
    id: int,
    admin: User = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    rest = db.query(Restaurant).filter(Restaurant.id == id).first()
    if not rest:
        raise HTTPException(status_code=404, detail="Restaurant not found")

    db.delete(rest)
    db.commit()
    return {"message": f"Restaurant '{rest.name}' deleted successfully"}
