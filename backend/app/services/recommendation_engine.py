from typing import List, Dict, Any, Optional
from sqlalchemy.orm import Session
from sqlalchemy import desc

from ..models import (
    FoodItem,
    UserPreferences,
    Favorite,
    Rating,
    UserInteraction,
    Restaurant,
)


def calculate_food_score(
    food: FoodItem,
    pref: Optional[UserPreferences],
    favorited_categories: set,
    high_rated_categories: set,
    low_rated_categories: set,
    not_interested_food_ids: set,
    not_interested_categories: set,
) -> Dict[str, Any]:
    """
    Pure Rule-Based / Weighted Scoring Recommendation Algorithm.
    Calculates transparent points based on:
    - Cuisine match (+30)
    - Food Type match (+25)
    - Favorite Category match (+20)
    - Spice Preference match (+10)
    - Budget Range match (+10)
    - Food Rating score (+5 / +3)
    - User History boost/penalty (+10 favorited category, +5 high rating, -10 low rating, -15 not interested)
    - Budget exceed penalty (-15)
    Total score is clamped between 0 and 100.
    """
    reasons = []
    breakdown = {}
    score = 0

    # Default baseline if user has no preferences set yet
    if not pref:
        base_score = 50
        if food.rating >= 4.5:
            base_score += 15
            reasons.append("Highly rated by our community.")
        elif food.rating >= 4.0:
            base_score += 10
            reasons.append("Well reviewed food item.")
        else:
            reasons.append("Popular recommendation.")
        
        return {
            "score": min(base_score, 100),
            "percentage": min(base_score, 100),
            "reasons": reasons,
            "reason_summary": " ".join(reasons),
            "breakdown": {"Base Score": base_score}
        }

    # 1. Cuisine Match (+30 points)
    preferred_cuisines = [c.strip().lower() for c in (pref.preferred_cuisine or "").split(",") if c.strip()]
    cuisine_match = False
    if food.cuisine.lower() in preferred_cuisines:
        score += 30
        cuisine_match = True
        breakdown["Cuisine Match"] = 30
        reasons.append(f"Matches your preferred {food.cuisine} cuisine.")
    else:
        breakdown["Cuisine Match"] = 0

    # 2. Food Type Match (+25 points)
    # Food type compatibility:
    pref_type = (pref.food_type or "").strip().lower()
    food_type = (food.food_type or "").strip().lower()

    type_match = False
    if pref_type == food_type:
        score += 25
        type_match = True
        breakdown["Food Type Match"] = 25
        reasons.append(f"Matches your {food.food_type} preference.")
    elif pref_type in ["non-vegetarian", "eggitarian"] and food_type in ["vegetarian", "vegan"]:
        # Non-vegetarians and eggitarians can eat veg/vegan
        score += 20
        type_match = True
        breakdown["Food Type Match"] = 20
        reasons.append(f"Compatible with your {pref.food_type} diet.")
    elif pref_type == "vegetarian" and food_type == "vegan":
        score += 25
        type_match = True
        breakdown["Food Type Match"] = 25
        reasons.append("100% plant-based vegetarian match.")
    elif pref_type == "vegetarian" and food_type == "non-vegetarian":
        # Significant mismatch for strict vegetarians
        score -= 20
        breakdown["Food Type Mismatch"] = -20
    else:
        breakdown["Food Type Match"] = 0

    # 3. Favorite Category Match (+20 points)
    fav_categories = [c.strip().lower() for c in (pref.favorite_categories or "").split(",") if c.strip()]
    category_match = False
    if food.category.lower() in fav_categories:
        score += 20
        category_match = True
        breakdown["Category Match"] = 20
        reasons.append(f"One of your favorite categories ({food.category}).")
    else:
        breakdown["Category Match"] = 0

    # 4. Spice Level Match (+10 points)
    pref_spice = (pref.spice_level or "Medium").strip().lower()
    food_spice = (food.spice_level or "Medium").strip().lower()

    if pref_spice == food_spice:
        score += 10
        breakdown["Spice Match"] = 10
        reasons.append(f"Matches your {food.spice_level} spice preference.")
    elif (pref_spice == "medium" and food_spice in ["mild", "spicy"]) or \
         (pref_spice == "spicy" and food_spice == "medium"):
        score += 5
        breakdown["Spice Match"] = 5
    else:
        breakdown["Spice Match"] = 0

    # 5. Budget Match (+10 points) & Budget Exceeded (-15 points)
    budget = pref.budget_range or "₹150–₹300"
    budget_match = False
    budget_exceeded = False

    if budget == "Under ₹150":
        if food.price <= 150:
            budget_match = True
        else:
            budget_exceeded = True
    elif budget == "₹150–₹300":
        if 150 <= food.price <= 300:
            budget_match = True
        elif food.price < 150:
            # Under budget is good too
            score += 8
            breakdown["Under Budget Bonus"] = 8
            reasons.append("Great value, well below your budget.")
        else:
            budget_exceeded = True
    elif budget == "₹300–₹500":
        if 300 <= food.price <= 500:
            budget_match = True
        elif food.price < 300:
            score += 8
            breakdown["Under Budget Bonus"] = 8
            reasons.append("Economical choice within budget.")
        else:
            budget_exceeded = True
    elif budget == "₹500+":
        if food.price >= 500:
            budget_match = True
        else:
            score += 8
            budget_match = True

    if budget_match:
        score += 10
        breakdown["Budget Match"] = 10
        reasons.append(f"Fits your budget ({budget}).")
    elif budget_exceeded:
        score -= 15
        breakdown["Exceeds Budget Penalty"] = -15

    # 6. Rating Logic (+5 / +3 points)
    if food.rating >= 4.5:
        score += 5
        breakdown["High Rating"] = 5
        reasons.append("Highly rated by users (★ 4.5+).")
    elif food.rating >= 4.0:
        score += 3
        breakdown["Good Rating"] = 3
        reasons.append("Consistently positive user ratings.")

    # 7. User History Boosts & Penalties
    food_cat_lower = food.category.lower()

    if food_cat_lower in favorited_categories:
        score += 10
        breakdown["Favorited Category History"] = 10
        reasons.append(f"You previously favorited {food.category} items.")

    if food_cat_lower in high_rated_categories:
        score += 5
        breakdown["High Rated Category History"] = 5
        reasons.append("Similar to items you rated 4★ or 5★.")

    if food_cat_lower in low_rated_categories:
        score -= 10
        breakdown["Low Rated Category History"] = -10

    # 8. Not Interested Penalty
    if food.id in not_interested_food_ids:
        score -= 35
        breakdown["Not Interested Food Penalty"] = -35
    elif food_cat_lower in not_interested_categories:
        score -= 15
        breakdown["Not Interested Category Penalty"] = -15

    # Dietary restriction check
    diet = (pref.dietary_preference or "No restrictions").strip().lower()
    if "high protein" in diet and food.protein and food.protein >= 18:
        score += 5
        breakdown["High Protein Match"] = 5
        reasons.append(f"High protein option ({food.protein}g protein).")
    elif "low calorie" in diet and food.calories and food.calories <= 350:
        score += 5
        breakdown["Low Calorie Match"] = 5
        reasons.append(f"Low calorie meal ({food.calories} kcal).")

    # Clamping final score between 0 and 100
    final_score = max(0, min(100, score))
    
    # If no reasons were added, provide a default friendly note
    if not reasons:
        reasons.append("Popular recommendation based on menu diversity.")

    summary = " ".join(reasons[:3])  # Top 3 concise reasons for UI display

    return {
        "score": final_score,
        "percentage": int(final_score),
        "reasons": reasons,
        "reason_summary": summary,
        "breakdown": breakdown
    }


