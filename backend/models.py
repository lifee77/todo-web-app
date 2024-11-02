from flask_sqlalchemy import SQLAlchemy
from flask_login import UserMixin
from werkzeug.security import generate_password_hash, check_password_hash

db = SQLAlchemy()

# User model
class User(db.Model, UserMixin):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(150), unique=True, nullable=False)
    password_hash = db.Column(db.String(128), nullable=False)  # Set nullable=False
    lists = db.relationship('TaskList', backref='user', lazy=True)

    def set_password(self, password):
        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password_hash, password)

class TaskList(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(255), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    tasks = db.relationship('Task', backref='task_list', lazy=True)

    def as_dict(self):
        return {
            'id': self.id,
            'name': self.name
        }

# Task model (with named foreign key for parent_id)
class Task(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(255), nullable=False)
    list_id = db.Column(db.Integer, db.ForeignKey('task_list.id'), nullable=False)
    parent_id = db.Column(db.Integer, db.ForeignKey('task.id'), nullable=True)
    children = db.relationship('Task', backref=db.backref('parent', remote_side=[id]), lazy=True)

    def as_dict(self):
        return {
            'id': self.id,
            'title': self.title,
            'list_id': self.list_id,
            'parent_id': self.parent_id,
            'children': [child.as_dict() for child in self.children]
        }