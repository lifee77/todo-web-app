#routes.py
from flask import Blueprint, request, jsonify, session, make_response
from werkzeug.security import generate_password_hash, check_password_hash
from flask_login import login_user, logout_user, login_required, current_user, LoginManager
from models import db, User, Task, TaskList
from datetime import timedelta

main = Blueprint('main', __name__)


# User registration
@main.route('/register', methods=['POST'])
def register():
    try:
        data = request.get_json()
        username = data['username']
        password = data['password']

        # Check if the username already exists
        if User.query.filter_by(username=username).first():
            return jsonify({'message': 'Username already exists'}), 409
        
        # Create a new user
        new_user = User(username=username)
        new_user.set_password(password)
        db.session.add(new_user)
        db.session.commit()

        return jsonify({'message': 'User registered successfully'}), 201
    except Exception as e:
        # Log the error for debugging
        print(f"Error in registration: {str(e)}")
        return jsonify({'message': 'Error registering user', 'error': str(e)}), 500


# User login
@main.route('/login', methods=['POST'])
def login():
    if request.method == 'GET':
        return jsonify({"message": "Please login with POST request"}), 405
    try:
        data = request.get_json()
        user = User.query.filter_by(username=data['username']).first()

        if user and user.check_password(data['password']):
            login_user(user)  # This sets up the session
            print(f"User {user.username} logged in. Session: {session}")
            return jsonify({"message": "Logged in"}), 200
        else:
            return jsonify({"message": "Invalid credentials"}), 401
    except Exception as e:
        print(f"Error in login: {str(e)}")
        return jsonify({'message': 'Error during login', 'error': str(e)}), 500


# User logout
@main.route('/logout', methods=['POST'])
@login_required
def logout():
    try:
        logout_user()  # Clears the session
        return jsonify({"message": "Logged out"}), 200
    except Exception as e:
        print(f"Error in logout: {str(e)}")
        return jsonify({'message': 'Error during logout', 'error': str(e)}), 500


# Get current user information
@main.route('/current_user', methods=['GET'])
@login_required
def get_current_user():
    if current_user.is_authenticated:
        return jsonify({'username': current_user.username}), 200
    else:
        return jsonify({'message': 'Not authenticated'}), 401


# Get task lists (requires authentication)
@main.route('/lists', methods=['GET'])
@login_required
def get_lists():
    try:
        if not current_user.is_authenticated:
            return jsonify({"message": "Not authenticated"}), 401
        
        task_lists = TaskList.query.filter_by(user_id=current_user.id).all()
        return jsonify([task_list.as_dict() for task_list in task_lists])
    except Exception as e:
        print(f"Error fetching lists: {str(e)}")  # Log the error for debugging
        return jsonify({"message": str(e)}), 500

# Create a new task list (requires authentication)
@main.route('/lists', methods=['POST'])
@login_required
def create_task_list():
    try:
        data = request.get_json()
        name = data.get('name')

        if not name:
            return jsonify({'message': 'Task list name is required'}), 400

        # Create a new TaskList associated with the current user
        new_task_list = TaskList(name=name, user_id=current_user.id)
        db.session.add(new_task_list)
        db.session.commit()

        return jsonify(new_task_list.as_dict()), 201
    except Exception as e:
        print(f"Error creating task list: {str(e)}")
        return jsonify({'message': 'Error creating task list', 'error': str(e)}), 500

# Get tasks for a specific list (requires authentication)
@main.route('/lists/<int:list_id>/tasks', methods=['GET'])
@login_required
def get_tasks(list_id):
    try:
        # Fetch the task list owned by the current user
        task_list = TaskList.query.filter_by(id=list_id, user_id=current_user.id).first()
        if not task_list:
            return jsonify({"message": "Task list not found"}), 404

        # Fetch tasks associated with the list
        tasks = Task.query.filter_by(list_id=list_id, parent_id=None).all()
        return jsonify([task.as_dict() for task in tasks]), 200
    except Exception as e:
        print(f"Error fetching tasks: {str(e)}")
        return jsonify({'message': str(e)}), 500



# Add a new task to a specific list (requires authentication)
@main.route('/lists/<int:list_id>/tasks', methods=['POST'])
@login_required
def add_task(list_id):
    try:
        data = request.get_json()
        task_list = TaskList.query.filter_by(id=list_id, user_id=current_user.id).first()
        if not task_list:
            return jsonify({"message": "Task list not found"}), 404
        new_task = Task(title=data['title'], list_id=list_id, parent_id=data.get('parent_id'))
        db.session.add(new_task)
        db.session.commit()
        return jsonify(new_task.as_dict()), 201
    except Exception as e:
        print(f"Error adding task: {str(e)}")  # Log the error for debugging
        return jsonify({'message': str(e)}), 500

# Update a task's title (requires authentication)
@main.route('/tasks/<int:task_id>', methods=['PUT'])
@login_required
def update_task(task_id):
    try:
        data = request.get_json()
        new_title = data.get('title')
        if not new_title:
            return jsonify({'message': 'Title is required'}), 400

        task = Task.query.get_or_404(task_id)
        # Ensure the task belongs to the current user
        task_list = TaskList.query.filter_by(id=task.list_id, user_id=current_user.id).first()
        if not task_list:
            return jsonify({"message": "Task not found"}), 404

        task.title = new_title
        db.session.commit()
        return jsonify({"message": "Task updated successfully"}), 200
    except Exception as e:
        print(f"Error updating task: {str(e)}")  # Log the error for debugging
        return jsonify({'message': str(e)}), 500



# Delete a task (requires authentication)
@main.route('/tasks/<int:task_id>', methods=['DELETE'])
@login_required
def delete_task(task_id):
    try:
        task = Task.query.get_or_404(task_id)
        task_list = TaskList.query.filter_by(id=task.list_id, user_id=current_user.id).first()
        if not task_list:
            return jsonify({"message": "Task not found"}), 404
        db.session.delete(task)
        db.session.commit()
        return jsonify({"message": "Task deleted"}), 200
    except Exception as e:
        print(f"Error deleting task: {str(e)}")  # Log the error for debugging
        return jsonify({'message': str(e)}), 500


# Move a task (requires authentication)
@main.route('/tasks/<int:task_id>/move', methods=['PUT'])
@login_required
def move_task(task_id):
    try:
        data = request.get_json()
        new_list_id = data.get('newListId')
        new_parent_id = data.get('newParentId')
        task = Task.query.get_or_404(task_id)

        # Ensure the task belongs to the current user
        task_list = TaskList.query.filter_by(id=task.list_id, user_id=current_user.id).first()
        if not task_list:
            return jsonify({"message": "Task not found"}), 404

        if new_list_id:
            new_task_list = TaskList.query.filter_by(id=new_list_id, user_id=current_user.id).first()
            if not new_task_list:
                return jsonify({"message": "New task list not found"}), 404
            task.list_id = new_list_id

        if new_parent_id is not None:
            task.parent_id = new_parent_id

        db.session.commit()
        return jsonify({"message": "Task moved successfully"}), 200
    except Exception as e:
        print(f"Error moving task: {str(e)}")  # Log the error for debugging
        return jsonify({'message': str(e)}), 500

