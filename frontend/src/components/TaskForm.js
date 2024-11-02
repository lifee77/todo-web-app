// TaskForm.js
// Allows users to create new tasks within an existing task list.
import React, { useState } from 'react';
import { addTask, fetchTasks } from '../services/api';

const TaskForm = ({ selectedList, setTasks, parentTaskId = null }) => {
  const [title, setTitle] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async e => {
    e.preventDefault();
    if (!selectedList) {
      setError('No list selected');
      return;
    }
    try {
      await addTask(selectedList, title, parentTaskId);
      const updatedTasks = await fetchTasks(selectedList); // Fetch updated tasks
      setTasks(updatedTasks); // Update tasks state
      setTitle('');
      setError('');
    } catch (err) {
      setError(err.response?.data?.message || 'Error adding task');
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ marginLeft: parentTaskId ? '20px' : '0' }}>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <input
        type="text"
        placeholder="Task Title"
        value={title}
        onChange={e => setTitle(e.target.value)}
      />
      <button type="submit">Add {parentTaskId ? 'Subtask' : 'Task'}</button>
    </form>
  );
};

export default TaskForm;
