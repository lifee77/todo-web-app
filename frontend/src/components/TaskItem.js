// TaskItem.js
import React, { useState, useEffect } from 'react';
import { deleteTask, moveTask, fetchLists, updateTaskTitle } from '../services/api';
import TaskForm from './TaskForm';

const TaskItem = ({ task, setTasks, selectedList, reloadTasks }) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [showSubtaskForm, setShowSubtaskForm] = useState(false);
  const [showMoveOptions, setShowMoveOptions] = useState(false);
  const [availableLists, setAvailableLists] = useState([]);
  const [newListId, setNewListId] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [newTitle, setNewTitle] = useState(task.title);
  const [isCompleted, setIsCompleted] = useState(task.completed || false); // Initialize with task's completed status

  useEffect(() => {
    const loadLists = async () => {
      const lists = await fetchLists();
      setAvailableLists(lists);
    };
    if (showMoveOptions) {
      loadLists();
    }
  }, [showMoveOptions]);

  const toggleExpand = () => setIsExpanded(!isExpanded);

  const handleDelete = async () => {
    try {
      await deleteTask(task.id);
      reloadTasks();  // Refresh the task list after deletion
    } catch (err) {
      console.error('Error deleting task:', err);
    }
  };

  const handleMove = async () => {
    try {
      await moveTask(task.id, newListId);
      reloadTasks();  // Refresh the task list after moving
    } catch (err) {
      console.error('Error moving task:', err);
    }
  };

  const handleEdit = async () => {
    try {
      await updateTaskTitle(task.id, newTitle);
      setIsEditing(false);
      reloadTasks();  // Refresh the task list after editing
    } catch (err) {
      console.error('Error updating task:', err);
    }
  };

  // New function to mark a task as complete
  const handleComplete = async () => {
    try {
      setIsCompleted(!isCompleted);  // Toggle completed status
      await updateTaskTitle(task.id, newTitle); // Assuming API has a "completed" field you can update
      reloadTasks();  // Refresh the task list after marking complete
    } catch (err) {
      console.error('Error marking task as complete:', err);
    }
  };

  return (
    <div className="task-item" style={{ textDecoration: isCompleted ? 'line-through' : 'none', opacity: isCompleted ? 0.5 : 1 }}>
      <div>
        <span onClick={toggleExpand} style={{ cursor: 'pointer' }}>
          {isExpanded ? '[-]' : '[+]'}
        </span>
        {isEditing ? (
          <>
            <input
              type="text"
              value={newTitle}
              onChange={e => setNewTitle(e.target.value)}
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
        <button onClick={handleDelete}>Delete</button>
        <button onClick={() => setShowSubtaskForm(!showSubtaskForm)}>
          {showSubtaskForm ? 'Cancel' : 'Add Subtask'}
        </button>
        <button onClick={() => setShowMoveOptions(!showMoveOptions)}>
          {showMoveOptions ? 'Cancel' : 'Move'}
        </button>
        <button onClick={handleComplete}>{isCompleted ? 'Undo Complete' : 'Complete'}</button>
      </div>
      {showSubtaskForm && (
        <TaskForm
          selectedList={selectedList}
          setTasks={setTasks}
          parentTaskId={task.id}
          reloadTasks={reloadTasks}  // Pass reloadTasks to TaskForm
        />
      )}
      {showMoveOptions && (
        <div>
          <select onChange={e => setNewListId(e.target.value)} value={newListId || ''}>
            <option value="" disabled>
              Select List
            </option>
            {availableLists
              .filter(list => list.id !== selectedList)
              .map(list => (
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
      {isExpanded && task.children && task.children.length > 0 && (
        <div className="subtasks" style={{ marginLeft: '20px' }}>
          {task.children.map(subtask => (
            <TaskItem
              key={subtask.id}
              task={subtask}
              setTasks={setTasks}
              selectedList={selectedList}
              reloadTasks={reloadTasks}  // Pass reloadTasks to child TaskItem
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default TaskItem;
