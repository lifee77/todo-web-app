import React, { useState } from 'react';
import axios from 'axios';

const TaskItem = ({ task, setTasks, selectedList }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleExpand = () => setIsExpanded(!isExpanded);

  const markComplete = (taskId) => {
    axios.put(`http://localhost:5000/api/tasks/${taskId}`, { completed: !task.completed })
      .then(() => {
        // Refetch tasks after updating the status
        axios.get(`http://localhost:5000/api/lists/${selectedList}/tasks`)
          .then(response => setTasks(response.data));
      })
      .catch(error => console.error('Error updating task:', error));
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
      </div>
      {isExpanded && task.subtasks && task.subtasks.length > 0 && (
        <div className="subtasks">
          {task.subtasks.map(subtask => (
            <TaskItem key={subtask.id} task={subtask} setTasks={setTasks} selectedList={selectedList} />
          ))}
        </div>
      )}
    </div>
  );
};

export default TaskItem;
