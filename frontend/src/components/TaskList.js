// TaskList.js
import React from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import TaskItem from './TaskItem';

const TaskList = ({ tasks, setTasks, selectedList, reloadTasks }) => {
  
  // Handle drag end event to reorder tasks
  const onDragEnd = (result) => {
    const { destination, source } = result;
    if (!destination) return;

    // Reorder tasks array
    const reorderedTasks = Array.from(tasks);
    const [movedTask] = reorderedTasks.splice(source.index, 1);
    reorderedTasks.splice(destination.index, 0, movedTask);

    setTasks(reorderedTasks); // Update the tasks state with reordered tasks
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId="tasks">
        {(provided) => (
          <div {...provided.droppableProps} ref={provided.innerRef} className="task-list">
            <h2>Tasks</h2>
            {tasks.length > 0 ? (
              tasks.map((task, index) => (
                <Draggable key={task.id} draggableId={task.id.toString()} index={index}>
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                    >
                      <TaskItem
                        task={task}
                        setTasks={setTasks}
                        selectedList={selectedList}
                        reloadTasks={reloadTasks}
                      />
                    </div>
                  )}
                </Draggable>
              ))
            ) : (
              <p>No tasks available</p>
            )}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
};

export default TaskList;
