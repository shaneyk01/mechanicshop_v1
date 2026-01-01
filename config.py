class DevelopmentConfig:
    SQLALCHEMY_DATABASE_URI='mysql+mysqlconnector://root:Sageyk01!2024@localhost/mechanic_shop_v1'
    DEBUG = True
    cache_type ='SimpleCache'
    CACHE_DEFAULT_TIMEOUT = 300