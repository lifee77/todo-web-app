import React from 'react';
import TaskItem from './TaskItem';

const TaskList = ({ tasks, setTasks, selectedList }) => {
  return (
    <div className="task-list">
      <h2>Tasks</h2>
      {tasks.map(task => (
        <TaskItem key={task.id} task={task} setTasks={setTasks} selectedList={selectedList} />
      ))}
    </div>
  );
};

export default TaskList;
