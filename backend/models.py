# models.py
# This file defines the database models for the application using SQLAlchemy.
# It includes models for User, TaskList, and Task, along with their relationships and methods.

from flask_sqlalchemy import SQLAlchemy
from flask_login import UserMixin
from werkzeug.security import generate_password_hash, check_password_hash

db = SQLAlchemy()

# User model represents a user in the application
class User(db.Model, UserMixin):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(150), unique=True, nullable=False)
    password_hash = db.Column(db.String(128), nullable=False)  # Password hash for user authentication
    lists = db.relationship('TaskList', backref='user', lazy=True)  # One-to-many relationship with TaskList

    # Method to set the user's password
    def set_password(self, password):
        self.password_hash = generate_password_hash(password)

    # Method to check the user's password
    def check_password(self, password):
        return check_password_hash(self.password_hash, password)

# TaskList model represents a list of tasks
class TaskList(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(255), nullable=False)  # Name of the task list
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)  # Foreign key to User
    tasks = db.relationship('Task', backref='task_list', lazy=True)  # One-to-many relationship with Task

    # Method to return the task list as a dictionary
    def as_dict(self):
        return {
            'id': self.id,
            'name': self.name
        }

# Task model represents an individual task
class Task(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(255), nullable=False)  # Title of the task
    completed = db.Column(db.Boolean, default=False)  # Completion status of the task
    list_id = db.Column(db.Integer, db.ForeignKey('task_list.id'), nullable=False)  # Foreign key to TaskList
    parent_id = db.Column(db.Integer, db.ForeignKey('task.id'), nullable=True)  # Self-referential foreign key for parent task
    children = db.relationship('Task', backref=db.backref('parent', remote_side=[id]), lazy=True)  # One-to-many relationship with child tasks

    # Method to return the task as a dictionary
    def as_dict(self):
        return {
            'id': self.id,
            'title': self.title,
            'completed': self.completed,
            'list_id': self.list_id,
            'parent_id': self.parent_id,
            'children': [child.as_dict() for child in self.children]
        }