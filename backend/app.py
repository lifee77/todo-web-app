from flask import Flask, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_cors import CORS
from config import Config
from flask_login import LoginManager
from models import db, User


migrate = Migrate()
login_manager = LoginManager()

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)

    # Initialize extensions
    db.init_app(app)
    migrate.init_app(app, db)
    login_manager.init_app(app)
    login_manager.login_view = 'main.login'
    login_manager.session_protection = "strong"

    # Enable CORS for all routes and allow requests from http://localhost:3000
    CORS(app, resources={r"/api/*": {"origins": "http://localhost:3000"}}, supports_credentials=True)


    # Import routes after db initialization
    from routes import main
    app.register_blueprint(main, url_prefix='/api')
    
    # Create tables
    with app.app_context():
        db.create_all()

    # Define root route
    @app.route('/')
    def index():
        return jsonify({"message": "Welcome to the Hierarchical Todo List App!"})
    
   # Unauthorized handler
    @login_manager.unauthorized_handler
    def unauthorized():
        return jsonify({'error': 'Unauthorized'}), 401

    return app

@login_manager.user_loader
def load_user(user_id):
    return User.query.get(int(user_id))

if __name__ == '__main__':
    app = create_app()        
    app.run(debug=True, host='0.0.0.0')
