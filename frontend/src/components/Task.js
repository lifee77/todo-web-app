import React from 'react';
import PropTypes from 'prop-types';

const Task = ({ task, onMoveTask }) => {
  if (!task) {
    return null; // Render nothing if task is undefined
  }

  const renderSubTasks = (subTasks) => {
    return subTasks.map((subTask) => (
      <Task key={subTask.id} task={subTask} onMoveTask={onMoveTask} />
    ));
  };

  return (
    <div className="task">
      <div className="task-title">
        {task.title}
        <button onClick={() => onMoveTask(task.id)}>Move</button>
      </div>
      {task.children && task.children.length > 0 && (
        <div className="sub-tasks">
          {renderSubTasks(task.children)}
        </div>
      )}
    </div>
  );
};

Task.propTypes = {
  task: PropTypes.shape({
    id: PropTypes.number.isRequired,
    title: PropTypes.string.isRequired,
    children: PropTypes.arrayOf(PropTypes.object),
  }),
  onMoveTask: PropTypes.func.isRequired,
};

export default Task;