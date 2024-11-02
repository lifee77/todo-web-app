// TaskItem.js
import React, { useState, useEffect } from 'react';
import { deleteTask, moveTask, fetchLists, updateTaskTitle } from '../services/api';
import TaskForm from './TaskForm';

const TaskItem = ({ task, setTasks, selectedList }) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [showSubtaskForm, setShowSubtaskForm] = useState(false);
  const [showMoveOptions, setShowMoveOptions] = useState(false);
  const [availableLists, setAvailableLists] = useState([]);
  const [newListId, setNewListId] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [newTitle, setNewTitle] = useState(task.title);

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
      setTasks(prevTasks => prevTasks.filter(t => t.id !== task.id));
    } catch (err) {
      console.error('Error deleting task:', err);
    }
  };

  const handleMove = async () => {
    try {
      await moveTask(task.id, newListId);
      // Refresh tasks
      setTasks(prevTasks => prevTasks.filter(t => t.id !== task.id));
    } catch (err) {
      console.error('Error moving task:', err);
    }
  };

  const handleEdit = async () => {
    try {
      await updateTaskTitle(task.id, newTitle);
      setTasks(prevTasks =>
        prevTasks.map(t => (t.id === task.id ? { ...t, title: newTitle } : t))
      );
      setIsEditing(false);
    } catch (err) {
      console.error('Error updating task:', err);
    }
  };

  return (
    <div className="task-item">
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
      </div>
      {showSubtaskForm && (
        <TaskForm
          selectedList={selectedList}
          setTasks={setTasks}
          parentTaskId={task.id}
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
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default TaskItem;