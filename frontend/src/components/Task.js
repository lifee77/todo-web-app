import React from 'react';
import PropTypes from 'prop-types';

// Task component is used to render a task and its subtasks recursively.
// This component is useful when you need to display a hierarchical structure of tasks,
// where each task can have multiple subtasks, and each subtask can have its own subtasks, and so on.

const Task = ({ task, onMoveTask }) => {
  if (!task) {
    return null; // Render nothing if task is undefined
  }

  // Function to render subtasks recursively
  const renderSubTasks = (subTasks) => {
    return subTasks.map((subTask) => (
      <Task key={subTask.id} task={subTask} onMoveTask={onMoveTask} />
    ));
  };

  return (
    <div className="task">
      <div className="task-title">
        {task.title}
        {/* Button to move the task */}
        <button onClick={() => onMoveTask(task.id)}>Move</button>
      </div>
      {/* Render subtasks if they exist */}
      {task.children && task.children.length > 0 && (
        <div className="sub-tasks">
          {renderSubTasks(task.children)}
        </div>
      )}
    </div>
  );
};

// Define prop types for the Task component
Task.propTypes = {
  task: PropTypes.shape({
    id: PropTypes.number.isRequired,
    title: PropTypes.string.isRequired,
    children: PropTypes.arrayOf(PropTypes.object),
  }),
  onMoveTask: PropTypes.func.isRequired,
};

export default Task;