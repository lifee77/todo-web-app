import React, { useState } from 'react';
import axios from 'axios';

const TaskItem = ({ task, setTasks, selectedList, lists }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleExpand = () => setIsExpanded(!isExpanded);

  const markComplete = (taskId) => {
    axios.delete(`http://localhost:5000/api/tasks/${taskId}`)
      .then(() => {
        // Refetch tasks after deleting the task
        axios.get(`http://localhost:5000/api/lists/${selectedList}/tasks`)
          .then(response => setTasks(response.data));
      })
      .catch(error => console.error('Error deleting task:', error));
  };

  const moveTask = (taskId, newListId) => {
    axios.put(`http://localhost:5000/api/tasks/${taskId}/move`, { newListId })
      .then(() => {
        // Refetch tasks after moving the task
        axios.get(`http://localhost:5000/api/lists/${selectedList}/tasks`)
          .then(response => setTasks(response.data));
      })
      .catch(error => console.error('Error moving task:', error));
  };

  return (
    <div className="task-item">
      <div className="task-header">
        <input
          type="checkbox"
          checked={task.completed}
          onChange={() => markComplete(task.id)}
        />
        <span onClick={toggleExpand}>{task.title}</span>
        <select onChange={(e) => moveTask(task.id, e.target.value)}>
          <option value="">Move to...</option>
          {lists.map(list => (
            <option key={list.id} value={list.id}>{list.name}</option>
          ))}
        </select>
      </div>
      {isExpanded && task.subtasks && task.subtasks.length > 0 && (
        <div className="subtasks">
          {task.subtasks.map(subtask => (
            <TaskItem key={subtask.id} task={subtask} setTasks={setTasks} selectedList={selectedList} lists={lists} />
          ))}
        </div>
      )}
    </div>
  );
};

export default TaskItem;