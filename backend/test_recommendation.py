import sys
import os

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8")

from app.database import SessionLocal
from app.models import User
from app.services.recommendation_engine import get_recommendations_for_user


def test_recommendation_algorithm():
    db = SessionLocal()
    try:
        # Find demo user Rahul Sharma
        user = db.query(User).filter(User.email == "user@foodieai.com").first()
        assert user is not None, "Demo user not found"
        print(f"Testing recommendations for user: {user.name} ({user.email})")
        print(f"User Preferences: Cuisine={user.preferences.preferred_cuisine}, Type={user.preferences.food_type}, Spice={user.preferences.spice_level}, Budget={user.preferences.budget_range}, Favs={user.preferences.favorite_categories}")

        recommendations = get_recommendations_for_user(db=db, user_id=user.id, limit=10)
        assert len(recommendations) > 0, "No recommendations returned"

        print("\nTop 5 Recommendations:")
        for idx, rec in enumerate(recommendations[:5], 1):
            food = rec["food"]
            print(f"{idx}. {food.name} ({food.cuisine}, {food.food_type}, ₹{food.price}) - {rec['match_percentage']}% Match")
            print(f"   Reason: {rec['reason']}")
            print(f"   Breakdown: {rec['score_breakdown']}")

        # Verification check: Masala Dosa should rank higher than Chicken Biryani
        dosa_rank = None
        biryani_rank = None

        for idx, rec in enumerate(recommendations):
            name_lower = rec["food"].name.lower()
            if "masala dosa" in name_lower and dosa_rank is None:
                dosa_rank = idx
            if "chicken biryani" in name_lower and biryani_rank is None:
                biryani_rank = idx

        print(f"\nVerification Results:")
        print(f"Masala Dosa Rank: {dosa_rank if dosa_rank is not None else 'Top'} (Score: {[r['match_percentage'] for r in recommendations if 'masala dosa' in r['food'].name.lower()][0]}%)")
        
        chicken_biryani_scores = [r['match_percentage'] for r in recommendations if 'chicken biryani' in r['food'].name.lower()]
        if chicken_biryani_scores:
            print(f"Chicken Biryani Rank: {biryani_rank} (Score: {chicken_biryani_scores[0]}%)")
            assert [r['match_percentage'] for r in recommendations if 'masala dosa' in r['food'].name.lower()][0] > chicken_biryani_scores[0], "Masala Dosa should score higher than Chicken Biryani"
            print("SUCCESS: Masala Dosa scored higher than Chicken Biryani!")
        else:
            print("Chicken Biryani ranked outside top 10 due to Vegetarian filter penalty. SUCCESS!")

        print("\nAll recommendation engine assertions passed successfully!")

    finally:
        db.close()


if __name__ == "__main__":
    test_recommendation_algorithm()
