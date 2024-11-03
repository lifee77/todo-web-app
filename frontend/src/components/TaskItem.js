// TaskItem.js
// This component is responsible for rendering individual tasks and their subtasks.
// It provides functionality to delete, move, edit, and complete tasks, as well as add subtasks.

import React, { useState, useEffect } from 'react';
import { deleteTask, moveTask, fetchLists, updateTaskTitle } from '../services/api';
import TaskForm from './TaskForm';

const TaskItem = ({ task, setTasks, selectedList, reloadTasks }) => {
  // State variables for managing task item behavior
  const [isExpanded, setIsExpanded] = useState(true); // Toggle to show/hide subtasks
  const [showSubtaskForm, setShowSubtaskForm] = useState(false); // Toggle to show/hide subtask form
  const [showMoveOptions, setShowMoveOptions] = useState(false); // Toggle to show/hide move options
  const [availableLists, setAvailableLists] = useState([]); // List of available lists for moving tasks
  const [newListId, setNewListId] = useState(null); // Selected list ID for moving task
  const [isEditing, setIsEditing] = useState(false); // Toggle to show/hide edit input
  const [newTitle, setNewTitle] = useState(task.title); // State for new task title during editing

  // Load available lists when move options are shown
  useEffect(() => {
    const loadLists = async () => {
      const lists = await fetchLists();
      setAvailableLists(lists);
    };
    if (showMoveOptions) {
      loadLists();
    }
  }, [showMoveOptions]);

  // Toggle the expansion of subtasks
  const toggleExpand = () => setIsExpanded(!isExpanded);

  // Handle task deletion
  const handleDelete = async () => {
    try {
      await deleteTask(task.id);
      reloadTasks(); // Refresh the task list after deletion
    } catch (err) {
      console.error('Error deleting task:', err);
    }
  };

  // Handle task moving to a different list
  const handleMove = async () => {
    try {
      await moveTask(task.id, newListId);
      reloadTasks(); // Refresh the task list after moving
    } catch (err) {
      console.error('Error moving task:', err);
    }
  };

  // Handle task title editing
  const handleEdit = async () => {
    try {
      await updateTaskTitle(task.id, newTitle);
      setIsEditing(false);
      reloadTasks(); // Refresh the task list after editing
    } catch (err) {
      console.error('Error updating task:', err);
    }
  };

  // Handle task completion (deletion)
  const handleComplete = async () => {
    try {
      await deleteTask(task.id);
      setTasks((prevTasks) => prevTasks.filter(t => t.id !== task.id)); // Update local tasks list
      reloadTasks(); // Refresh tasks from the backend
    } catch (err) {
      console.error('Error marking task as complete:', err);
    }
  };

  return (
    <div className="task-item">
      <div>
        {/* Toggle button for expanding/collapsing subtasks */}
        <span onClick={toggleExpand} style={{ cursor: 'pointer' }}>
          {isExpanded ? '[-]' : '[+]'}
        </span>
        {/* Task title and edit input */}
        {isEditing ? (
          <>
            <input
              type="text"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
            />
            <button onClick={handleEdit}>Save</button>
            <button onClick={() => setIsEditing(false)}>Cancel</button>
          </>
        ) : (
          <>
            {task.title}
            <button onClick={() => setIsEditing(true)}>Edit</button>
          </>
        )}
        {/* Buttons for task actions */}
        <button onClick={handleDelete}>Delete</button>
        <button onClick={() => setShowSubtaskForm(!showSubtaskForm)}>
          {showSubtaskForm ? 'Cancel' : 'Add Subtask'}
        </button>
        <button onClick={() => setShowMoveOptions(!showMoveOptions)}>
          {showMoveOptions ? 'Cancel' : 'Move'}
        </button>
        <button onClick={handleComplete}>Complete</button>
      </div>
      {/* Subtask form */}
      {showSubtaskForm && (
        <TaskForm
          selectedList={selectedList}
          setTasks={setTasks}
          parentTaskId={task.id}
          reloadTasks={reloadTasks} // Pass reloadTasks to TaskForm
        />
      )}
      {/* Move options */}
      {showMoveOptions && (
        <div>
          <select onChange={(e) => setNewListId(e.target.value)} value={newListId || ''}>
            <option value="" disabled>
              Select List
            </option>
            {availableLists
              .filter((list) => list.id !== selectedList)
              .map((list) => (
                <option key={list.id} value={list.id}>
                  {list.name}
                </option>
              ))}
          </select>
          <button onClick={handleMove} disabled={!newListId}>
            Move
          </button>
        </div>
      )}
      {/* Render subtasks recursively */}
      {isExpanded && task.children && task.children.length > 0 && (
        <div className="subtasks" style={{ marginLeft: '20px' }}>
          {task.children.map((subtask) => (
            <TaskItem
              key={subtask.id}
              task={subtask}
              setTasks={setTasks}
              selectedList={selectedList}
              reloadTasks={reloadTasks} // Pass reloadTasks to child TaskItem
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default TaskItem;