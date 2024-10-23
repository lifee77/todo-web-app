import React, { useState } from 'react';
import axios from 'axios';

const TaskForm = ({ selectedList, setTasks }) => {
  const [title, setTitle] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    axios.post(`http://localhost:5000/api/lists/${selectedList}/tasks`, { title })
      .then(response => {
        // Refetch tasks after adding a new one
        axios.get(`http://localhost:5000/api/lists/${selectedList}/tasks`)
          .then(response => setTasks(response.data));
        setTitle(''); // Reset form
      })
      .catch(error => console.error('Error adding task:', error));
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="New Task"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <button type="submit">Add Task</button>
    </form>
  );
};

export default TaskForm;
