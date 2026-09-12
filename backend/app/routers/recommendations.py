from typing import List, Optional
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from ..database import get_db
from ..models import User
from ..schemas import RecommendationOut
from ..utils.security import get_optional_current_user
from ..services.recommendation_engine import get_recommendations_for_user

router = APIRouter(prefix="/api/recommendations", tags=["Recommendations"])


@router.get("", response_model=List[RecommendationOut])
def get_recommendations(
    limit: int = 15,
    category: Optional[str] = None,
    current_user: Optional[User] = Depends(get_optional_current_user),
    db: Session = Depends(get_db)
):
    user_id = current_user.id if current_user else None
    return get_recommendations_for_user(
        db=db,
        user_id=user_id,
        limit=limit,
        category_filter=category
    )


@router.get("/best-match", response_model=List[RecommendationOut])
def get_best_matches(
    limit: int = 8,
    current_user: Optional[User] = Depends(get_optional_current_user),
    db: Session = Depends(get_db)
):
    user_id = current_user.id if current_user else None
    results = get_recommendations_for_user(
        db=db,
        user_id=user_id,
        limit=limit
    )
    # Filter for items with high match percentage
    return [r for r in results if r["match_percentage"] >= 70][:limit] or results[:limit]


@router.get("/popular", response_model=List[RecommendationOut])
def get_popular_recommendations(
    limit: int = 8,
    current_user: Optional[User] = Depends(get_optional_current_user),
    db: Session = Depends(get_db)
):
    user_id = current_user.id if current_user else None
    return get_recommendations_for_user(
        db=db,
        user_id=user_id,
        limit=limit,
        min_rating=4.5
    )


@router.get("/budget", response_model=List[RecommendationOut])
def get_budget_recommendations(
    limit: int = 8,
    current_user: Optional[User] = Depends(get_optional_current_user),
    db: Session = Depends(get_db)
):
    user_id = current_user.id if current_user else None
    return get_recommendations_for_user(
        db=db,
        user_id=user_id,
        limit=limit,
        budget_only=True
    )


@router.get("/try-new", response_model=List[RecommendationOut])
def get_try_new_recommendations(
    limit: int = 8,
    current_user: Optional[User] = Depends(get_optional_current_user),
    db: Session = Depends(get_db)
):
    user_id = current_user.id if current_user else None
    return get_recommendations_for_user(
        db=db,
        user_id=user_id,
        limit=limit,
        try_new=True
    )
