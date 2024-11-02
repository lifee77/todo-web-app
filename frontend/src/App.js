// App.js
import React, { useEffect, useState } from 'react';
import { Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { getCurrentUser, logoutUser, fetchLists, fetchTasks, createTaskList } from './services/api';
import Login from './components/Login';
import Register from './components/Register';
import TaskList from './components/TaskList';
import TaskForm from './components/TaskForm';
import ProtectedRoute from './components/ProtectedRoute';
import TaskListForm from './components/TaskListForm'; // Import TaskListForm

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoadingAuth, setIsLoadingAuth] = useState(true); // Renamed to avoid confusion with 'loading' state
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false); // Loading state for data fetching
  const [lists, setLists] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [selectedList, setSelectedList] = useState(null);
  
  const navigate = useNavigate();
  const location = useLocation();

  // Authentication check effect
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const userData = await getCurrentUser();
        if (userData) {
          setIsAuthenticated(true);
          await loadLists(); // Load lists after authentication
        } else {
          setIsAuthenticated(false);
        }
      } catch (error) {
        console.error('Auth error:', error);
        setIsAuthenticated(false);
      } finally {
        setIsLoadingAuth(false);
      }
    };

    checkAuth();
  }, []);

  // Load lists function
  const loadLists = async () => {
    try {
      setLoading(true);
      setError(null); // Clear any previous errors
      const listsData = await fetchLists();
      setLists(listsData);
    } catch (err) {
      console.error('Error loading lists:', err);
      setError('Error loading lists');
    } finally {
      setLoading(false);
    }
  };
    // Function to handle creating a new task list
    const handleCreateTaskList = async (name) => {
      try {
        setLoading(true);
        setError(null);
        const newTaskList = await createTaskList(name);
        setLists([...lists, newTaskList]); // Update the lists state
      } catch (err) {
        console.error('Error creating task list:', err);
        setError('Error creating task list');
      } finally {
        setLoading(false);
      }
    };

  // Handle login
  const handleLogin = async () => {
    try {
      setIsAuthenticated(true);
      await loadLists(); // Load lists after successful login
      navigate('/'); // Redirect to home page
    } catch (err) {
      console.error('Login error:', err);
      setError('Error during login');
    }
  };

  const loadTasks = async (listId) => {
    try {
      setLoading(true);
      setError(null);
      const tasksData = await fetchTasks(listId); // Fetch tasks for the selected list
      setTasks(tasksData);
      setSelectedList(listId);
    } catch (err) {
      console.error('Error loading tasks:', err);
      setError('Error loading tasks');
    } finally {
      setLoading(false);
    }
  };
  

  // Handle logout
  const handleLogout = async () => {
    try {
      await logoutUser();
      setIsAuthenticated(false);
      setLists([]);
      setTasks([]);
      setSelectedList(null);
      setError(null);
      navigate('/login');
    } catch (err) {
      console.error('Logout error:', err);
      setError('Error during logout');
    }
  };



  if (isLoadingAuth) {
    // Wait for authentication check to complete
    return <div>Loading...</div>;
  }

  return (
    <div className="App">
      <h1>Hierarchical Todo List App</h1>

      {error && (
        <div className="error-message" style={{ color: 'red', padding: '10px' }}>
          {error}
        </div>
      )}

      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<Login onLogin={handleLogin} />} />
        <Route path="/register" element={<Register onRegister={handleLogin} />} />

        {/* Protected Routes */}
        <Route
          path="/"
          element={
          <ProtectedRoute isAuthenticated={isAuthenticated}>
          <>
            {loading ? (
              <p>Loading...</p>
            ) : (
              <>
                <div className="task-list-section">
                  <h2>Task Lists</h2>
                  <TaskListForm onCreate={handleCreateTaskList} /> {/* Include the form here */}
                  {lists.length > 0 ? (
                    lists.map(list => (
                      <div
                        key={list.id}
                        onClick={() => loadTasks(list.id)}
                        style={{ cursor: 'pointer', padding: '5px' }}
                      >
                        {list.name}
                      </div>
                    ))
                  ) : (
                    <p>No lists available</p>
                  )}
                </div>
                {selectedList && (
                  <div className="task-section">
                    <TaskForm selectedList={selectedList} setTasks={setTasks} />
                    {tasks.length > 0 ? (
                      <TaskList tasks={tasks} setTasks={setTasks} selectedList={selectedList} />
                    ) : (
                      <p>No tasks available in this list</p> // Message for empty task lists
                    )}
                  </div>
                  
                )}
              </>
            )}
          </>
        </ProtectedRoute>
          }
        />

        {/* Catch-all Route */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
      <div>
        {isAuthenticated && (
          <button className="logout-button" onClick={handleLogout}>Logout</button>
        )}
        {error && <p>{error}</p>}
      </div>
    </div>
  );
}

export default App;
