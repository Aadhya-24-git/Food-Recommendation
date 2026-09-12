from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import Dict, Any

from ..database import get_db
from ..models import User, UserPreferences
from ..schemas import UserPreferencesOut, UserPreferencesUpdate
from ..utils.security import get_current_user

router = APIRouter(prefix="/api/preferences", tags=["Preferences"])


@router.get("", response_model=UserPreferencesOut)
def get_preferences(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    pref = db.query(UserPreferences).filter(UserPreferences.user_id == current_user.id).first()
    if not pref:
        # Create default if missing
        pref = UserPreferences(
            user_id=current_user.id,
            preferred_cuisine="South Indian",
            food_type="Vegetarian",
            spice_level="Medium",
            budget_range="₹150–₹300",
            favorite_categories="Dosa, Biryani",
            dietary_preference="No restrictions"
        )
        db.add(pref)
        db.commit()
        db.refresh(pref)
    return pref


@router.put("", response_model=UserPreferencesOut)
def update_preferences(
    pref_update: UserPreferencesUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    pref = db.query(UserPreferences).filter(UserPreferences.user_id == current_user.id).first()
    if not pref:
        pref = UserPreferences(user_id=current_user.id)
        db.add(pref)

    update_data = pref_update.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(pref, key, value)

    db.commit()
    db.refresh(pref)
    return pref
