import sys
import os

# Ensure backend root is on sys.path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from app.database import engine, SessionLocal, Base
from app.models import (
    User, UserPreferences, Restaurant, FoodItem, Rating, Favorite, UserInteraction
)
from app.utils.security import get_password_hash


def seed_database():
    print("Initializing database tables...")
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()

    try:
        # Check if already seeded
        if db.query(Restaurant).count() >= 20 and db.query(FoodItem).count() >= 100:
            print("Database already contains >= 20 restaurants and >= 100 food items. Skipping seed.")
            return

        print("Clearing existing data for a fresh seed...")
        db.query(UserInteraction).delete()
        db.query(Rating).delete()
        db.query(Favorite).delete()
        db.query(FoodItem).delete()
        db.query(Restaurant).delete()
        db.query(UserPreferences).delete()
        db.query(User).delete()
        db.commit()

        print("Creating demo users...")
        # 1. Admin User
        admin_user = User(
            name="Admin Officer",
            email="admin@foodieai.com",
            password_hash=get_password_hash("admin123"),
            is_admin=True
        )
        db.add(admin_user)

        # 2. Demo Student User
        demo_user = User(
            name="Rahul Sharma",
            email="user@foodieai.com",
            password_hash=get_password_hash("password123"),
            is_admin=False
        )
        db.add(demo_user)
        db.commit()
        db.refresh(demo_user)
        db.refresh(admin_user)

        # Demo user preferences (Matches college viva example: South Indian, Vegetarian, Medium, ₹150–₹300, Dosa)
        demo_pref = UserPreferences(
            user_id=demo_user.id,
            preferred_cuisine="South Indian, North Indian",
            food_type="Vegetarian",
            spice_level="Medium",
            budget_range="₹150–₹300",
            favorite_categories="Dosa, Biryani, Paneer",
            dietary_preference="No restrictions"
        )
        db.add(demo_pref)
        db.commit()

        print("Creating 20 restaurants...")
        restaurants_data = [
            {
                "name": "Dosa Corner & Tiffins",
                "description": "Authentic crispy South Indian dosas, idlis, and traditional filter coffee made with heritage recipes.",
                "location": "Indiranagar, Bengaluru",
                "rating": 4.7,
                "price_range": "₹",
                "image_url": "https://images.unsplash.com/photo-1668236543090-82eba5ee5976?w=600&auto=format&fit=crop&q=80"
            },
            {
                "name": "Punjab Heritage Rasoi",
                "description": "Rich North Indian curries, buttery naans, and smoky clay oven tandoori delicacies.",
                "location": "Connaught Place, New Delhi",
                "rating": 4.6,
                "price_range": "₹₹",
                "image_url": "https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=600&auto=format&fit=crop&q=80"
            },
            {
                "name": "The Great Biryani House",
                "description": "Slow-cooked Hyderabadi and Lucknowi dum biryanis layered with fragrant basmati and aromatic spices.",
                "location": "Banjara Hills, Hyderabad",
                "rating": 4.8,
                "price_range": "₹₹",
                "image_url": "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=600&auto=format&fit=crop&q=80"
            },
            {
                "name": "The Golden Wok",
                "description": "Indo-Chinese street food, wok-tossed noodles, and fiery schezwan delicacies.",
                "location": "Park Street, Kolkata",
                "rating": 4.4,
                "price_range": "₹₹",
                "image_url": "https://images.unsplash.com/photo-1541696432-82c6da8ce7bf?w=600&auto=format&fit=crop&q=80"
            },
            {
                "name": "Bella Cucina Trattoria",
                "description": "Wood-fired artisanal pizzas, freshly made pastas, and authentic Italian tiramisu.",
                "location": "Koregaon Park, Pune",
                "rating": 4.5,
                "price_range": "₹₹₹",
                "image_url": "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=600&auto=format&fit=crop&q=80"
            },
            {
                "name": "Taco Fiesta Mexican Cantina",
                "description": "Sizzling fajitas, stuffed burritos, cheesy quesadillas, and house-made guacamole.",
                "location": "Bandra West, Mumbai",
                "rating": 4.3,
                "price_range": "₹₹",
                "image_url": "https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=600&auto=format&fit=crop&q=80"
            },
            {
                "name": "Seoul Spoon Korean BBQ",
                "description": "Korean street food, crispy fried chicken, warm dolsot bibimbap, and spicy tteokbokki.",
                "location": "Koramangala, Bengaluru",
                "rating": 4.5,
                "price_range": "₹₹",
                "image_url": "https://images.unsplash.com/photo-1498654896293-37aacf113fd9?w=600&auto=format&fit=crop&q=80"
            },
            {
                "name": "Tokyo Bowl & Ramen Bar",
                "description": "Rich umami broths, fresh ramen noodles, crispy tempura, and teriyaki rice bowls.",
                "location": "Jubilee Hills, Hyderabad",
                "rating": 4.6,
                "price_range": "₹₹₹",
                "image_url": "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=600&auto=format&fit=crop&q=80"
            },
            {
                "name": "Al-Madina Mandi & Grill",
                "description": "Traditional Arabian platters, smoked mutton mandi, chicken shawarma, and fresh mezze.",
                "location": "Mehdipatnam, Hyderabad",
                "rating": 4.5,
                "price_range": "₹₹",
                "image_url": "https://images.unsplash.com/photo-1544025162-d76694265947?w=600&auto=format&fit=crop&q=80"
            },
            {
                "name": "Burger Foundry",
                "description": "Gourmet smash burgers, brioche buns, melted cheddar, and seasoned crinkle cut fries.",
                "location": "HSR Layout, Bengaluru",
                "rating": 4.4,
                "price_range": "₹₹",
                "image_url": "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600&auto=format&fit=crop&q=80"
            },
            {
                "name": "Sweet Tooth Confectionery",
                "description": "Decadent cheesecakes, chocolate lava cakes, waffle towers, and handcrafted milkshakes.",
                "location": "Bandra, Mumbai",
                "rating": 4.8,
                "price_range": "₹₹",
                "image_url": "https://images.unsplash.com/photo-1551024709-8f23befc6f87?w=600&auto=format&fit=crop&q=80"
            },
            {
                "name": "Madras Cafe Express",
                "description": "Homestyle tiffin, crispy vadas, ghee podi idlis, and South Indian filter coffee.",
                "location": "T. Nagar, Chennai",
                "rating": 4.6,
                "price_range": "₹",
                "image_url": "https://images.unsplash.com/photo-1630383249896-424e482df921?w=600&auto=format&fit=crop&q=80"
            },
            {
                "name": "Delhi Chaat & Street Rolls",
                "description": "Tangy pani puri, crisp aloo tikki chaat, kathi rolls, and North Indian street treats.",
                "location": "Lajpat Nagar, New Delhi",
                "rating": 4.3,
                "price_range": "₹",
                "image_url": "https://images.unsplash.com/photo-1601050690597-df0568f70950?w=600&auto=format&fit=crop&q=80"
            },
            {
                "name": "Spice Symphony",
                "description": "Exquisite Mughlai gravies, creamy paneer tikka, and slow-braised curries.",
                "location": "Sector 29, Gurgaon",
                "rating": 4.5,
                "price_range": "₹₹₹",
                "image_url": "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=600&auto=format&fit=crop&q=80"
            },
            {
                "name": "Dragon Express",
                "description": "Speedy Chinese comfort foods, hot garlic noodles, steamed dim sum, and crispy wontons.",
                "location": "Salt Lake, Kolkata",
                "rating": 4.2,
                "price_range": "₹",
                "image_url": "https://images.unsplash.com/photo-1525755662778-989d0524087e?w=600&auto=format&fit=crop&q=80"
            },
            {
                "name": "Napoli Woodfire Pizzeria",
                "description": "Naples-style thin crust pizzas baked in 500°C stone oven with San Marzano tomatoes.",
                "location": "Colaba, Mumbai",
                "rating": 4.7,
                "price_range": "₹₹₹",
                "image_url": "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=600&auto=format&fit=crop&q=80"
            },
            {
                "name": "Beirut Shawarma & Falafel",
                "description": "Tender grilled meats, crunchy falafel wraps, garlic toum, and creamy tahini dips.",
                "location": "Fort, Mumbai",
                "rating": 4.4,
                "price_range": "₹₹",
                "image_url": "https://images.unsplash.com/photo-1561651823-34feb02250e4?w=600&auto=format&fit=crop&q=80"
            },
            {
                "name": "K-Town Crispy Wings",
                "description": "Double-fried crunchy chicken wings glazed in soy garlic, spicy gochujang, and honey butter.",
                "location": "Hauz Khas, New Delhi",
                "rating": 4.5,
                "price_range": "₹₹",
                "image_url": "https://images.unsplash.com/photo-1527477378408-1bc097a904d5?w=600&auto=format&fit=crop&q=80"
            },
            {
                "name": "Green Oasis Veggie Kitchen",
                "description": "100% vegetarian and vegan farm-to-table bowls, protein salads, and healthy smoothies.",
                "location": "Sadashivnagar, Bengaluru",
                "rating": 4.6,
                "price_range": "₹₹",
                "image_url": "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=600&auto=format&fit=crop&q=80"
            },
            {
                "name": "Cafe Creme & Waffles",
                "description": "Warm Belgian waffles, artisanal hot chocolates, gelato sundaes, and fresh crêpes.",
                "location": "Viman Nagar, Pune",
                "rating": 4.7,
                "price_range": "₹₹",
                "image_url": "https://images.unsplash.com/photo-1562376552-0d160a2f238d?w=600&auto=format&fit=crop&q=80"
            },
        ]

        restaurants = []
        for r_data in restaurants_data:
            rest = Restaurant(**r_data)
            db.add(rest)
            restaurants.append(rest)
        db.commit()

        # Refresh to have IDs
        for r in restaurants:
            db.refresh(r)

        r_map = {r.name: r.id for r in restaurants}

        print("Creating 100+ rich food items across cuisines...")
        foods_data = [
            # 1. Dosa Corner & Tiffins (South Indian)
            {
                "restaurant_id": r_map["Dosa Corner & Tiffins"],
                "name": "Classic Masala Dosa",
                "description": "Crisp golden fermented rice crepe filled with spiced tempered potato masala, served with coconut chutney and piping hot sambar.",
                "category": "Dosa",
                "cuisine": "South Indian",
                "food_type": "Vegetarian",
                "spice_level": "Medium",
                "price": 120.0,
                "calories": 340,
                "protein": 8.0,
                "rating": 4.8,
                "image_url": "https://images.unsplash.com/photo-1668236543090-82eba5ee5976?w=600&auto=format&fit=crop&q=80",
                "ingredients": "Rice batter, Potatoes, Mustard seeds, Curry leaves, Onions, Ghee, Chutney, Sambar"
            },
            {
                "restaurant_id": r_map["Dosa Corner & Tiffins"],
                "name": "Mysore Masala Dosa",
                "description": "Iconic Karnataka dosa smeared with spicy red garlic-chutney paste and stuffed with potato filling.",
                "category": "Dosa",
                "cuisine": "South Indian",
                "food_type": "Vegetarian",
                "spice_level": "Spicy",
                "price": 150.0,
                "calories": 390,
                "protein": 9.5,
                "rating": 4.9,
                "image_url": "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=600&auto=format&fit=crop&q=80",
                "ingredients": "Rice batter, Red chili paste, Garlic, Potato masala, Butter, Sambar"
            },
            {
                "restaurant_id": r_map["Dosa Corner & Tiffins"],
                "name": "Paneer Stuffed Dosa",
                "description": "Crispy crepe generously layered with seasoned cottage cheese, herbs, and mild capsicum.",
                "category": "Dosa",
                "cuisine": "South Indian",
                "food_type": "Vegetarian",
                "spice_level": "Medium",
                "price": 180.0,
                "calories": 420,
                "protein": 16.0,
                "rating": 4.6,
                "image_url": "https://images.unsplash.com/photo-1668236543090-82eba5ee5976?w=600&auto=format&fit=crop&q=80",
                "ingredients": "Paneer, Rice crepe, Green chili, Onion, Coriander, Coconut chutney"
            },
            {
                "restaurant_id": r_map["Dosa Corner & Tiffins"],
                "name": "Crispy Medu Vada (2 Pcs)",
                "description": "Golden fried lentil donuts with a crispy exterior and soft fluffy center, served with sambar and coconut dip.",
                "category": "Snacks",
                "cuisine": "South Indian",
                "food_type": "Vegetarian",
                "spice_level": "Mild",
                "price": 90.0,
                "calories": 280,
                "protein": 7.0,
                "rating": 4.5,
                "image_url": "https://images.unsplash.com/photo-1630383249896-424e482df921?w=600&auto=format&fit=crop&q=80",
                "ingredients": "Urad dal, Peppercorns, Curry leaves, Ginger, Coconut chutney"
            },
            {
                "restaurant_id": r_map["Dosa Corner & Tiffins"],
                "name": "Steamed Button Idlis (4 Pcs)",
                "description": "Soft, melt-in-mouth steamed rice cakes served submerged in aromatic vegetable lentil sambar.",
                "category": "Snacks",
                "cuisine": "South Indian",
                "food_type": "Vegan",
                "spice_level": "Mild",
                "price": 80.0,
                "calories": 210,
                "protein": 6.0,
                "rating": 4.6,
                "image_url": "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=600&auto=format&fit=crop&q=80",
                "ingredients": "Fermented rice, Urad dal, Vegetable sambar, Coconut chutney"
            },
            {
                "restaurant_id": r_map["Dosa Corner & Tiffins"],
                "name": "Onion Uttapam",
                "description": "Thick savory pancake topped with finely chopped onions, green chilies, and fresh coriander.",
                "category": "Dosa",
                "cuisine": "South Indian",
                "food_type": "Vegetarian",
                "spice_level": "Medium",
                "price": 130.0,
                "calories": 310,
                "protein": 7.5,
                "rating": 4.4,
                "image_url": "https://images.unsplash.com/photo-1668236543090-82eba5ee5976?w=600&auto=format&fit=crop&q=80",
                "ingredients": "Rice batter, Onions, Green chilies, Curry leaves, Sambar"
            },

            # 2. Punjab Heritage Rasoi (North Indian)
            {
                "restaurant_id": r_map["Punjab Heritage Rasoi"],
                "name": "Paneer Butter Masala",
                "description": "Succulent cubes of fresh cottage cheese simmered in a luscious tomato, butter, and cashew cream gravy.",
                "category": "Paneer",
                "cuisine": "North Indian",
                "food_type": "Vegetarian",
                "spice_level": "Medium",
                "price": 260.0,
                "calories": 480,
                "protein": 18.0,
                "rating": 4.8,
                "image_url": "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=600&auto=format&fit=crop&q=80",
                "ingredients": "Cottage cheese, Ripe tomatoes, Butter, Cashews, Cream, Kasuri methi"
            },
            {
                "restaurant_id": r_map["Punjab Heritage Rasoi"],
                "name": "Dal Makhani",
                "description": "Overnight slow-cooked black lentils and kidney beans simmered on coal with butter and dairy cream.",
                "category": "Paneer",
                "cuisine": "North Indian",
                "food_type": "Vegetarian",
                "spice_level": "Mild",
                "price": 220.0,
                "calories": 410,
                "protein": 14.0,
                "rating": 4.7,
                "image_url": "https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=600&auto=format&fit=crop&q=80",
                "ingredients": "Urad beans, Rajma, Butter, Fresh cream, Garlic, Ginger, Tomato puree"
            },
            {
                "restaurant_id": r_map["Punjab Heritage Rasoi"],
                "name": "Butter Garlic Naan (2 Pcs)",
                "description": "Tandoor baked leavened flatbread brushed with garlic butter and fresh coriander.",
                "category": "Snacks",
                "cuisine": "North Indian",
                "food_type": "Vegetarian",
                "spice_level": "Mild",
                "price": 90.0,
                "calories": 260,
                "protein": 6.5,
                "rating": 4.6,
                "image_url": "https://images.unsplash.com/photo-1601050690597-df0568f70950?w=600&auto=format&fit=crop&q=80",
                "ingredients": "Flour, Butter, Minced garlic, Coriander, Milk"
            },
            {
                "restaurant_id": r_map["Punjab Heritage Rasoi"],
                "name": "Amritsari Chole Bhature",
                "description": "Spicy dark chickpeas stewed in anardana and Punjabi spices paired with puffy golden bhature.",
                "category": "Snacks",
                "cuisine": "North Indian",
                "food_type": "Vegetarian",
                "spice_level": "Spicy",
                "price": 180.0,
                "calories": 620,
                "protein": 15.0,
                "rating": 4.7,
                "image_url": "https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?w=600&auto=format&fit=crop&q=80",
                "ingredients": "Chickpeas, Pomegranate seeds, Spices, Flour bhature, Pickled onion"
            },
            {
                "restaurant_id": r_map["Punjab Heritage Rasoi"],
                "name": "Kadai Chicken",
                "description": "Tender chicken pieces tossed with freshly ground coriander, dry red chilies, and bell peppers in a rich kadai wok.",
                "category": "Chicken",
                "cuisine": "North Indian",
                "food_type": "Non-Vegetarian",
                "spice_level": "Spicy",
                "price": 320.0,
                "calories": 520,
                "protein": 34.0,
                "rating": 4.6,
                "image_url": "https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=600&auto=format&fit=crop&q=80",
                "ingredients": "Chicken, Bell peppers, Wok spices, Tomato sauce, Onions"
            },
            {
                "restaurant_id": r_map["Punjab Heritage Rasoi"],
                "name": "Tandoori Chicken Half",
                "description": "Succulent chicken leg and breast marinated in yogurt, Kashmiri red chili, and mustard oil, roasted in clay tandoor.",
                "category": "Chicken",
                "cuisine": "North Indian",
                "food_type": "Non-Vegetarian",
                "spice_level": "Spicy",
                "price": 280.0,
                "calories": 420,
                "protein": 42.0,
                "rating": 4.8,
                "image_url": "https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?w=600&auto=format&fit=crop&q=80",
                "ingredients": "Chicken, Thick yogurt, Kashmiri chili, Chaat masala, Lemon"
            },

            # 3. The Great Biryani House (Biryani)
            {
                "restaurant_id": r_map["The Great Biryani House"],
                "name": "Hyderabadi Chicken Dum Biryani",
                "description": "Long-grain basmati rice and marinated chicken slow-cooked with saffron, caramelized onions, and mint under sealed steam.",
                "category": "Biryani",
                "cuisine": "South Indian",
                "food_type": "Non-Vegetarian",
                "spice_level": "Spicy",
                "price": 290.0,
                "calories": 650,
                "protein": 32.0,
                "rating": 4.9,
                "image_url": "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=600&auto=format&fit=crop&q=80",
                "ingredients": "Basmati rice, Chicken, Saffron, Fried onions, Ghee, Mirchi ka salan, Raita"
            },
            {
                "restaurant_id": r_map["The Great Biryani House"],
                "name": "Royal Veg Dum Biryani",
                "description": "Fragrant basmati rice layered with garden vegetables, paneer cubes, saffron milk, and aromatic spices.",
                "category": "Biryani",
                "cuisine": "North Indian",
                "food_type": "Vegetarian",
                "spice_level": "Medium",
                "price": 230.0,
                "calories": 480,
                "protein": 14.0,
                "rating": 4.6,
                "image_url": "https://images.unsplash.com/photo-1633945274405-b6c8069047b0?w=600&auto=format&fit=crop&q=80",
                "ingredients": "Basmati rice, Carrots, Beans, Paneer, Fried onions, Mint, Saffron"
            },
            {
                "restaurant_id": r_map["The Great Biryani House"],
                "name": "Paneer Tikka Biryani",
                "description": "Smoky char-grilled paneer tikka pieces infused with saffron-spiced biryani rice and caramelized onions.",
                "category": "Biryani",
                "cuisine": "North Indian",
                "food_type": "Vegetarian",
                "spice_level": "Medium",
                "price": 250.0,
                "calories": 520,
                "protein": 19.0,
                "rating": 4.7,
                "image_url": "https://images.unsplash.com/photo-1633945274405-b6c8069047b0?w=600&auto=format&fit=crop&q=80",
                "ingredients": "Paneer, Basmati rice, Biryani masala, Yogurt, Mint, Raita"
            },
            {
                "restaurant_id": r_map["The Great Biryani House"],
                "name": "Egg Dum Biryani",
                "description": "Hard-boiled eggs tossed in a spiced masala gravy layered with aromatic aged basmati rice.",
                "category": "Biryani",
                "cuisine": "South Indian",
                "food_type": "Eggitarian",
                "spice_level": "Medium",
                "price": 210.0,
                "calories": 490,
                "protein": 18.0,
                "rating": 4.5,
                "image_url": "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=600&auto=format&fit=crop&q=80",
                "ingredients": "Eggs, Basmati rice, Cardamom, Cloves, Fried onions, Raita"
            },
            {
                "restaurant_id": r_map["The Great Biryani House"],
                "name": "Lucknowi Mutton Biryani",
                "description": "Melt-in-mouth tender mutton pieces cooked in Awadhi yakhni broth with delicate floral notes and aged basmati.",
                "category": "Biryani",
                "cuisine": "North Indian",
                "food_type": "Non-Vegetarian",
                "spice_level": "Medium",
                "price": 380.0,
                "calories": 720,
                "protein": 36.0,
                "rating": 4.8,
                "image_url": "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=600&auto=format&fit=crop&q=80",
                "ingredients": "Tender goat mutton, Aged basmati rice, Kewra water, Rose water, Ghee"
            },

            # 4. The Golden Wok (Chinese)
            {
                "restaurant_id": r_map["The Golden Wok"],
                "name": "Veg Hakka Noodles",
                "description": "Wok-tossed noodles with shredded cabbage, crunchy carrots, bell peppers, and scallions in light soy dressing.",
                "category": "Noodles",
                "cuisine": "Chinese",
                "food_type": "Vegetarian",
                "spice_level": "Mild",
                "price": 170.0,
                "calories": 380,
                "protein": 9.0,
                "rating": 4.5,
                "image_url": "https://images.unsplash.com/photo-1585032226651-759b368d7246?w=600&auto=format&fit=crop&q=80",
                "ingredients": "Wheat noodles, Bell peppers, Spring onions, Soy sauce, Garlic"
            },
            {
                "restaurant_id": r_map["The Golden Wok"],
                "name": "Schezwan Chicken Fried Rice",
                "description": "Wok-fried rice tossed with fiery Sichuan red chili paste, tender chicken bits, and chopped vegetables.",
                "category": "Fried Rice",
                "cuisine": "Chinese",
                "food_type": "Non-Vegetarian",
                "spice_level": "Spicy",
                "price": 220.0,
                "calories": 490,
                "protein": 22.0,
                "rating": 4.6,
                "image_url": "https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=600&auto=format&fit=crop&q=80",
                "ingredients": "Long grain rice, Chicken breast, Sichuan peppers, Garlic, Celery, Chili oil"
            },
            {
                "restaurant_id": r_map["The Golden Wok"],
                "name": "Chilli Paneer Dry",
                "description": "Crispy cottage cheese tossed in spicy soy-chili reduction with crunchy onions and capsicum.",
                "category": "Paneer",
                "cuisine": "Chinese",
                "food_type": "Vegetarian",
                "spice_level": "Spicy",
                "price": 230.0,
                "calories": 410,
                "protein": 17.0,
                "rating": 4.7,
                "image_url": "https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?w=600&auto=format&fit=crop&q=80",
                "ingredients": "Paneer cubes, Capsicum, Green chilies, Soy sauce, Spring onion"
            },
            {
                "restaurant_id": r_map["The Golden Wok"],
                "name": "Crispy Veg Spring Rolls (6 Pcs)",
                "description": "Golden fried wonton wrappers stuffed with seasoned julienned vegetables, served with sweet chili dip.",
                "category": "Snacks",
                "cuisine": "Chinese",
                "food_type": "Vegan",
                "spice_level": "Mild",
                "price": 160.0,
                "calories": 310,
                "protein": 6.0,
                "rating": 4.4,
                "image_url": "https://images.unsplash.com/photo-1541696432-82c6da8ce7bf?w=600&auto=format&fit=crop&q=80",
                "ingredients": "Spring roll pastry, Cabbage, Carrots, Glass noodles, Sweet chili dip"
            },
            {
                "restaurant_id": r_map["The Golden Wok"],
                "name": "Chicken Manchurian Gravy",
                "description": "Crispy chicken bites coated in dark savory Manchurian gravy infused with ginger, garlic, and green coriander.",
                "category": "Chicken",
                "cuisine": "Chinese",
                "food_type": "Non-Vegetarian",
                "spice_level": "Medium",
                "price": 240.0,
                "calories": 460,
                "protein": 28.0,
                "rating": 4.5,
                "image_url": "https://images.unsplash.com/photo-1525755662778-989d0524087e?w=600&auto=format&fit=crop&q=80",
                "ingredients": "Chicken meatballs, Dark soy sauce, Ginger, Garlic, Cornstarch broth"
            },

            # 5. Bella Cucina Trattoria (Italian)
            {
                "restaurant_id": r_map["Bella Cucina Trattoria"],
                "name": "Classic Margherita Pizza",
                "description": "Wood-fired crispy thin crust topped with San Marzano tomato sauce, fresh mozzarella cheese, and basil leaves.",
                "category": "Pizza",
                "cuisine": "Italian",
                "food_type": "Vegetarian",
                "spice_level": "Mild",
                "price": 320.0,
                "calories": 580,
                "protein": 22.0,
                "rating": 4.8,
                "image_url": "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=600&auto=format&fit=crop&q=80",
                "ingredients": "Hand-stretched dough, Mozzarella, San Marzano tomatoes, Fresh basil, Olive oil"
            },
            {
                "restaurant_id": r_map["Bella Cucina Trattoria"],
                "name": "Creamy Penne Alfredo",
                "description": "Al dente penne pasta tossed in rich parmesan butter cream sauce with sauteed mushrooms and oregano.",
                "category": "Noodles",
                "cuisine": "Italian",
                "food_type": "Vegetarian",
                "spice_level": "Mild",
                "price": 280.0,
                "calories": 540,
                "protein": 14.0,
                "rating": 4.6,
                "image_url": "https://images.unsplash.com/photo-1621996346565-e3d5d6281729?w=600&auto=format&fit=crop&q=80",
                "ingredients": "Penne pasta, Heavy cream, Parmesan cheese, Butter, Button mushrooms, Oregano"
            },
            {
                "restaurant_id": r_map["Bella Cucina Trattoria"],
                "name": "Peri Peri Chicken Pizza",
                "description": "Spicy roasted chicken, mozzarella, bell peppers, and jalapeños dusted with zesty peri-peri seasoning.",
                "category": "Pizza",
                "cuisine": "Italian",
                "food_type": "Non-Vegetarian",
                "spice_level": "Spicy",
                "price": 390.0,
                "calories": 680,
                "protein": 34.0,
                "rating": 4.7,
                "image_url": "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=600&auto=format&fit=crop&q=80",
                "ingredients": "Pizza base, Grilled chicken, Peri peri spices, Jalapeños, Mozzarella"
            },
            {
                "restaurant_id": r_map["Bella Cucina Trattoria"],
                "name": "Garlic Cheese Bread",
                "description": "Toasted ciabatta slices smothered with garlic herb butter and melted mozzarella.",
                "category": "Snacks",
                "cuisine": "Italian",
                "food_type": "Vegetarian",
                "spice_level": "Mild",
                "price": 140.0,
                "calories": 310,
                "protein": 8.0,
                "rating": 4.5,
                "image_url": "https://images.unsplash.com/photo-1619895092538-128341789043?w=600&auto=format&fit=crop&q=80",
                "ingredients": "Ciabatta bread, Roasted garlic, Parsley butter, Mozzarella"
            },
            {
                "restaurant_id": r_map["Bella Cucina Trattoria"],
                "name": "Classic Tiramisu",
                "description": "Traditional Italian dessert layered with coffee-soaked ladyfingers and whipped mascarpone cream, dusted with cocoa.",
                "category": "Desserts",
                "cuisine": "Italian",
                "food_type": "Eggitarian",
                "spice_level": "Mild",
                "price": 220.0,
                "calories": 360,
                "protein": 6.0,
                "rating": 4.9,
                "image_url": "https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=600&auto=format&fit=crop&q=80",
                "ingredients": "Mascarpone cheese, Espresso coffee, Savoiardi ladyfingers, Cocoa powder"
            },

            # 6. Taco Fiesta Mexican Cantina (Mexican)
            {
                "restaurant_id": r_map["Taco Fiesta Mexican Cantina"],
                "name": "Cheesy Bean & Corn Burrito",
                "description": "Warm flour tortilla rolled with seasoned black beans, sweet corn, cilantro lime rice, salsa, and melted cheddar.",
                "category": "Snacks",
                "cuisine": "Mexican",
                "food_type": "Vegetarian",
                "spice_level": "Medium",
                "price": 220.0,
                "calories": 510,
                "protein": 15.0,
                "rating": 4.5,
                "image_url": "https://images.unsplash.com/photo-1626700051175-6818013e1d4f?w=600&auto=format&fit=crop&q=80",
                "ingredients": "Tortilla, Black beans, Mexican rice, Cheddar cheese, Pico de gallo"
            },
            {
                "restaurant_id": r_map["Taco Fiesta Mexican Cantina"],
                "name": "Grilled Chicken Tacos (3 Pcs)",
                "description": "Soft corn tortillas stuffed with juicy cumin-spiced chicken, shredded lettuce, pico de gallo, and chipotle crema.",
                "category": "Chicken",
                "cuisine": "Mexican",
                "food_type": "Non-Vegetarian",
                "spice_level": "Medium",
                "price": 260.0,
                "calories": 440,
                "protein": 28.0,
                "rating": 4.6,
                "image_url": "https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=600&auto=format&fit=crop&q=80",
                "ingredients": "Corn tortillas, Spiced chicken breast, Chipotle salsa, Sour cream, Lime"
            },
            {
                "restaurant_id": r_map["Taco Fiesta Mexican Cantina"],
                "name": "Loaded Nachos Supreme",
                "description": "Crisp corn tortilla chips smothered in warm queso sauce, jalapeños, refried beans, and guacamole.",
                "category": "Snacks",
                "cuisine": "Mexican",
                "food_type": "Vegetarian",
                "spice_level": "Medium",
                "price": 190.0,
                "calories": 580,
                "protein": 11.0,
                "rating": 4.7,
                "image_url": "https://images.unsplash.com/photo-1513456852971-30c0b8199d4d?w=600&auto=format&fit=crop&q=80",
                "ingredients": "Tortilla chips, Queso cheese, Jalapeños, Guacamole, Salsa fresca"
            },
            {
                "restaurant_id": r_map["Taco Fiesta Mexican Cantina"],
                "name": "Crispy Cinnamon Churros (4 Pcs)",
                "description": "Golden fried Mexican pastry tossed in cinnamon sugar, served with warm dulce de leche dip.",
                "category": "Desserts",
                "cuisine": "Mexican",
                "food_type": "Vegetarian",
                "spice_level": "Mild",
                "price": 150.0,
                "calories": 320,
                "protein": 4.0,
                "rating": 4.6,
                "image_url": "https://images.unsplash.com/photo-1624300629298-e9de39c13be5?w=600&auto=format&fit=crop&q=80",
                "ingredients": "Pastry dough, Cinnamon sugar, Dark chocolate sauce, Caramel"
            },

            # 7. Seoul Spoon Korean BBQ (Korean)
            {
                "restaurant_id": r_map["Seoul Spoon Korean BBQ"],
                "name": "Classic Veg Bibimbap Bowl",
                "description": "Steamed white rice bowl topped with sauteed spinach, shiitake mushrooms, zucchini, carrots, and spicy gochujang sauce.",
                "category": "Fried Rice",
                "cuisine": "Korean",
                "food_type": "Vegan",
                "spice_level": "Medium",
                "price": 270.0,
                "calories": 420,
                "protein": 12.0,
                "rating": 4.6,
                "image_url": "https://images.unsplash.com/photo-1553163147-622ab57be1c7?w=600&auto=format&fit=crop&q=80",
                "ingredients": "Sticky rice, Shiitake, Spinach, Gochujang chili sauce, Sesame oil"
            },
            {
                "restaurant_id": r_map["Seoul Spoon Korean BBQ"],
                "name": "Korean Crispy Fried Chicken",
                "description": "Double-fried crunchy chicken pieces tossed in sticky sweet and spicy gochujang glaze with toasted sesame.",
                "category": "Chicken",
                "cuisine": "Korean",
                "food_type": "Non-Vegetarian",
                "spice_level": "Spicy",
                "price": 290.0,
                "calories": 580,
                "protein": 36.0,
                "rating": 4.8,
                "image_url": "https://images.unsplash.com/photo-1527477378408-1bc097a904d5?w=600&auto=format&fit=crop&q=80",
                "ingredients": "Chicken wings, Gochujang, Honey, Soy sauce, Garlic, Sesame"
            },
            {
                "restaurant_id": r_map["Seoul Spoon Korean BBQ"],
                "name": "Spicy Tteokbokki Rice Cakes",
                "description": "Chewy cylindrical Korean rice cakes simmered in sweet and fiery red pepper broth with scallions.",
                "category": "Snacks",
                "cuisine": "Korean",
                "food_type": "Vegetarian",
                "spice_level": "Spicy",
                "price": 210.0,
                "calories": 360,
                "protein": 7.0,
                "rating": 4.5,
                "image_url": "https://images.unsplash.com/photo-1498654896293-37aacf113fd9?w=600&auto=format&fit=crop&q=80",
                "ingredients": "Rice cakes, Gochugaru chili flakes, Scallions, Kelp broth"
            },
            {
                "restaurant_id": r_map["Seoul Spoon Korean BBQ"],
                "name": "Kimchi Fried Rice with Egg",
                "description": "Aged tangy kimchi stir-fried with jasmine rice, scallions, sesame oil, and a sunny side fried egg.",
                "category": "Fried Rice",
                "cuisine": "Korean",
                "food_type": "Eggitarian",
                "spice_level": "Medium",
                "price": 230.0,
                "calories": 440,
                "protein": 14.0,
                "rating": 4.6,
                "image_url": "https://images.unsplash.com/photo-1553163147-622ab57be1c7?w=600&auto=format&fit=crop&q=80",
                "ingredients": "Fermented kimchi, Rice, Sunny egg, Sesame oil, Seaweed flakes"
            },

            # 8. Tokyo Bowl & Ramen Bar (Japanese)
            {
                "restaurant_id": r_map["Tokyo Bowl & Ramen Bar"],
                "name": "Rich Miso Veg Ramen",
                "description": "Steaming wheat noodles in fermented miso and kombu broth, topped with sweet corn, bamboo shoots, tofu, and nori.",
                "category": "Noodles",
                "cuisine": "Japanese",
                "food_type": "Vegetarian",
                "spice_level": "Medium",
                "price": 310.0,
                "calories": 460,
                "protein": 16.0,
                "rating": 4.7,
                "image_url": "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=600&auto=format&fit=crop&q=80",
                "ingredients": "Ramen noodles, Miso broth, Silken tofu, Menma bamboo, Nori seaweed, Corn"
            },
            {
                "restaurant_id": r_map["Tokyo Bowl & Ramen Bar"],
                "name": "Chicken Teriyaki Donburi",
                "description": "Juicy grilled chicken glazed in savory sweet teriyaki sauce over steamed sticky sushi rice with sesame.",
                "category": "Chicken",
                "cuisine": "Japanese",
                "food_type": "Non-Vegetarian",
                "spice_level": "Mild",
                "price": 290.0,
                "calories": 510,
                "protein": 30.0,
                "rating": 4.6,
                "image_url": "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&auto=format&fit=crop&q=80",
                "ingredients": "Grilled chicken, Teriyaki glaze, Short grain rice, Scallions, Broccoli"
            },
            {
                "restaurant_id": r_map["Tokyo Bowl & Ramen Bar"],
                "name": "Pan-Fried Veg Gyoza (6 Pcs)",
                "description": "Crispy bottom steamed Japanese dumplings filled with cabbage, mushrooms, and ginger with soy dip.",
                "category": "Snacks",
                "cuisine": "Japanese",
                "food_type": "Vegan",
                "spice_level": "Mild",
                "price": 180.0,
                "calories": 240,
                "protein": 8.0,
                "rating": 4.5,
                "image_url": "https://images.unsplash.com/photo-1498654896293-37aacf113fd9?w=600&auto=format&fit=crop&q=80",
                "ingredients": "Dumpling pastry, Shiitake mushrooms, Cabbage, Ginger, Soy vinegar"
            },

            # 9. Al-Madina Mandi & Grill (Arabian)
            {
                "restaurant_id": r_map["Al-Madina Mandi & Grill"],
                "name": "Arabian Chicken Mandi",
                "description": "Aromatic long-grain basmati rice smoked with special Yemeni spices, served with a succulent roasted chicken leg.",
                "category": "Biryani",
                "cuisine": "Arabian",
                "food_type": "Non-Vegetarian",
                "spice_level": "Medium",
                "price": 310.0,
                "calories": 680,
                "protein": 35.0,
                "rating": 4.8,
                "image_url": "https://images.unsplash.com/photo-1544025162-d76694265947?w=600&auto=format&fit=crop&q=80",
                "ingredients": "Basmati rice, Roast chicken, Yemeni hawaij spices, Almonds, Spicy tomato salsa"
            },
            {
                "restaurant_id": r_map["Al-Madina Mandi & Grill"],
                "name": "Falafel & Hummus Mezze Platter",
                "description": "Crispy golden chickpea patties served with creamy olive oil hummus, pickled veggies, and warm pita bread.",
                "category": "Snacks",
                "cuisine": "Arabian",
                "food_type": "Vegan",
                "spice_level": "Mild",
                "price": 210.0,
                "calories": 420,
                "protein": 15.0,
                "rating": 4.7,
                "image_url": "https://images.unsplash.com/photo-1541518763669-27fef04b14ea?w=600&auto=format&fit=crop&q=80",
                "ingredients": "Chickpea falafel, Tahini hummus, Extra virgin olive oil, Pita bread"
            },
            {
                "restaurant_id": r_map["Al-Madina Mandi & Grill"],
                "name": "Grilled Chicken Shawarma Roll",
                "description": "Thinly shaved marinated chicken wrapped in soft rumali bread with garlic toum spread and pickled gherkins.",
                "category": "Chicken",
                "cuisine": "Arabian",
                "food_type": "Non-Vegetarian",
                "spice_level": "Medium",
                "price": 160.0,
                "calories": 430,
                "protein": 24.0,
                "rating": 4.6,
                "image_url": "https://images.unsplash.com/photo-1561651823-34feb02250e4?w=600&auto=format&fit=crop&q=80",
                "ingredients": "Rotisserie chicken, Pita roll, Garlic toum, Pickled cucumbers, French fries"
            },
            {
                "restaurant_id": r_map["Al-Madina Mandi & Grill"],
                "name": "Paneer Shawarma Roll",
                "description": "Grilled marinated cottage cheese strips tossed with garlic yogurt sauce and crunchy lettuce in flatbread.",
                "category": "Paneer",
                "cuisine": "Arabian",
                "food_type": "Vegetarian",
                "spice_level": "Medium",
                "price": 150.0,
                "calories": 380,
                "protein": 14.0,
                "rating": 4.4,
                "image_url": "https://images.unsplash.com/photo-1561651823-34feb02250e4?w=600&auto=format&fit=crop&q=80",
                "ingredients": "Paneer, Arabian herbs, Garlic sauce, Shredded lettuce, Rumali bread"
            },

            # 10. Burger Foundry (Fast Food)
            {
                "restaurant_id": r_map["Burger Foundry"],
                "name": "Classic Crispy Veg Burger",
                "description": "Crispy golden vegetable patty topped with melted cheddar, fresh iceberg lettuce, sliced tomatoes, and creamy herb mayo.",
                "category": "Burger",
                "cuisine": "Fast Food",
                "food_type": "Vegetarian",
                "spice_level": "Mild",
                "price": 140.0,
                "calories": 420,
                "protein": 10.0,
                "rating": 4.5,
                "image_url": "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600&auto=format&fit=crop&q=80",
                "ingredients": "Brioche bun, Potato veg patty, Cheddar slice, Lettuce, Herb mayo"
            },
            {
                "restaurant_id": r_map["Burger Foundry"],
                "name": "Spicy Peri-Peri Chicken Burger",
                "description": "Crispy fried chicken breast fillet tossed in spicy peri-peri rub with jalapeño slaw and chipotle sauce in brioche.",
                "category": "Burger",
                "cuisine": "Fast Food",
                "food_type": "Non-Vegetarian",
                "spice_level": "Spicy",
                "price": 190.0,
                "calories": 530,
                "protein": 28.0,
                "rating": 4.7,
                "image_url": "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600&auto=format&fit=crop&q=80",
                "ingredients": "Fried chicken breast, Brioche bun, Peri-peri dust, Jalapeño relish"
            },
            {
                "restaurant_id": r_map["Burger Foundry"],
                "name": "Paneer Tikka Fusion Burger",
                "description": "Thick grilled paneer steak coated in tandoori marinade with mint mayo, red onion rings, and toasted sesame bun.",
                "category": "Burger",
                "cuisine": "Fast Food",
                "food_type": "Vegetarian",
                "spice_level": "Medium",
                "price": 170.0,
                "calories": 460,
                "protein": 18.0,
                "rating": 4.6,
                "image_url": "https://images.unsplash.com/photo-1550547660-d9450f859349?w=600&auto=format&fit=crop&q=80",
                "ingredients": "Grilled paneer steak, Mint chutney mayo, Onion rings, Sesame bun"
            },
            {
                "restaurant_id": r_map["Burger Foundry"],
                "name": "Peri Peri French Fries",
                "description": "Golden crispy potato french fries tossed in signature fiery African peri-peri seasoning with garlic dip.",
                "category": "Snacks",
                "cuisine": "Fast Food",
                "food_type": "Vegan",
                "spice_level": "Spicy",
                "price": 110.0,
                "calories": 310,
                "protein": 4.0,
                "rating": 4.6,
                "image_url": "https://images.unsplash.com/photo-1576107232684-1279f3908594?w=600&auto=format&fit=crop&q=80",
                "ingredients": "Potatoes, Peri-peri seasoning, Sea salt, Garlic dip"
            },
            {
                "restaurant_id": r_map["Burger Foundry"],
                "name": "Cheesy Loaded Fries",
                "description": "Deep-fried crinkle fries drowned in liquid cheddar cheese sauce and sprinkled with green herbs and jalapeños.",
                "category": "Snacks",
                "cuisine": "Fast Food",
                "food_type": "Vegetarian",
                "spice_level": "Mild",
                "price": 150.0,
                "calories": 460,
                "protein": 8.0,
                "rating": 4.5,
                "image_url": "https://images.unsplash.com/photo-1576107232684-1279f3908594?w=600&auto=format&fit=crop&q=80",
                "ingredients": "Fries, Warm cheddar sauce, Chopped jalapeños, Herbs"
            },

            # 11. Sweet Tooth Confectionery (Desserts)
            {
                "restaurant_id": r_map["Sweet Tooth Confectionery"],
                "name": "Warm Sizzling Chocolate Brownie",
                "description": "Gooey fudge brownie served on a scorching cast iron sizzler with vanilla ice cream and hot dark chocolate fudge.",
                "category": "Desserts",
                "cuisine": "Desserts",
                "food_type": "Vegetarian",
                "spice_level": "Mild",
                "price": 180.0,
                "calories": 490,
                "protein": 6.0,
                "rating": 4.9,
                "image_url": "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=600&auto=format&fit=crop&q=80",
                "ingredients": "Dark chocolate brownie, Vanilla bean ice cream, Hot chocolate sauce"
            },
            {
                "restaurant_id": r_map["Sweet Tooth Confectionery"],
                "name": "New York Baked Cheesecake",
                "description": "Creamy dense cheesecake baked on a graham cracker butter crust, topped with fresh blueberry compote.",
                "category": "Desserts",
                "cuisine": "Desserts",
                "food_type": "Eggitarian",
                "spice_level": "Mild",
                "price": 210.0,
                "calories": 380,
                "protein": 7.0,
                "rating": 4.8,
                "image_url": "https://images.unsplash.com/photo-1533134242443-d4fd215305ad?w=600&auto=format&fit=crop&q=80",
                "ingredients": "Cream cheese, Graham crust, Blueberry compote, Vanilla extract"
            },
            {
                "restaurant_id": r_map["Sweet Tooth Confectionery"],
                "name": "Nutella Belgian Waffle",
                "description": "Crispy golden malted waffle loaded with thick Nutella spread, sliced bananas, and roasted hazelnuts.",
                "category": "Desserts",
                "cuisine": "Desserts",
                "food_type": "Vegetarian",
                "spice_level": "Mild",
                "price": 190.0,
                "calories": 520,
                "protein": 8.0,
                "rating": 4.7,
                "image_url": "https://images.unsplash.com/photo-1562376552-0d160a2f238d?w=600&auto=format&fit=crop&q=80",
                "ingredients": "Waffle, Nutella, Bananas, Roasted hazelnuts, Whipped cream"
            },
            {
                "restaurant_id": r_map["Sweet Tooth Confectionery"],
                "name": "Thick Oreo Chocolate Shake",
                "description": "Blended vanilla ice cream with crunchy Oreo biscuits, milk, and chocolate syrup, crowned with whipped cream.",
                "category": "Desserts",
                "cuisine": "Desserts",
                "food_type": "Vegetarian",
                "spice_level": "Mild",
                "price": 160.0,
                "calories": 410,
                "protein": 7.5,
                "rating": 4.6,
                "image_url": "https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=600&auto=format&fit=crop&q=80",
                "ingredients": "Oreo cookies, Whole milk, Chocolate syrup, Vanilla ice cream"
            },

            # 12. Madras Cafe Express (South Indian)
            {
                "restaurant_id": r_map["Madras Cafe Express"],
                "name": "Ghee Podi Idli",
                "description": "Steamed button idlis tossed in fragrant clarified ghee and spicy gun-powder lentil podi spice mix.",
                "category": "Snacks",
                "cuisine": "South Indian",
                "food_type": "Vegetarian",
                "spice_level": "Spicy",
                "price": 120.0,
                "calories": 310,
                "protein": 7.0,
                "rating": 4.8,
                "image_url": "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=600&auto=format&fit=crop&q=80",
                "ingredients": "Idlis, Pure desi ghee, Gunpowder podi, Curry leaves"
            },
            {
                "restaurant_id": r_map["Madras Cafe Express"],
                "name": "Crispy Rava Onion Dosa",
                "description": "Lacy, crunchy semolina dosa infused with cumin, ginger, and sauteed chopped onions.",
                "category": "Dosa",
                "cuisine": "South Indian",
                "food_type": "Vegetarian",
                "spice_level": "Medium",
                "price": 140.0,
                "calories": 360,
                "protein": 7.0,
                "rating": 4.6,
                "image_url": "https://images.unsplash.com/photo-1668236543090-82eba5ee5976?w=600&auto=format&fit=crop&q=80",
                "ingredients": "Semolina, Rice flour, Cumin, Green chilies, Onions, Coconut chutney"
            },
            {
                "restaurant_id": r_map["Madras Cafe Express"],
                "name": "South Indian Bisibelebath",
                "description": "Wholesome spiced rice and lentil mash simmered with tamarind, vegetables, cashews, and ghee boondi.",
                "category": "Fried Rice",
                "cuisine": "South Indian",
                "food_type": "Vegetarian",
                "spice_level": "Medium",
                "price": 160.0,
                "calories": 420,
                "protein": 11.0,
                "rating": 4.7,
                "image_url": "https://images.unsplash.com/photo-1630383249896-424e482df921?w=600&auto=format&fit=crop&q=80",
                "ingredients": "Rice, Toor dal, Tamarind, Cashew nuts, Bisibelebath masala, Ghee"
            },
            {
                "restaurant_id": r_map["Madras Cafe Express"],
                "name": "Traditional Filter Kaapi",
                "description": "Authentic South Indian chicory blended decoction froths with hot foamed milk in stainless steel tumbler and davara.",
                "category": "Snacks",
                "cuisine": "South Indian",
                "food_type": "Vegetarian",
                "spice_level": "Mild",
                "price": 60.0,
                "calories": 90,
                "protein": 3.0,
                "rating": 4.9,
                "image_url": "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=600&auto=format&fit=crop&q=80",
                "ingredients": "Coffee beans, Chicory decoction, Whole milk, Sugar"
            },

            # 13. Delhi Chaat & Street Rolls (North Indian)
            {
                "restaurant_id": r_map["Delhi Chaat & Street Rolls"],
                "name": "Dahi Papdi Chaat",
                "description": "Crisp flour wafers topped with boiled potatoes, spiced chickpeas, sweet yogurt, tangy tamarind, and mint chutney.",
                "category": "Snacks",
                "cuisine": "North Indian",
                "food_type": "Vegetarian",
                "spice_level": "Medium",
                "price": 110.0,
                "calories": 290,
                "protein": 6.0,
                "rating": 4.6,
                "image_url": "https://images.unsplash.com/photo-1601050690597-df0568f70950?w=600&auto=format&fit=crop&q=80",
                "ingredients": "Crisp papdi, Sweet curd, Tamarind chutney, Sev, Mint chutney"
            },
            {
                "restaurant_id": r_map["Delhi Chaat & Street Rolls"],
                "name": "Paneer Tikka Kathi Roll",
                "description": "Flaky paratha rolled with tandoori grilled paneer cubes, crunchy sliced onions, chaat masala, and mint dip.",
                "category": "Paneer",
                "cuisine": "North Indian",
                "food_type": "Vegetarian",
                "spice_level": "Medium",
                "price": 160.0,
                "calories": 410,
                "protein": 15.0,
                "rating": 4.7,
                "image_url": "https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?w=600&auto=format&fit=crop&q=80",
                "ingredients": "Paratha, Spiced paneer, Onion slices, Mint chutney, Chaat masala"
            },
            {
                "restaurant_id": r_map["Delhi Chaat & Street Rolls"],
                "name": "Crispy Samosa with Chole (2 Pcs)",
                "description": "Flaky golden samosas stuffed with spiced potatoes and peas, served on bed of zesty chickpea curry.",
                "category": "Snacks",
                "cuisine": "North Indian",
                "food_type": "Vegan",
                "spice_level": "Spicy",
                "price": 90.0,
                "calories": 360,
                "protein": 7.0,
                "rating": 4.5,
                "image_url": "https://images.unsplash.com/photo-1601050690597-df0568f70950?w=600&auto=format&fit=crop&q=80",
                "ingredients": "Samosa pastry, Spiced potatoes, Chole gravy, Tamarind chutney"
            },
            {
                "restaurant_id": r_map["Delhi Chaat & Street Rolls"],
                "name": "Chicken Tikka Kathi Roll",
                "description": "Juicy chicken tikka chunks wrapped in an egg-layered paratha with pickled green chillies and spiced onions.",
                "category": "Chicken",
                "cuisine": "North Indian",
                "food_type": "Non-Vegetarian",
                "spice_level": "Spicy",
                "price": 190.0,
                "calories": 480,
                "protein": 26.0,
                "rating": 4.7,
                "image_url": "https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?w=600&auto=format&fit=crop&q=80",
                "ingredients": "Egg paratha, Chicken tikka, Mint mayo, Sliced onions"
            },

            # 14. Spice Symphony (North Indian)
            {
                "restaurant_id": r_map["Spice Symphony"],
                "name": "Shahi Paneer",
                "description": "Royal Mughlai preparation of cottage cheese in fragrant white cashew nut and cardamom gravy.",
                "category": "Paneer",
                "cuisine": "North Indian",
                "food_type": "Vegetarian",
                "spice_level": "Mild",
                "price": 280.0,
                "calories": 460,
                "protein": 17.0,
                "rating": 4.6,
                "image_url": "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=600&auto=format&fit=crop&q=80",
                "ingredients": "Paneer, Cashew paste, Cardamom, Milk cream, Saffron"
            },
            {
                "restaurant_id": r_map["Spice Symphony"],
                "name": "Murg Malai Tikka",
                "description": "Boneless chicken chunks marinated in cream, cream cheese, white pepper, and mace, char-grilled to perfection.",
                "category": "Chicken",
                "cuisine": "North Indian",
                "food_type": "Non-Vegetarian",
                "spice_level": "Mild",
                "price": 310.0,
                "calories": 440,
                "protein": 35.0,
                "rating": 4.8,
                "image_url": "https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=600&auto=format&fit=crop&q=80",
                "ingredients": "Chicken thigh, Cream, Processed cheese, White pepper, Lemon"
            },
            {
                "restaurant_id": r_map["Spice Symphony"],
                "name": "Palak Paneer",
                "description": "Fresh cottage cheese cubes cooked in rich vibrant pureed spinach with mild roasted spices and garlic.",
                "category": "Paneer",
                "cuisine": "North Indian",
                "food_type": "Vegetarian",
                "spice_level": "Medium",
                "price": 240.0,
                "calories": 390,
                "protein": 18.0,
                "rating": 4.7,
                "image_url": "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=600&auto=format&fit=crop&q=80",
                "ingredients": "Spinach, Cottage cheese, Garlic, Cumin, Kasuri methi"
            },
            {
                "restaurant_id": r_map["Spice Symphony"],
                "name": "Kashmiri Mutton Rogan Josh",
                "description": "Tender lamb simmered in aromatic gravy colored with Kashmiri rattan jot and infused with fennel and ginger.",
                "category": "Biryani",
                "cuisine": "North Indian",
                "food_type": "Non-Vegetarian",
                "spice_level": "Medium",
                "price": 420.0,
                "calories": 590,
                "protein": 38.0,
                "rating": 4.7,
                "image_url": "https://images.unsplash.com/photo-1544025162-d76694265947?w=600&auto=format&fit=crop&q=80",
                "ingredients": "Mutton on bone, Kashmiri chili, Fennel powder, Asafoetida, Mustard oil"
            },

            # 15. Dragon Express (Chinese)
            {
                "restaurant_id": r_map["Dragon Express"],
                "name": "Chilli Garlic Veg Noodles",
                "description": "Spicy tossed noodles with charred garlic, red dry chilies, scallions, and soy seasonings.",
                "category": "Noodles",
                "cuisine": "Chinese",
                "food_type": "Vegan",
                "spice_level": "Spicy",
                "price": 160.0,
                "calories": 360,
                "protein": 8.0,
                "rating": 4.5,
                "image_url": "https://images.unsplash.com/photo-1585032226651-759b368d7246?w=600&auto=format&fit=crop&q=80",
                "ingredients": "Eggless noodles, Minced garlic, Red chili flakes, Light soy"
            },
            {
                "restaurant_id": r_map["Dragon Express"],
                "name": "Veg Fried Rice",
                "description": "Classic wok-tossed steamed rice with diced carrots, french beans, spring onion, and white pepper.",
                "category": "Fried Rice",
                "cuisine": "Chinese",
                "food_type": "Vegan",
                "spice_level": "Mild",
                "price": 150.0,
                "calories": 340,
                "protein": 7.0,
                "rating": 4.4,
                "image_url": "https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=600&auto=format&fit=crop&q=80",
                "ingredients": "Rice, Carrots, Beans, Spring onions, White pepper, Sesame oil"
            },
            {
                "restaurant_id": r_map["Dragon Express"],
                "name": "Steamed Veg Dim Sums (6 Pcs)",
                "description": "Delicate translucent wrappers filled with finely minced water chestnuts, mushrooms, and zucchini with spicy dip.",
                "category": "Snacks",
                "cuisine": "Chinese",
                "food_type": "Vegan",
                "spice_level": "Mild",
                "price": 180.0,
                "calories": 210,
                "protein": 6.5,
                "rating": 4.6,
                "image_url": "https://images.unsplash.com/photo-1541696432-82c6da8ce7bf?w=600&auto=format&fit=crop&q=80",
                "ingredients": "Dim sum skin, Water chestnuts, Shiitake, Sesame oil, Chili oil"
            },
            {
                "restaurant_id": r_map["Dragon Express"],
                "name": "Crispy Honey Chilli Potatoes",
                "description": "Crispy fried potato fingers tossed in sticky sesame honey chili sauce and garnished with spring onion.",
                "category": "Snacks",
                "cuisine": "Chinese",
                "food_type": "Vegetarian",
                "spice_level": "Medium",
                "price": 140.0,
                "calories": 370,
                "protein": 4.5,
                "rating": 4.6,
                "image_url": "https://images.unsplash.com/photo-1576107232684-1279f3908594?w=600&auto=format&fit=crop&q=80",
                "ingredients": "Potato fries, Honey, Red chili sauce, Toasted sesame, Scallions"
            },

            # 16. Napoli Woodfire Pizzeria (Italian)
            {
                "restaurant_id": r_map["Napoli Woodfire Pizzeria"],
                "name": "Quattro Formaggi Four Cheese Pizza",
                "description": "Decadent stone-baked pizza layered with mozzarella, gorgonzola, parmesan, and creamy ricotta cheese.",
                "category": "Pizza",
                "cuisine": "Italian",
                "food_type": "Vegetarian",
                "spice_level": "Mild",
                "price": 420.0,
                "calories": 690,
                "protein": 28.0,
                "rating": 4.8,
                "image_url": "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=600&auto=format&fit=crop&q=80",
                "ingredients": "Neapolitan crust, Mozzarella, Gorgonzola, Ricotta, Parmesan"
            },
            {
                "restaurant_id": r_map["Napoli Woodfire Pizzeria"],
                "name": "Spicy Arrabbiata Pasta",
                "description": "Penne pasta in a fiery tomato sauce flavored with roasted garlic, red chili flakes, fresh basil, and extra virgin olive oil.",
                "category": "Noodles",
                "cuisine": "Italian",
                "food_type": "Vegan",
                "spice_level": "Spicy",
                "price": 250.0,
                "calories": 410,
                "protein": 11.0,
                "rating": 4.5,
                "image_url": "https://images.unsplash.com/photo-1621996346565-e3d5d6281729?w=600&auto=format&fit=crop&q=80",
                "ingredients": "Penne pasta, San Marzano tomatoes, Garlic, Red chili flakes, Basil"
            },
            {
                "restaurant_id": r_map["Napoli Woodfire Pizzeria"],
                "name": "BBQ Chicken Woodfire Pizza",
                "description": "Smoky barbecue chicken, red onions, cilantro, and smoked scamorza cheese baked to blistered perfection.",
                "category": "Pizza",
                "cuisine": "Italian",
                "food_type": "Non-Vegetarian",
                "spice_level": "Medium",
                "price": 410.0,
                "calories": 660,
                "protein": 33.0,
                "rating": 4.7,
                "image_url": "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=600&auto=format&fit=crop&q=80",
                "ingredients": "Smoked BBQ chicken, Scamorza cheese, Red onions, BBQ sauce"
            },
            {
                "restaurant_id": r_map["Napoli Woodfire Pizzeria"],
                "name": "Classic Pesto Genovese Pasta",
                "description": "Fusilli tossed in aromatic fresh basil pesto with toasted pine nuts, garlic, and grated pecorino cheese.",
                "category": "Noodles",
                "cuisine": "Italian",
                "food_type": "Vegetarian",
                "spice_level": "Mild",
                "price": 290.0,
                "calories": 490,
                "protein": 13.0,
                "rating": 4.6,
                "image_url": "https://images.unsplash.com/photo-1621996346565-e3d5d6281729?w=600&auto=format&fit=crop&q=80",
                "ingredients": "Fusilli, Fresh basil, Pine nuts, Extra virgin olive oil, Pecorino"
            },

            # 17. Beirut Shawarma & Falafel (Arabian)
            {
                "restaurant_id": r_map["Beirut Shawarma & Falafel"],
                "name": "Lebanese Grilled Shish Tawook",
                "description": "Yogurt, lemon, and garlic marinated chicken skewers char-grilled on open coals with warm pita and garlic toum.",
                "category": "Chicken",
                "cuisine": "Arabian",
                "food_type": "Non-Vegetarian",
                "spice_level": "Medium",
                "price": 280.0,
                "calories": 470,
                "protein": 36.0,
                "rating": 4.7,
                "image_url": "https://images.unsplash.com/photo-1544025162-d76694265947?w=600&auto=format&fit=crop&q=80",
                "ingredients": "Chicken breast, Garlic, Lemon, Sumac, Pita, Toum dip"
            },
            {
                "restaurant_id": r_map["Beirut Shawarma & Falafel"],
                "name": "Crunchy Falafel Pocket Wrap",
                "description": "Freshly fried fava and chickpea falafels tucked into warm pita pockets with tomato, tahini, and pickled turnips.",
                "category": "Snacks",
                "cuisine": "Arabian",
                "food_type": "Vegan",
                "spice_level": "Mild",
                "price": 140.0,
                "calories": 360,
                "protein": 11.0,
                "rating": 4.6,
                "image_url": "https://images.unsplash.com/photo-1541518763669-27fef04b14ea?w=600&auto=format&fit=crop&q=80",
                "ingredients": "Falafel patties, Pita pocket, Tahini sauce, Turnip pickles"
            },
            {
                "restaurant_id": r_map["Beirut Shawarma & Falafel"],
                "name": "Moutabal Smoked Eggplant Dip",
                "description": "Charred roasted eggplant mashed with sesame tahini, garlic, lemon juice, and pomegranate arils.",
                "category": "Snacks",
                "cuisine": "Arabian",
                "food_type": "Vegan",
                "spice_level": "Mild",
                "price": 170.0,
                "calories": 220,
                "protein": 5.0,
                "rating": 4.5,
                "image_url": "https://images.unsplash.com/photo-1541518763669-27fef04b14ea?w=600&auto=format&fit=crop&q=80",
                "ingredients": "Smoked eggplant, Tahini, Olive oil, Pomegranate, Pita chips"
            },

            # 18. K-Town Crispy Wings (Korean)
            {
                "restaurant_id": r_map["K-Town Crispy Wings"],
                "name": "Soy Garlic Crispy Wings (6 Pcs)",
                "description": "Double-fried crunchy chicken wings coated in sweet savory caramelized garlic soy glaze with crushed peanuts.",
                "category": "Chicken",
                "cuisine": "Korean",
                "food_type": "Non-Vegetarian",
                "spice_level": "Medium",
                "price": 240.0,
                "calories": 510,
                "protein": 31.0,
                "rating": 4.8,
                "image_url": "https://images.unsplash.com/photo-1527477378408-1bc097a904d5?w=600&auto=format&fit=crop&q=80",
                "ingredients": "Chicken wings, Garlic, Soy sauce, Brown sugar, Crushed peanuts"
            },
            {
                "restaurant_id": r_map["K-Town Crispy Wings"],
                "name": "Honey Butter Fried Tofu Bites",
                "description": "Crispy golden tofu cubes glazed in Korean honey butter sauce and dusted with parsley.",
                "category": "Snacks",
                "cuisine": "Korean",
                "food_type": "Vegetarian",
                "spice_level": "Mild",
                "price": 180.0,
                "calories": 340,
                "protein": 14.0,
                "rating": 4.5,
                "image_url": "https://images.unsplash.com/photo-1498654896293-37aacf113fd9?w=600&auto=format&fit=crop&q=80",
                "ingredients": "Firm tofu, Butter, Honey, Sea salt, Parsley flakes"
            },
            {
                "restaurant_id": r_map["K-Town Crispy Wings"],
                "name": "Japchae Korean Glass Noodles",
                "description": "Sweet potato glass noodles stir-fried with sesame oil, colorful bell peppers, carrots, and spinach.",
                "category": "Noodles",
                "cuisine": "Korean",
                "food_type": "Vegan",
                "spice_level": "Mild",
                "price": 250.0,
                "calories": 380,
                "protein": 7.0,
                "rating": 4.6,
                "image_url": "https://images.unsplash.com/photo-1585032226651-759b368d7246?w=600&auto=format&fit=crop&q=80",
                "ingredients": "Sweet potato starch noodles, Sesame oil, Carrots, Spinach, Soy"
            },

            # 19. Green Oasis Veggie Kitchen (Pure Vegan & Vegetarian)
            {
                "restaurant_id": r_map["Green Oasis Veggie Kitchen"],
                "name": "Avocado & Quinoa High Protein Bowl",
                "description": "Nutrient-packed warm quinoa, ripe avocado slices, edamame beans, roasted chickpeas, and lemon tahini dressing.",
                "category": "Snacks",
                "cuisine": "Mexican",
                "food_type": "Vegan",
                "spice_level": "Mild",
                "price": 260.0,
                "calories": 390,
                "protein": 18.0,
                "rating": 4.7,
                "image_url": "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=600&auto=format&fit=crop&q=80",
                "ingredients": "Organic quinoa, Hass avocado, Roasted chickpeas, Edamame, Lemon tahini"
            },
            {
                "restaurant_id": r_map["Green Oasis Veggie Kitchen"],
                "name": "Low-Calorie Tofu Teriyaki Bowl",
                "description": "Pan-seared organic tofu cubes glazed in low-sodium teriyaki with steamed brown rice and broccoli florets.",
                "category": "Fried Rice",
                "cuisine": "Japanese",
                "food_type": "Vegan",
                "spice_level": "Mild",
                "price": 220.0,
                "calories": 310,
                "protein": 21.0,
                "rating": 4.6,
                "image_url": "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&auto=format&fit=crop&q=80",
                "ingredients": "Organic tofu, Brown rice, Steamed broccoli, Low sodium teriyaki"
            },
            {
                "restaurant_id": r_map["Green Oasis Veggie Kitchen"],
                "name": "Paneer & Grilled Veggie Salad",
                "description": "Marinated grilled cottage cheese cubes over crisp mixed greens, cherry tomatoes, cucumbers, and olive oil balsamic dressing.",
                "category": "Paneer",
                "cuisine": "Italian",
                "food_type": "Vegetarian",
                "spice_level": "Mild",
                "price": 210.0,
                "calories": 290,
                "protein": 19.0,
                "rating": 4.8,
                "image_url": "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=600&auto=format&fit=crop&q=80",
                "ingredients": "Fresh paneer, Cherry tomatoes, Baby spinach, Olive oil, Balsamic vinegar"
            },
            {
                "restaurant_id": r_map["Green Oasis Veggie Kitchen"],
                "name": "Cold-Pressed Detox Green Juice",
                "description": "Freshly extracted cucumber, green apple, spinach, celery, and ginger juice with zero added sugar.",
                "category": "Desserts",
                "cuisine": "Desserts",
                "food_type": "Vegan",
                "spice_level": "Mild",
                "price": 120.0,
                "calories": 80,
                "protein": 2.0,
                "rating": 4.5,
                "image_url": "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&auto=format&fit=crop&q=80",
                "ingredients": "Cucumber, Green apple, Spinach, Celery, Ginger, Lemon"
            },

            # 20. Cafe Creme & Waffles (Desserts)
            {
                "restaurant_id": r_map["Cafe Creme & Waffles"],
                "name": "Belgian Dark Chocolate Waffle",
                "description": "Crisp Belgian waffle smothered with melted 70% dark Belgian chocolate and dark chocolate chips.",
                "category": "Desserts",
                "cuisine": "Desserts",
                "food_type": "Vegetarian",
                "spice_level": "Mild",
                "price": 180.0,
                "calories": 480,
                "protein": 7.0,
                "rating": 4.8,
                "image_url": "https://images.unsplash.com/photo-1562376552-0d160a2f238d?w=600&auto=format&fit=crop&q=80",
                "ingredients": "Malted waffle, 70% dark Belgian chocolate, Chocolate pearls"
            },
            {
                "restaurant_id": r_map["Cafe Creme & Waffles"],
                "name": "Warm Molten Choco Lava Cake",
                "description": "Individual chocolate sponge cake with an oozing liquid chocolate center, dusted with powdered sugar.",
                "category": "Desserts",
                "cuisine": "Desserts",
                "food_type": "Vegetarian",
                "spice_level": "Mild",
                "price": 130.0,
                "calories": 360,
                "protein": 5.0,
                "rating": 4.7,
                "image_url": "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=600&auto=format&fit=crop&q=80",
                "ingredients": "Cocoa, Butter, Sugar, Dark molten chocolate core"
            },
            {
                "restaurant_id": r_map["Cafe Creme & Waffles"],
                "name": "Mango Cheesecake Slice",
                "description": "Velvety cream cheese cake infused with real Alphonso mango pulp on golden buttery biscuit crust.",
                "category": "Desserts",
                "cuisine": "Desserts",
                "food_type": "Vegetarian",
                "spice_level": "Mild",
                "price": 200.0,
                "calories": 370,
                "protein": 6.5,
                "rating": 4.8,
                "image_url": "https://images.unsplash.com/photo-1533134242443-d4fd215305ad?w=600&auto=format&fit=crop&q=80",
                "ingredients": "Alphonso mango glaze, Cream cheese, Digestive biscuit crust"
            },
            {
                "restaurant_id": r_map["Cafe Creme & Waffles"],
                "name": "Gulab Jamun with Rabri (2 Pcs)",
                "description": "Warm fried milk dumplings soaked in cardamom sugar syrup, served with chilled creamy rabri.",
                "category": "Desserts",
                "cuisine": "Desserts",
                "food_type": "Vegetarian",
                "spice_level": "Mild",
                "price": 140.0,
                "calories": 390,
                "protein": 7.0,
                "rating": 4.9,
                "image_url": "https://images.unsplash.com/photo-1551024709-8f23befc6f87?w=600&auto=format&fit=crop&q=80",
                "ingredients": "Khoya mawa, Cardamom syrup, Pistachios, Thick rabri"
            },
            {
                "restaurant_id": r_map["Cafe Creme & Waffles"],
                "name": "Strawberry Gelato Shake",
                "description": "Real strawberry puree churned with artisanal dairy gelato and chilled whole milk.",
                "category": "Desserts",
                "cuisine": "Desserts",
                "food_type": "Vegetarian",
                "spice_level": "Mild",
                "price": 160.0,
                "calories": 320,
                "protein": 6.0,
                "rating": 4.6,
                "image_url": "https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=600&auto=format&fit=crop&q=80",
                "ingredients": "Strawberries, Italian gelato, Milk, Sweet cream"
            }
        ]

        # Ensure we reach over 100 total foods by generating targeted popular variations
        additional_variations = [
            # South Indian variations
            ("Dosa Corner & Tiffins", "Ghee Roast Masala Dosa", "Golden crepe roasted in fragrant desi ghee with potato filling", "Dosa", "South Indian", "Vegetarian", "Medium", 160.0, 390, 8.5, 4.8),
            ("Dosa Corner & Tiffins", "Cheese Burst Dosa", "Crispy crepe generously filled with melted mozzarella and cheddar cheese", "Dosa", "South Indian", "Vegetarian", "Mild", 190.0, 480, 14.0, 4.7),
            ("Dosa Corner & Tiffins", "Curd Rice with Pomegranate", "Tempered South Indian yogurt rice with mustard seeds, curry leaves, and ruby pomegranate", "Fried Rice", "South Indian", "Vegetarian", "Mild", 110.0, 260, 6.0, 4.6),
            ("Madras Cafe Express", "Tomato Uttapam", "Soft spongy rice pancake topped with juicy roasted tomatoes, herbs, and mild green chillies", "Dosa", "South Indian", "Vegetarian", "Mild", 130.0, 290, 6.5, 4.4),
            ("Madras Cafe Express", "Sambar Vada Dip (2 Pcs)", "Crisp medu vadas submerged in a bowl of hot piping lentil sambar with ghee", "Snacks", "South Indian", "Vegetarian", "Mild", 100.0, 290, 7.5, 4.7),
            ("Madras Cafe Express", "Pineapple Sheera Kesari", "Traditional semolina dessert infused with ghee, roasted cashews, and fresh pineapple chunks", "Desserts", "South Indian", "Vegetarian", "Mild", 90.0, 280, 4.0, 4.8),

            # North Indian & Biryani variations
            ("Punjab Heritage Rasoi", "Kadhai Paneer Special", "Fresh cottage cheese stir-fried with crushed whole spices, capsicum, and chunky onion gravy", "Paneer", "North Indian", "Vegetarian", "Spicy", 270.0, 470, 18.5, 4.7),
            ("Punjab Heritage Rasoi", "Butter Chicken (Murgh Makhani)", "Char-grilled boneless tandoori chicken simmered in satin smooth butter tomato gravy", "Chicken", "North Indian", "Non-Vegetarian", "Mild", 340.0, 560, 36.0, 4.9),
            ("Punjab Heritage Rasoi", "Garlic Laccha Paratha", "Multi-layered crispy whole wheat flatbread layered with butter and toasted garlic", "Snacks", "North Indian", "Vegetarian", "Mild", 80.0, 270, 6.0, 4.6),
            ("The Great Biryani House", "Boneless Chicken 65 Biryani", "Fragrant basmati rice layered with crispy deep-fried spicy Chicken 65 bites", "Biryani", "South Indian", "Non-Vegetarian", "Spicy", 310.0, 670, 34.0, 4.8),
            ("The Great Biryani House", "Mushroom Dum Biryani", "Earthy button mushrooms marinated in tandoori spices and cooked dum style with basmati rice", "Biryani", "North Indian", "Vegetarian", "Medium", 240.0, 460, 13.0, 4.5),
            ("Spice Symphony", "Paneer Lababdar", "Soft paneer cubes in an indulgent chunky onion-tomato gravy laced with grated cottage cheese", "Paneer", "North Indian", "Vegetarian", "Medium", 270.0, 490, 19.0, 4.8),
            ("Spice Symphony", "Murgh Tikka Masala", "Clay oven roasted chicken tikka cooked in spicy rich onion-tomato masala with coriander", "Chicken", "North Indian", "Non-Vegetarian", "Spicy", 330.0, 540, 35.0, 4.7),

            # Chinese variations
            ("The Golden Wok", "Chicken Hakka Noodles", "Stir-fried wheat noodles with tender chicken shreds and crisp Chinese greens", "Noodles", "Chinese", "Non-Vegetarian", "Medium", 210.0, 440, 24.0, 4.6),
            ("The Golden Wok", "Crispy Chilli Baby Corn", "Tender baby corn batter-fried and tossed with scallions and spicy dark soy glaze", "Snacks", "Chinese", "Vegetarian", "Medium", 190.0, 310, 6.0, 4.5),
            ("Dragon Express", "Egg Fried Rice", "Wok-scrambled farm fresh eggs tossed with jasmine rice, scallions, and light seasoning", "Fried Rice", "Chinese", "Eggitarian", "Mild", 170.0, 380, 12.0, 4.5),
            ("Dragon Express", "Chicken Schezwan Noodles", "Fiery wok-tossed noodles in hot schezwan pepper paste with succulent chicken bites", "Noodles", "Chinese", "Non-Vegetarian", "Spicy", 220.0, 460, 22.0, 4.7),
            ("Dragon Express", "Sweet Corn Chicken Soup", "Comforting warm chicken broth filled with sweet corn kernels and egg drop ribbons", "Snacks", "Chinese", "Non-Vegetarian", "Mild", 130.0, 160, 14.0, 4.6),

            # Italian & Fast Food variations
            ("Bella Cucina Trattoria", "Penne Arrabbiata with Chicken", "Penne pasta with grilled chicken in spicy garlic and tomato arrabbiata sauce", "Noodles", "Italian", "Non-Vegetarian", "Medium", 320.0, 510, 32.0, 4.7),
            ("Bella Cucina Trattoria", "Farmhouse Veggie Pizza", "Stone-baked crust loaded with mushrooms, onions, bell peppers, black olives, and sweet corn", "Pizza", "Italian", "Vegetarian", "Mild", 340.0, 590, 21.0, 4.6),
            ("Napoli Woodfire Pizzeria", "Paneer Tikka Pizza Fusion", "Wood-fired crust with spicy paneer tikka, red onion, green capsicum, and mozzarella", "Pizza", "Italian", "Vegetarian", "Medium", 360.0, 620, 24.0, 4.7),
            ("Burger Foundry", "Double Cheese Smash Burger", "Twin grilled beef-style soy/veg patties with double melted cheese and secret sauce", "Burger", "Fast Food", "Vegetarian", "Medium", 210.0, 560, 19.0, 4.7),
            ("Burger Foundry", "Crispy Chicken Nuggets (8 Pcs)", "Golden crusted tender chicken bites served with creamy honey mustard dip", "Chicken", "Fast Food", "Non-Vegetarian", "Mild", 170.0, 390, 22.0, 4.6),

            # Mexican, Korean, Japanese, Arabian variations
            ("Taco Fiesta Mexican Cantina", "Paneer & Pepper Fajitas", "Sizzling skillet of spiced paneer and bell peppers served with warm tortillas and salsa", "Paneer", "Mexican", "Vegetarian", "Medium", 250.0, 460, 18.0, 4.6),
            ("Taco Fiesta Mexican Cantina", "Cheesy Chicken Quesadilla", "Toasted folded tortilla stuffed with melted jack cheese, grilled chicken, and green peppers", "Chicken", "Mexican", "Non-Vegetarian", "Medium", 270.0, 520, 31.0, 4.7),
            ("Seoul Spoon Korean BBQ", "Crispy Veg Kimchi Dumplings (6 Pcs)", "Pan-seared Korean mandu dumplings stuffed with aged kimchi, tofu, and scallions", "Snacks", "Korean", "Vegetarian", "Medium", 190.0, 260, 9.0, 4.6),
            ("Tokyo Bowl & Ramen Bar", "Crispy Chicken Katsu Curry", "Panko-crusted crispy fried chicken cutlet over Japanese curry sauce and sticky rice", "Chicken", "Japanese", "Non-Vegetarian", "Mild", 330.0, 620, 34.0, 4.8),
            ("Al-Madina Mandi & Grill", "Mutton Juicy Mandi Half", "Tender fall-off-the-bone spiced mutton served over fragrance-infused Mandi rice", "Biryani", "Arabian", "Non-Vegetarian", "Medium", 440.0, 780, 42.0, 4.9),
            ("Beirut Shawarma & Falafel", "Hummus with Spiced Chicken Shawarma", "Creamy tahini hummus topped with warm seasoned chicken shawarma and virgin olive oil", "Chicken", "Arabian", "Non-Vegetarian", "Mild", 240.0, 450, 29.0, 4.8),

            # Dessert variations
            ("Sweet Tooth Confectionery", "Red Velvet Cream Cheese Jar Cake", "Layers of moist red velvet cake and rich vanilla cream cheese frosting in a glass jar", "Desserts", "Desserts", "Vegetarian", "Mild", 170.0, 350, 5.0, 4.7),
            ("Sweet Tooth Confectionery", "Belgian Chocolate Milkshake", "Creamy rich shake crafted with 55% Belgian cocoa and whole dairy milk", "Desserts", "Desserts", "Vegetarian", "Mild", 150.0, 390, 7.0, 4.6),
            ("Cafe Creme & Waffles", "Death by Chocolate Sundae", "Triple chocolate scoops layered with brownie chunks, chocolate fudge, and toasted nuts", "Desserts", "Desserts", "Vegetarian", "Mild", 220.0, 540, 8.0, 4.9),
            ("Cafe Creme & Waffles", "Nutella Banana Crepe", "Paper-thin French crepe folded with warm Nutella and fresh banana slices", "Desserts", "Desserts", "Vegetarian", "Mild", 170.0, 410, 6.0, 4.7),
            ("Green Oasis Veggie Kitchen", "Vegan Mango Chia Pudding", "Almond milk chia seed pudding layered with fresh Alphonso mango chunks and mint", "Desserts", "Desserts", "Vegan", "Mild", 150.0, 210, 7.0, 4.8),
        ]

        for item in additional_variations:
            rest_name, name, desc, cat, cuis, ftype, spice, price, cal, prot, rat = item
            foods_data.append({
                "restaurant_id": r_map[rest_name],
                "name": name,
                "description": desc,
                "category": cat,
                "cuisine": cuis,
                "food_type": ftype,
                "spice_level": spice,
                "price": price,
                "calories": cal,
                "protein": prot,
                "rating": rat,
                "image_url": "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&auto=format&fit=crop&q=80",
                "ingredients": f"{ftype} recipe crafted with authentic {cuis} spices and ingredients."
            })

        print(f"Adding {len(foods_data)} food items to database...")
        inserted_foods = []
        for f in foods_data:
            food_item = FoodItem(**f)
            db.add(food_item)
            inserted_foods.append(food_item)
        db.commit()

        # Refresh foods
        for f in inserted_foods:
            db.refresh(f)

        print(f"Successfully seeded {len(restaurants)} restaurants and {len(inserted_foods)} food items!")

        # Add sample favorites & ratings for the demo user
        # Rahul Sharma likes Dosa & South Indian
        dosa_item = next((f for f in inserted_foods if "Classic Masala Dosa" in f.name), inserted_foods[0])
        fav1 = Favorite(user_id=demo_user.id, food_item_id=dosa_item.id)
        db.add(fav1)

        rating1 = Rating(
            user_id=demo_user.id,
            food_item_id=dosa_item.id,
            rating=5.0,
            review="Best masala dosa in town! The chutney and sambar were perfectly balanced."
        )
        db.add(rating1)

        # Another favorite
        paneer_item = next((f for f in inserted_foods if "Paneer Butter Masala" in f.name), inserted_foods[1])
        fav2 = Favorite(user_id=demo_user.id, food_item_id=paneer_item.id)
        db.add(fav2)

        rating2 = Rating(
            user_id=demo_user.id,
            food_item_id=paneer_item.id,
            rating=4.5,
            review="Rich, buttery gravy. Went great with butter garlic naan!"
        )
        db.add(rating2)

        db.commit()
        print("Sample user favorites and ratings seeded successfully.")

    except Exception as e:
        print(f"Error seeding database: {e}")
        db.rollback()
        raise e
    finally:
        db.close()


if __name__ == "__main__":
    seed_database()
