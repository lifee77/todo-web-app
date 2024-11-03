// TaskForm.js
// This component allows users to create new tasks within an existing task list.
// It supports adding both top-level tasks and subtasks.

import React, { useState } from 'react';
import { addTask, fetchTasks } from '../services/api';

const TaskForm = ({ selectedList, setTasks, parentTaskId = null }) => {
  // State variables for task title and error message
  const [title, setTitle] = useState('');
  const [error, setError] = useState('');

  // Handle form submission to add a new task
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedList) {
      setError('No list selected'); // Display error if no list is selected
      return;
    }
    try {
      // Call addTask API to add the new task
      await addTask(selectedList, title, parentTaskId);
      // Fetch updated tasks after adding the new task
      const updatedTasks = await fetchTasks(selectedList);
      setTasks(updatedTasks); // Update tasks state with the new list of tasks
      setTitle(''); // Clear the input field
      setError(''); // Clear any existing error messages
    } catch (err) {
      setError(err.response?.data?.message || 'Error adding task'); // Display error message if task addition fails
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ marginLeft: parentTaskId ? '20px' : '0' }}>
      {/* Display error message if any */}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {/* Input field for task title */}
      <input
        type="text"
        placeholder="Task Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      {/* Submit button to add task or subtask */}
      <button type="submit">Add {parentTaskId ? 'Subtask' : 'Task'}</button>
    </form>
  );
};

export default TaskForm;