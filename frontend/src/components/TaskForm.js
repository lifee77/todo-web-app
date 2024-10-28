import React, { useState } from 'react';
import { addTask, fetchTasks } from '../services/api';

const TaskForm = ({ selectedList, setTasks }) => {
    const [taskName, setTaskName] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!selectedList) {
            setError('No list selected');
            return;
        }
        try {
            await addTask(selectedList, taskName);
            const updatedTasks = await fetchTasks(selectedList); // Fetch updated tasks
            setTasks(updatedTasks); // Update tasks state
            setTaskName('');
            setError('');
        } catch (err) {
            setError(err.message || 'Error adding task');
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <h3>Add Task</h3>
            {error && <p>{error}</p>}
            <input
                type="text"
                placeholder="Task Name"
                value={taskName}
                onChange={(e) => setTaskName(e.target.value)}
            />
            <button type="submit">Add Task</button>
        </form>
    );
};

export default TaskForm;