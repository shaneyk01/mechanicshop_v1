
import os


class DevelopmentConfig:
    SQLALCHEMY_DATABASE_URI='mysql+mysqlconnector://root:Sageyk01!2024@localhost/mechanicshopapi_V1'
    DEBUG = True
    CACHE_TYPE ='SimpleCache'
    CACHE_DEFAULT_TIMEOUT = 300
    
class TestingConfig:
        SQLALCHEMY_DATABASE_URI = 'sqlite:///:testing.db'
        DEBUG = True
        CACHE_TYPE= 'SimpleCache'
        
class ProductionConfig:
    uri = os.environ.get("DATABASE_URL")  # Render provides DATABASE_URL

    # Fix Render's postgres:// → postgresql:// issue
    if uri and uri.startswith("postgres://"):
        uri = uri.replace("postgres://", "postgresql://", 1)

    SQLALCHEMY_DATABASE_URI = uri
    CACHE_TYPE = "SimpleCache"
