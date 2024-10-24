from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

class TaskList(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    tasks = db.relationship('Task', backref='list', lazy=True)
    
    def as_dict(self):
        return {
            'id': self.id,
            'name': self.name
        }

class Task(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(200), nullable=False)
    completed = db.Column(db.Boolean, default=False)
    list_id = db.Column(db.Integer, db.ForeignKey('task_list.id'), nullable=False)
    
    def as_dict(self):
        return {
            'id': self.id,
            'title': self.title,
            'completed': self.completed,
            'list_id': self.list_id
        }