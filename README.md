
# Hierarchical Todo List App

## Description

This web application allows users to create hierarchical to-do lists with multiple levels of tasks. Each user can create and manage their own lists, add tasks with sub-tasks (up to 3 levels deep), and organize tasks by marking them as complete or moving them between lists. The app supports basic CRUD (Create, Read, Update, Delete) operations for lists and tasks, and provides the ability to collapse/expand tasks to focus on key items.

## Features

- **User Authentication**: Each user can log in, create an account, and manage their own tasks.
- **Create Multiple Lists**: Users can create multiple task lists.
- **Hierarchical Tasks**: Lists can contain tasks, tasks can contain sub-tasks, and sub-tasks can contain sub-sub-tasks (up to 3 levels deep).
- **Task Management**:
  - Add/Edit/Delete tasks and lists.
  - Mark tasks as complete.
  - Collapse/Expand tasks to hide or show sub-tasks.
  - Move tasks between lists.
- **Data Persistence**: Tasks and lists are saved to the database, ensuring data is retained across sessions.

## Installation

### Requirements

- Python 3.6+
- Node.js (optional, if using Node for backend)
- Virtual environment tool (`venv`)

### Setup

#### For Flask (Python Backend)

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd hierarchical-todo-app
   ```

2. Set up a virtual environment:
   ```bash
   python3 -m venv venv
   source venv/bin/activate  # For macOS/Linux
   # venv\Scripts\activate.bat  # For Windows
   ```

3. Install the required packages:
   ```bash
   pip install -r requirements.txt
   ```

4. Run the app:
   ```bash
   python3 app.py
   ```

#### For Node.js (Node Backend Alternative)

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd hierarchical-todo-app
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the server:
   ```bash
   npm start
   ```

### Database

By default, the app uses SQLite for persistence. To use another database like PostgreSQL or MongoDB, modify the connection settings in the configuration file (e.g., `config.py` for Flask, or `db.js` for Node.js).

## Usage

1. **Login/Signup**: Users must log in or sign up to access the app.
2. **Create Lists**: Users can create multiple to-do lists.
3. **Add Tasks**: Inside each list, users can create tasks, sub-tasks, and sub-sub-tasks.
4. **Task Operations**:
   - **Mark Complete**: Click the checkbox next to a task to mark it as complete.
   - **Expand/Collapse**: Click the toggle to show or hide subtasks under a task.
   - **Move Tasks**: Drag and drop a task to move it to another list.
5. **Logout**: Logout is available from the navigation bar.

## Demo

Watch a [demo video here](#need to add link). The demo walks through the following:
- Creating a new user.
- Logging in.
- Creating a list and adding hierarchical tasks.
- Collapsing and expanding tasks.
- Marking tasks as complete.
- Moving tasks between lists.

## Code Structure

```plaintext
hierarchical-todo-app/
├── backend/ (Flask)
│   ├── app.py
│   ├── models.py
│   ├── routes.py
│   ├── config.py
│   └── requirements.txt
└── frontend/ (React)
    ├── public/
    ├── src/
    │   ├── components/
    │   ├── services/ (to handle API calls)
    │   ├── App.js
    │   └── index.js
    └── package.json
```


## Known Issues

- Task movements are limited to top-level tasks only.
- Forgot password functionality is not implemented.

## Future Enhancements

- Implement drag-and-drop for easier task movement between lists.
- Add sorting and filtering options for tasks based on priority or due date.
- Improve UI for better task visualization.
