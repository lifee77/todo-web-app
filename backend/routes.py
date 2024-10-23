from flask import Blueprint, jsonify, request
from models import TaskList, Task, db

main = Blueprint('main', __name__)

# Get all task lists
@main.route('/api/lists', methods=['GET'])
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
def get_tasks(list_id):
    task_list = TaskList.query.get_or_404(list_id)
    return jsonify([task.as_dict() for task in task_list.tasks])

# Add a new task to a list
@main.route('/api/lists/<int:list_id>/tasks', methods=['POST'])
def add_task(list_id):
    task_list = TaskList.query.get_or_404(list_id)
    data = request.get_json()
    new_task = Task(title=data['title'], list_id=list_id)
    db.session.add(new_task)
    db.session.commit()
    return jsonify(new_task.as_dict()), 201

# Update task status
@main.route('/api/tasks/<int:task_id>', methods=['PUT'])
def update_task(task_id):
    task = Task.query.get_or_404(task_id)
    data = request.get_json()
    task.completed = data.get('completed', task.completed)
    db.session.commit()
    return jsonify(task.as_dict())
