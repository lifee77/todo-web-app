# centralizing all configuration settings in one place. This makes it easier to manage and update settings across the application.
#Separationofconcerns.
import os
from datetime import timedelta

# Define BASE_DIR
BASE_DIR = os.path.abspath(os.path.dirname(__file__))
# Define Config class
class Config:
    SECRET_KEY = os.getenv('SECRET_KEY', 'mysecretkey')
    SQLALCHEMY_DATABASE_URI = f"sqlite:///{os.path.join(BASE_DIR, 'instance', 'todo.db')}"
    SQLALCHEMY_TRACK_MODIFICATIONS = False  # Set to True in production with HTTPS
    SESSION_COOKIE_SECURE = False  # Set to True if using HTTPS
    CORS_ORIGINS = ['http://localhost:3000']
    LOGIN_DISABLED = False
    PERMANENT_SESSION_LIFETIME = timedelta(hours=1)