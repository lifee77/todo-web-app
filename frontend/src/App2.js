import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { fetchLists, fetchTasks } from './services/api';
import TaskList from './components/TaskList';
import TaskForm from './components/TaskForm';
import Login from './components/Login';
import Register from './components/Register';
import Logout from './components/Logout';

axios.defaults.baseURL = 'http://127.0.0.1:5000/api';
axios.defaults.withCredentials = true;
axios.defaults.headers.common['Content-Type'] = 'application/json';

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [lists, setLists] = useState([]);
  const [selectedList, setSelectedList] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleLogin = () => {
    setIsAuthenticated(true);
    loadLists();
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setLists([]);
    setTasks([]);
    setSelectedList(null);
  };

  const loadLists = async () => {
    setLoading(true);
    try {
      const data = await fetchLists();
      setLists(data);
      setError(null);
    } catch (err) {
      setError(err.message || 'Error fetching task lists');
      setLists([]);
    } finally {
      setLoading(false);
    }
  };

  const loadTasks = async (listId) => {
    setLoading(true);
    try {
      const data = await fetchTasks(listId);
      setTasks(data);
      setSelectedList(listId);
      setError(null);
    } catch (err) {
      setError(err.message || 'Error fetching tasks');
      setTasks([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await axios.get('/current_user', { withCredentials: true });
        if (response.status === 200 && response.data.username) {
          setIsAuthenticated(true);
          loadLists();
        } else {
          setIsAuthenticated(false);
        }
      } catch (err) {
        setIsAuthenticated(false);
      }
    };
    checkAuth();
  }, []);

  return (
    <Router>
      <div className="App">
        <h1>Hierarchical Todo List App</h1>

        {error && (
          <div className="error-message" style={{ color: 'red', padding: '10px' }}>
            {error}
          </div>
        )}

        {isAuthenticated ? (
          <>
            <button onClick={handleLogout}>Logout</button>
            {loading ? (
              <p>Loading...</p>
            ) : (
              <>
                <div className="task-list-section">
                  <h2>Task Lists</h2>
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
                    <TaskList tasks={tasks} setTasks={setTasks} selectedList={selectedList} />
                  </div>
                )}
              </>
            )}
          </>
        ) : (
          <Routes>
            <Route path="/login" element={<Login onLogin={handleLogin} />} />
            <Route path="/register" element={<Register onRegister={handleLogin} />} />
            <Route path="*" element={<Navigate to="/login" />} />
          </Routes>
        )}
      </div>
    </Router>
  );
};

export default App;