def get_recommendations_for_user(
    db: Session,
    user_id: Optional[int] = None,
    limit: int = 20,
    category_filter: Optional[str] = None,
    cuisine_filter: Optional[str] = None,
    budget_only: bool = False,
    try_new: bool = False,
    min_rating: Optional[float] = None,
) -> List[Dict[str, Any]]:
    """
    Main recommendation engine function.
    Queries user preferences, user interaction history, and scores all food items.
    """
    # 1. Fetch user preferences if user_id is provided
    pref: Optional[UserPreferences] = None
    favorited_categories = set()
    high_rated_categories = set()
    low_rated_categories = set()
    not_interested_food_ids = set()
    not_interested_categories = set()
    favorited_food_ids = set()

    if user_id:
        pref = db.query(UserPreferences).filter(UserPreferences.user_id == user_id).first()

        # Previous favorites
        favs = (
            db.query(Favorite, FoodItem)
            .join(FoodItem, Favorite.food_item_id == FoodItem.id)
            .filter(Favorite.user_id == user_id)
            .all()
        )
        for fav, f_item in favs:
            favorited_categories.add(f_item.category.lower())
            favorited_food_ids.add(f_item.id)

        # Previous ratings
        ratings = (
            db.query(Rating, FoodItem)
            .join(FoodItem, Rating.food_item_id == FoodItem.id)
            .filter(Rating.user_id == user_id)
            .all()
        )
        for r, f_item in ratings:
            if r.rating >= 4.0:
                high_rated_categories.add(f_item.category.lower())
            elif r.rating <= 2.0:
                low_rated_categories.add(f_item.category.lower())

        # Not Interested interactions
        interactions = (
            db.query(UserInteraction, FoodItem)
            .join(FoodItem, UserInteraction.food_item_id == FoodItem.id)
            .filter(
                UserInteraction.user_id == user_id,
                UserInteraction.interaction_type == "not_interested"
            )
            .all()
        )
        for inter, f_item in interactions:
            not_interested_food_ids.add(f_item.id)
            not_interested_categories.add(f_item.category.lower())

    # 2. Query available food items with joined restaurant
    query = db.query(FoodItem).join(Restaurant)

    if category_filter:
        query = query.filter(FoodItem.category.ilike(f"%{category_filter}%"))
    if cuisine_filter:
        query = query.filter(FoodItem.cuisine.ilike(f"%{cuisine_filter}%"))
    if min_rating:
        query = query.filter(FoodItem.rating >= min_rating)

    all_foods = query.all()

    # 3. Score every item
    scored_items = []
    for food in all_foods:
        # If "try_new" mode, favor cuisines/categories different from user's primary preference
        res = calculate_food_score(
            food=food,
            pref=pref,
            favorited_categories=favorited_categories,
            high_rated_categories=high_rated_categories,
            low_rated_categories=low_rated_categories,
            not_interested_food_ids=not_interested_food_ids,
            not_interested_categories=not_interested_categories,
        )

        if try_new and pref:
            # In "Try Something New", we highlight high-quality foods outside their primary cuisine
            pref_cuisines = [c.strip().lower() for c in (pref.preferred_cuisine or "").split(",")]
            if food.cuisine.lower() not in pref_cuisines and food.rating >= 4.3:
                res["percentage"] = min(98, res["percentage"] + 25)
                res["reasons"].insert(0, f"Try something new: Top-rated {food.cuisine} specialty!")
                res["reason_summary"] = " ".join(res["reasons"][:3])

        if budget_only and pref:
            # Filter strictly under budget
            budget = pref.budget_range or "₹150–₹300"
            max_limit = 300
            if "150" in budget and "300" not in budget:
                max_limit = 150
            elif "300–₹500" in budget:
                max_limit = 500
            if food.price > max_limit:
                continue

        scored_items.append({
            "food": food,
            "match_score": res["score"],
            "match_percentage": res["percentage"],
            "reason": res["reason_summary"],
            "score_breakdown": res["breakdown"],
            "is_favorite": food.id in favorited_food_ids,
        })

    # 4. Sort foods by score descending, then by food rating descending
    scored_items.sort(key=lambda item: (item["match_percentage"], item["food"].rating), reverse=True)

    return scored_items[:limit]
