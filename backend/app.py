from flask import Flask, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_cors import CORS
from config import Config
from models import db


migrate = Migrate()

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)

    # Initialize extensions
    db.init_app(app)
    migrate.init_app(app, db)

    # Enable CORS for all routes and allow requests from http://localhost:3000
    #CORS(app, resources={r"/*": {"origins": ["http://localhost:3000", "http://127.0.0.1:3000"], "methods": ["GET", "POST", "PUT", "DELETE"], "allow_headers": ["Content-Type"]}})
    CORS(app, resources={r"/api/*": {"origins": "http://localhost:3000", "supports_credentials": True}})
    # Import routes after db initialization
    from routes import main
    app.register_blueprint(main)
    
    # Create tables
    with app.app_context():
        db.create_all()

    # Define root route
    @app.route('/')
    def index():
        return jsonify({"message": "Welcome to the Hierarchical Todo List App!"})

    return app

if __name__ == '__main__':
    app = create_app()        
    app.run(debug=True, host='0.0.0.0')

