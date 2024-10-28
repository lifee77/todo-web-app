import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { fetchLists, fetchTasks } from './services/api';
import TaskList from './components/TaskList';
import TaskForm from './components/TaskForm';
import Login from './components/Login';
import Register from './components/Register';
import Logout from './components/Logout';

const App = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [lists, setLists] = useState([]);
    const [selectedList, setSelectedList] = useState(null);
    const [tasks, setTasks] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    const handleLogin = () => {
        setIsAuthenticated(true);
    };

    const handleLogout = () => {
        setIsAuthenticated(false);
    };

    const handleTaskDeleted = (taskId) => {
        setTasks(tasks.filter(task => task.id !== taskId));
    };

    useEffect(() => {
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

        if (isAuthenticated) {
            loadLists();
        }
    }, [isAuthenticated]);

    const loadTasks = async (listId) => {
        try {
            const data = await fetchTasks(listId);
            setTasks(data);
            setSelectedList(listId);
            setError(null);
        } catch (err) {
            setError(err.message || 'Error fetching tasks');
            setTasks([]);
        }
    };

    return (
        <Router>
            <div className="App">
                <h1>Hierarchical Todo List App</h1>
                
                {error && (
                    <div className="error-message" style={{ color: 'red', padding: '10px' }}>
                        {error}
                    </div>
                )}

                {isAuthenticated && (
                    <>
                        {loading ? (
                            <p>Loading task lists...</p>
                        ) : (
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
                        )}

                        {selectedList && (
                            <div className="task-section">
                                <TaskForm selectedList={selectedList} setTasks={setTasks} />
                                <TaskList tasks={tasks} setTasks={setTasks} selectedList={selectedList} />
                            </div>
                        )}
                    </>
                )}

                <Routes>
                    <Route path="/login" element={isAuthenticated ? <Navigate to="/" /> : <Login onLogin={handleLogin} />} />
                    <Route path="/register" element={isAuthenticated ? <Navigate to="/" /> : <Register onRegister={handleLogin} />} />
                    <Route path="/logout" element={isAuthenticated ? <Logout onLogout={handleLogout} /> : <Navigate to="/login" />} />
                    <Route path="/" element={isAuthenticated ? (
                        <>
                            <button onClick={handleLogout}>Logout</button>
                        </>
                    ) : <Navigate to="/login" />} />
                </Routes>
            </div>
        </Router>
    );
};

export default App;