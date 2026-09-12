from typing import List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import func

from ..database import get_db
from ..models import Rating, FoodItem, Restaurant, User, UserInteraction
from ..schemas import RatingCreate, RatingOut
from ..utils.security import get_current_user

router = APIRouter(prefix="/api/ratings", tags=["Ratings"])


@router.post("", response_model=RatingOut)
def add_or_update_rating(
    rating_data: RatingCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    food = db.query(FoodItem).filter(FoodItem.id == rating_data.food_item_id).first()
    if not food:
        raise HTTPException(status_code=404, detail="Food item not found")

    existing = (
        db.query(Rating)
        .filter(Rating.user_id == current_user.id, Rating.food_item_id == rating_data.food_item_id)
        .first()
    )

    if existing:
        existing.rating = rating_data.rating
        existing.review = rating_data.review
        db.commit()
        db.refresh(existing)
        target_rating = existing
    else:
        new_rating = Rating(
            user_id=current_user.id,
            food_item_id=rating_data.food_item_id,
            rating=rating_data.rating,
            review=rating_data.review
        )
        db.add(new_rating)
        db.commit()
        db.refresh(new_rating)
        target_rating = new_rating

    # Recalculate average food rating
    avg_food = db.query(func.avg(Rating.rating)).filter(Rating.food_item_id == food.id).scalar()
    if avg_food:
        food.rating = round(float(avg_food), 1)

    # Recalculate restaurant rating
    avg_rest = (
        db.query(func.avg(FoodItem.rating))
        .filter(FoodItem.restaurant_id == food.restaurant_id)
        .scalar()
    )
    if avg_rest:
        rest = db.query(Restaurant).filter(Restaurant.id == food.restaurant_id).first()
        if rest:
            rest.rating = round(float(avg_rest), 1)

    # Log interaction
    interaction = UserInteraction(
        user_id=current_user.id,
        food_item_id=food.id,
        interaction_type="rating"
    )
    db.add(interaction)
    db.commit()

    return {
        "id": target_rating.id,
        "user_id": target_rating.user_id,
        "food_item_id": target_rating.food_item_id,
        "rating": target_rating.rating,
        "review": target_rating.review,
        "created_at": target_rating.created_at,
        "user_name": current_user.name
    }


@router.get("/food/{food_id}", response_model=List[RatingOut])
def get_food_ratings(food_id: int, db: Session = Depends(get_db)):
    ratings = (
        db.query(Rating, User.name)
        .join(User, Rating.user_id == User.id)
        .filter(Rating.food_item_id == food_id)
        .order_by(Rating.created_at.desc())
        .all()
    )
    results = []
    for r, user_name in ratings:
        results.append({
            "id": r.id,
            "user_id": r.user_id,
            "food_item_id": r.food_item_id,
            "rating": r.rating,
            "review": r.review,
            "created_at": r.created_at,
            "user_name": user_name
        })
    return results
