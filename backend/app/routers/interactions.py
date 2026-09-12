from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from ..database import get_db
from ..models import UserInteraction, FoodItem, User
from ..schemas import InteractionCreate, InteractionOut
from ..utils.security import get_current_user

router = APIRouter(prefix="/api/interactions", tags=["Interactions"])


@router.post("", response_model=InteractionOut)
def record_interaction(
    data: InteractionCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    food = db.query(FoodItem).filter(FoodItem.id == data.food_item_id).first()
    if not food:
        raise HTTPException(status_code=404, detail="Food item not found")

    interaction = UserInteraction(
        user_id=current_user.id,
        food_item_id=data.food_item_id,
        interaction_type=data.interaction_type
    )
    db.add(interaction)
    db.commit()
    db.refresh(interaction)
    return interaction
