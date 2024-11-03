// TaskListForm.js
// This component allows users to create new task lists.

import React, { useState } from 'react';

const TaskListForm = ({ onCreate }) => {
  // State variable to manage the name of the new task list
  const [name, setName] = useState('');

  // Handle form submission to create a new task list
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (name.trim() === '') {
      return; // Do nothing if the input is empty
    }
    await onCreate(name); // Call the onCreate function passed as a prop
    setName(''); // Clear the input field after creating the task list
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Input field for the new task list name */}
      <input
        type="text"
        placeholder="New Task List Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      {/* Submit button to create the task list */}
      <button type="submit">Create Task List</button>
    </form>
  );
};

export default TaskListForm;