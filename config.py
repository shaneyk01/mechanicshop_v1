class DevelopmentConfig:
    SQLALCHEMY_DATABASE_URI='mysql+mysqlconnector://root:Sageyk01!2024@localhost/mechanicshopapi_V1'
    DEBUG = True
    cache_type ='SimpleCache'
    CACHE_DEFAULT_TIMEOUT = 300
    
class TestingConfig:
        SQLALCHEMY_DATABASE_URI = 'sqlite:///:testing.db'
        DEBUG = True
        CACHE_TYPE= 'SimpleCache'