
import os


class DevelopmentConfig:
    # Check for DATABASE_URL first (for Render/cloud), then fallback to SQLite
    SQLALCHEMY_DATABASE_URI = os.environ.get("DATABASE_URL") or 'sqlite:///local.db'
    DEBUG = True
    CACHE_TYPE ='SimpleCache'
    CACHE_DEFAULT_TIMEOUT = 300
    
class TestingConfig:
    SQLALCHEMY_DATABASE_URI = 'sqlite:///:testing.db'
    DEBUG = True
    CACHE_TYPE= 'SimpleCache'
        

class ProductionConfig:
   # For Render deployment - uses PostgreSQL with psycopg2-binary
   SQLALCHEMY_DATABASE_URI= os.environ.get("DATABASE_URL") or os.environ.get("SQLALCHEMY_DATABASE_URI")
   CACHE_TYPE = 'SimpleCache'