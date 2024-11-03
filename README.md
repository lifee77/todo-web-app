# Hierarchical Todo List App

## Description

The Hierarchical Todo List App is a web application that enables users to manage their tasks in a structured, hierarchical way. Users can create multiple task lists and organize their tasks within each list, with support for up to three levels of sub-tasks. Each user has their own account and can only access and modify their own tasks. The app provides essential task management features, including task creation, editing, deletion, completion, and movement across lists. The UI is designed to allow users to expand/collapse task hierarchies to focus on key tasks.

## Features

- **User Authentication**: Sign up, log in, and manage your own tasks.
- **Multiple Task Lists**: Create and manage multiple lists to categorize tasks.
- **Hierarchical Tasks**: Each list can contain tasks, with sub-tasks up to three levels deep.
- **Task Management**:
  - **CRUD Operations**: Add, edit, delete, and mark tasks as complete.
  - **Expand/Collapse Tasks**: Hide or show subtasks within tasks for better focus.
  - **Task Movement**: Move top-level tasks between lists.
- **Data Persistence**: All tasks and lists are saved in the database, so users can return to their data anytime.
- **Visual Feedback**: Highlight the selected list, and display tasks neatly under each list.

## Installation

### Requirements

- **Backend**: Python 3.6+ with Flask and SQLAlchemy
- **Frontend**: Node.js and npm (for managing React dependencies)
- **Virtual Environment**: Recommended for Python dependencies

### Setup

#### Backend (Flask)

1. Navigate to the backend directory (after cloning the repo or after unzipping the file):
   ```bash
   git clone https://github.com/lifee77/todo-web-app
   cd backend
   ```

2. Set up a virtual environment:
   ```bash
   python3 -m venv venv
   source venv/bin/activate  # For macOS/Linux
   # venv\Scripts\activate.bat  # For Windows
   ```

3. Install the required dependencies:
   ```bash
   pip install -r requirements.txt
   ```

4. Run the Flask application:
   ```bash
   python app.py
   ```

#### Frontend (React)

1. Navigate to the frontend directory:
   ```bash
   cd ../frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the frontend server:
   ```bash
   npm start
   ```

### Database Configuration

The app uses SQLite for easy local setup. To use a different database, update the connection settings in `config.py` for the Flask backend.

## Usage

1. **Login/Signup**: Access the app by creating an account or logging in with existing credentials.
2. **Create Lists and Tasks**: Add lists to categorize your tasks, and create tasks with subtasks (up to 3 levels deep).
3. **Manage Tasks**:
   - **Mark as Complete**: Complete tasks will be removed or hidden.
   - **Expand/Collapse**: Focus on key tasks by expanding or collapsing subtasks.
   - **Move Tasks**: Move top-level tasks between lists as needed.
4. **Delete Lists**: Select a list to reveal a delete option, allowing you to remove an entire list if desired.

## Project Structure

```plaintext
TODO-WEB-APP/
├── backend/
│   ├── __pycache__/
│   ├── instance/
│   │   └── todo.db              # SQLite database file
│   ├── migrations/              # Database migrations folder
│   ├── venv/                    # Virtual environment (not included in the Zip)
│   ├── .gitignore               # Ignore unnecessary files in Git
│   ├── alembic.ini              # Alembic configuration for migrations
│   ├── app.py                   # Main Flask application
│   ├── config.py                # Configuration settings
│   ├── models.py                # Database models
│   ├── requirements.txt         # Python dependencies
│   └── routes.py                # API endpoints

├── frontend/
│   ├── node_modules/            # Node.js modules (not included in the Zip)
│   ├── public/
│   │   └── index.html           # Main HTML file for the frontend
│   ├── src/
│   │   ├── components/
│   │   │   ├── Login.js         # Login component
│   │   │   ├── Logout.js        # Logout component
│   │   │   ├── ProtectedRoute.js # Route protection component
│   │   │   ├── Register.js      # Registration component
│   │   │   ├── Task.js          # Task component
│   │   │   ├── TaskForm.js      # Task form for adding/editing tasks
│   │   │   ├── TaskItem.js      # Individual task item component
│   │   │   ├── TaskList.css     # CSS for TaskList component
│   │   │   ├── TaskList.js      # Main task list component
│   │   │   └── TaskListForm.js  # Form to add new task lists
│   │   ├── services/
│   │   │   └── api.js           # API service functions for backend communication
│   │   ├── App.js               # Main application component
│   │   ├── index.css            # Global styles
│   │   └── index.js             # Entry point for React
│   ├── .gitignore               # Ignore unnecessary files in Git
│   ├── package-lock.json        # Lock file for Node dependencies
│   ├── package.json             # Node.js dependencies and scripts

