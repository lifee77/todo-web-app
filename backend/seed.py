from app import create_app
from models import db, TaskList, Task
from sqlalchemy import text  # Import text from SQLAlchemy

def seed_data():
    app = create_app()
    
    with app.app_context():
        # Delete existing data using the text() construct
        db.session.execute(text('DELETE FROM task'))
        db.session.execute(text('DELETE FROM task_list'))
        db.session.commit()
        
        # Create lists
        work_list = TaskList(name="Work Tasks")
        personal_list = TaskList(name="Personal Tasks")
        
        db.session.add(work_list)
        db.session.add(personal_list)
        db.session.commit()
        
        # Create tasks
        tasks = [
            Task(title="Complete project", list_id=work_list.id),
            Task(title="Review code", list_id=work_list.id),
            Task(title="Buy groceries", list_id=personal_list.id)
        ]
        
        db.session.add_all(tasks)
        db.session.commit()
        
        print("Data seeded successfully!")

if __name__ == "__main__":
    seed_data()
