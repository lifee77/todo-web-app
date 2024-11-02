//Allows users to create new task lists.
// TaskListForm.js
import React, { useState } from 'react';

const TaskListForm = ({ onCreate }) => {
  const [name, setName] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (name.trim() === '') {
      return;
    }
    await onCreate(name);
    setName('');
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="New Task List Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <button type="submit">Create Task List</button>
    </form>
  );
};

export default TaskListForm;
