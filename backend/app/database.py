import os
from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker
from dotenv import load_dotenv

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL", "").strip()

if DATABASE_URL:
    # Ensure standard postgresql prefix for SQLAlchemy
    if DATABASE_URL.startswith("postgres://"):
        DATABASE_URL = DATABASE_URL.replace("postgres://", "postgresql://", 1)
    
    try:
        # Connect to Neon PostgreSQL with 5-second connect timeout
        temp_engine = create_engine(
            DATABASE_URL,
            pool_pre_ping=True,
            connect_args={"connect_timeout": 5}
        )
        with temp_engine.connect() as conn:
            pass
        print("Connected successfully to Neon PostgreSQL database!")
        engine = temp_engine
    except Exception as e:
        print(f"Notice: Remote database connection timed out or blocked by ISP ({e.__class__.__name__}). Using local SQLite for local testing.")
        DATABASE_URL = "sqlite:///./foodieai.db"
        engine = create_engine(
            DATABASE_URL,
            connect_args={"check_same_thread": False}
        )
else:
    # Local SQLite fallback for immediate running without external dependencies
    DATABASE_URL = "sqlite:///./foodieai.db"
    engine = create_engine(
        DATABASE_URL,
        connect_args={"check_same_thread": False}
    )

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
