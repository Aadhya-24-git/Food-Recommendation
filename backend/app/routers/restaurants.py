from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from ..database import get_db
from ..models import Restaurant, FoodItem
from ..schemas import RestaurantOut, RestaurantWithFoodsOut

router = APIRouter(prefix="/api/restaurants", tags=["Restaurants"])


@router.get("", response_model=List[RestaurantOut])
def get_restaurants(
    skip: int = 0,
    limit: int = 50,
    cuisine: Optional[str] = None,
    db: Session = Depends(get_db)
):
    query = db.query(Restaurant)
    if cuisine:
        query = query.join(FoodItem).filter(FoodItem.cuisine.ilike(f"%{cuisine}%")).distinct()
    return query.offset(skip).limit(limit).all()


@router.get("/{id}", response_model=RestaurantWithFoodsOut)
def get_restaurant_by_id(id: int, db: Session = Depends(get_db)):
    restaurant = db.query(Restaurant).filter(Restaurant.id == id).first()
    if not restaurant:
        raise HTTPException(status_code=404, detail="Restaurant not found")
    return restaurant
