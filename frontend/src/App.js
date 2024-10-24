import React, { useState, useEffect } from 'react';
import axios from 'axios';
import TaskList from './components/TaskList';
import TaskForm from './components/TaskForm';

// Configure axios defaults
axios.defaults.baseURL = 'http://127.0.0.1:5000';
axios.defaults.withCredentials = true;
axios.defaults.headers.common['Content-Type'] = 'application/json';

const App = () => {
  const [lists, setLists] = useState([]);
  const [selectedList, setSelectedList] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [error, setError] = useState(null);  //error state
  const [loading, setLoading] = useState(true); // Loading state

  // Fetch all task lists on load
  useEffect(() => {
    const fetchLists = async () => {
      setLoading(true); // Start loading
      try {
        console.log('Fetching lists...');
        const response = await axios.get('/api/lists');
        console.log('Response:', response.data);
        setLists(response.data);
        setError(null);
      } catch (err) {
        console.error('Full error:', err);
        console.error('Error response:', err.response);
        console.error('Error message:', err.message);
        setError(err.response?.data?.message || 'Error fetching task lists');
        setLists([]);
      } finally {
        setLoading(false); // End loading
      }
    };

    fetchLists();
  }, []);

    // Fetch tasks when a list is selected
    const fetchTasks = async (listId) => {
      try {
        const response = await axios.get(`/api/lists/${listId}/tasks`);
        setTasks(response.data);
        setSelectedList(listId);
        setError(null);
      } catch (err) {
        console.error('Error fetching tasks:', err);
        setError(err.response?.data?.message || 'Error fetching tasks');
        setTasks([]);
      }
    };
  
    return (
      <div className="App">
        <h1>Hierarchical Todo List App</h1>
        
        {error && (
          <div className="error-message" style={{ color: 'red', padding: '10px' }}>
            {error}
          </div>
        )}
  
        {loading ? ( // Show loading indicator
          <p>Loading task lists...</p>
        ) : (
          <div className="task-list-section">
            <h2>Task Lists</h2>
            {lists.length > 0 ? (
              lists.map(list => (
                <div 
                  key={list.id} 
                  onClick={() => fetchTasks(list.id)}
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
      </div>
    );
  };
  
  export default App;