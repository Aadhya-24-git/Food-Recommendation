from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .database import engine, Base
from .routers import (
    auth,
    preferences,
    foods,
    restaurants,
    recommendations,
    favorites,
    ratings,
    interactions,
    search,
    users,
    admin,
)

# Ensure database tables are created
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="FoodieAI – Smart Food Recommendation System API",
    description="A transparent, rule-based recommendation system for personalized food discovery.",
    version="1.0.0"
)

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows requests from React frontend
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount Routers
app.include_router(auth.router)
app.include_router(preferences.router)
app.include_router(foods.router)
app.include_router(restaurants.router)
app.include_router(recommendations.router)
app.include_router(favorites.router)
app.include_router(ratings.router)
app.include_router(interactions.router)
app.include_router(search.router)
app.include_router(users.router)
app.include_router(admin.router)


@app.get("/")
def root():
    return {
        "message": "Welcome to FoodieAI API",
        "version": "1.0.0",
        "docs": "/docs",
        "description": "Rule-Based Personalized Food Recommendation Engine"
    }


@app.get("/api/health")
def health_check():
    return {"status": "healthy", "service": "FoodieAI Backend"}
