import React, { useState, useEffect } from 'react';
import Task from './Task';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

const TaskList = ({ listId }) => {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    fetch(`/api/lists/${listId}/tasks`)
      .then((response) => response.json())
      .then((data) => setTasks(data));
  }, [listId]);

  const handleMoveTask = (taskId) => {
    // Implement the logic to move the task
  };

  const onDragEnd = (result) => {
    if (!result.destination) return;

    const items = Array.from(tasks);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    setTasks(items);
    // Optionally, update the backend with the new order
  };

  const renderTasks = (tasks) => {
    return tasks.map((task, index) => (
      <Draggable key={task.id} draggableId={task.id.toString()} index={index}>
        {(provided) => (
          <div
            ref={provided.innerRef}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
          >
            <Task task={task} onMoveTask={handleMoveTask} />
          </div>
        )}
      </Draggable>
    ));
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId="tasks">
        {(provided) => (
          <div
            className="task-list"
            {...provided.droppableProps}
            ref={provided.innerRef}
          >
            {renderTasks(tasks)}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
};

export default TaskList;