└── README.md                    # Project documentation
```

## How the App Works

### User Interaction with the Frontend

1. **User Authentication**:
   - The user accesses the app and is presented with options to log in or sign up.
   - Upon submitting the login or registration form, the frontend sends a POST request to the backend API (`/api/login` or `/api/register`).
   - The backend processes the request, authenticates the user, and returns a response with user data or an error message.
   - The frontend stores the authentication token (if provided) and updates the UI to reflect the logged-in state.

2. **Creating and Managing Task Lists**:
   - The user can create a new task list by entering a name and submitting the form.
   - The frontend sends a POST request to the backend API (`/api/lists`) with the list name.
   - The backend creates the new list in the database and returns the list data.
   - The frontend updates the UI to display the new list.

3. **Adding and Managing Tasks**:
   - The user selects a task list and adds a new task by entering a title and submitting the form.
   - The frontend sends a POST request to the backend API (`/api/lists/<list_id>/tasks`) with the task details.
   - The backend creates the new task in the database and returns the task data.
   - The frontend updates the UI to display the new task within the selected list.
   - The user can also edit, delete, or mark tasks as complete. These actions send PUT or DELETE requests to the backend API (`/api/tasks/<task_id>`).

4. **Task Hierarchy and Movement**:
   - The user can create sub-tasks by selecting a parent task and adding a new task under it.
   - The frontend sends a POST request to the backend API with the parent task ID.
   - The backend creates the sub-task in the database and returns the task data.
   - The frontend updates the UI to display the sub-task under the parent task.
   - The user can move top-level tasks between lists by selecting a task and choosing a new list.
   - The frontend sends a PUT request to the backend API (`/api/tasks/<task_id>/move`) with the new list ID.
   - The backend updates the task's list in the database and returns the updated task data.
   - The frontend updates the UI to reflect the task's new location.

### Backend Processing and Database Interaction

1. **API Endpoints**:
   - The backend API is built using Flask and provides endpoints for user authentication, task list management, and task management.
   - Each endpoint processes incoming requests, interacts with the database, and returns appropriate responses.

2. **Database Operations**:
   - The backend uses SQLAlchemy to interact with the SQLite database.
   - When a request is received, the backend performs the necessary database operations (e.g., creating a new user, adding a task, updating a task's details).
   - The database operations ensure data persistence, allowing users to return to their tasks and lists at any time.

3. **Response Handling**:
   - After processing a request, the backend sends a response to the frontend with the requested data or an error message.
   - The frontend updates the UI based on the response, providing visual feedback to the user.

### Example Workflow

1. **User Logs In**:
   - The user enters their credentials and clicks "Log In".
   - The frontend sends a POST request to `/api/login`.
   - The backend verifies the credentials, and if valid, returns user data.
   - The frontend stores the authentication token and updates the UI to show the user's task lists.

2. **User Creates a Task List**:
   - The user enters a list name and clicks "Create List".
   - The frontend sends a POST request to `/api/lists` with the list name.
   - The backend creates the list in the database and returns the list data.
   - The frontend updates the UI to display the new list.

3. **User Adds a Task**:
   - The user selects a list, enters a task title, and clicks "Add Task".
   - The frontend sends a POST request to `/api/lists/<list_id>/tasks` with the task details.
   - The backend creates the task in the database and returns the task data.
   - The frontend updates the UI to display the new task within the selected list.

4. **User Moves a Task**:
   - The user selects a task and chooses a new list to move it to.
   - The frontend sends a PUT request to `/api/tasks/<task_id>/move` with the new list ID.
   - The backend updates the task's list in the database and returns the updated task data.
   - The frontend updates the UI to reflect the task's new location.

This workflow ensures a seamless user experience, with real-time updates and data persistence across sessions.



## API Endpoints

## Authentication

- **POST** `/api/register`: Register a new user.
- **POST** `/api/login`: Log in a user.
- **POST** `/api/logout`: Log out the current user.
- **GET** `/api/current_user`: Fetch information on the current user.

## Task List Management

- **GET** `/api/lists`: Fetch all task lists for the authenticated user.
- **POST** `/api/lists`: Create a new task list.

## Task Management

- **GET** `/api/lists/<list_id>/tasks`: Fetch tasks within a specific list.
- **POST** `/api/lists/<list_id>/tasks`: Add a new task to a list.
- **PUT** `/api/tasks/<task_id>`: Update a task's title.
- **DELETE** `/api/tasks/<task_id>`: Delete a specific task.
- **PUT** `/api/tasks/<task_id>/move`: Move a task to another list or change its parent task.

## Usage Notes

- **Authentication**: All task and list management endpoints require the user to be authenticated.
- **Task Hierarchy**: Tasks can contain sub-tasks (no limit is set)
- **Task Movement**: Only top-level tasks can be moved to different lists.

## Known Issues

- Task movement is only enabled for top-level tasks.
- The forgot password functionality is not currently implemented.

## Future Enhancements

- **Drag-and-Drop**: Improve task movement with drag-and-drop support for better UX.
- **Sorting/Filtering**: Add task filtering or sorting by priority and due dates.
- **Improved UI**: Enhance the visual design to make hierarchical tasks more user-friendly.

## Demo Video

For a quick demonstration of the app and its features, watch [this video](#) (link to video demo). This includes:
- User registration and login
- Task list and task creation
- Task hierarchy management and completion
- Task movement between lists


## AI  Statement
In this project, I utilized GitHub Copilot and ChatGPT-4 to assist in generating the majority of the code. I actively reviewed, understood, and integrated the AI-generated code into the appropriate files, ensuring it met the project's requirements. Throughout the process, I refined my prompts to request specific changes when necessary, and I critically examined the code suggestions, challenging and modifying them as needed to fit the project’s architecture and functionality. This collaborative approach helped streamline development while maintaining a clear understanding of the codebase.