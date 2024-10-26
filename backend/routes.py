from flask import Blueprint, request, jsonify
from werkzeug.security import generate_password_hash, check_password_hash
from flask_login import login_user, logout_user, login_required, current_user
from models import db, User

main = Blueprint('main', __name__)

@main.route('/api/register', methods=['POST'])
def register():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')

    if not username or not password:
        return jsonify({"error": "Username and password are required"}), 400

    user = User.query.filter_by(username=username).first()
    if user:
        return jsonify({"error": "User already exists"}), 400

    new_user = User(username=username)
    new_user.set_password(password)
    db.session.add(new_user)
    db.session.commit()

    return jsonify({"message": "User registered successfully"}), 201

@main.route('/api/login', methods=['POST'])
def login():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')

    user = User.query.filter_by(username=username).first()
    if user and user.check_password(password):
        login_user(user)
        return jsonify({"message": "Logged in successfully"}), 200

    return jsonify({"error": "Invalid username or password"}), 401

@main.route('/api/logout', methods=['POST'])
@login_required
def logout():
    logout_user()
    return jsonify({"message": "Logout successful"}), 200

# Get all task lists
@main.route('/api/lists', methods=['GET'])
@login_required
def get_lists():
    try:
        task_lists = TaskList.query.all()
        print("Task lists found:", task_lists)  # Add this debug line
        return jsonify([task_list.as_dict() for task_list in task_lists])
    except Exception as e:
        print("Error in get_lists:", str(e))  # Add this debug line
        return jsonify({"message": str(e)}), 500

# Get tasks for a specific list
@main.route('/api/lists/<int:list_id>/tasks', methods=['GET'])
@login_required
def get_tasks(list_id):
    task_list = TaskList.query.get_or_404(list_id)
    return jsonify([task.as_dict() for task in task_list.tasks])

# Add a new task to a list
@main.route('/api/lists/<int:list_id>/tasks', methods=['POST'])
@login_required
def add_task(list_id):
    data = request.get_json()
    task_list = TaskList.query.get_or_404(list_id)
    new_task = Task(description=data['description'], list_id=list_id)
    db.session.add(new_task)
    db.session.commit()
    return jsonify(new_task.as_dict()), 201


# Delete a task
@main.route('/api/tasks/<int:task_id>', methods=['DELETE'])
@login_required
def delete_task(task_id):
    task = Task.query.get_or_404(task_id)
    db.session.delete(task)
    db.session.commit()
    return jsonify({"message": "Task deleted"}), 200