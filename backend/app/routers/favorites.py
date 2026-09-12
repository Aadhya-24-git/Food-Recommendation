from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from ..database import get_db
from ..models import Favorite, FoodItem, User, UserInteraction
from ..schemas import FavoriteOut
from ..utils.security import get_current_user

router = APIRouter(prefix="/api/favorites", tags=["Favorites"])


@router.get("", response_model=List[FavoriteOut])
def get_favorites(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    favs = (
        db.query(Favorite)
        .filter(Favorite.user_id == current_user.id)
        .order_by(Favorite.created_at.desc())
        .all()
    )
    return favs


@router.post("/{food_id}")
def add_favorite(food_id: int, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    food = db.query(FoodItem).filter(FoodItem.id == food_id).first()
    if not food:
        raise HTTPException(status_code=404, detail="Food item not found")

    existing = (
        db.query(Favorite)
        .filter(Favorite.user_id == current_user.id, Favorite.food_item_id == food_id)
        .first()
    )
    if existing:
        return {"message": "Already favorited", "id": existing.id}

    fav = Favorite(user_id=current_user.id, food_item_id=food_id)
    db.add(fav)

    # Log interaction
    interaction = UserInteraction(
        user_id=current_user.id,
        food_item_id=food_id,
        interaction_type="favorite"
    )
    db.add(interaction)
    db.commit()
    db.refresh(fav)

    return {"message": "Added to favorites", "id": fav.id}


@router.delete("/{food_id}")
def remove_favorite(food_id: int, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    fav = (
        db.query(Favorite)
        .filter(Favorite.user_id == current_user.id, Favorite.food_item_id == food_id)
        .first()
    )
    if not fav:
        raise HTTPException(status_code=404, detail="Favorite not found")

    db.delete(fav)
    db.commit()
    return {"message": "Removed from favorites"}
