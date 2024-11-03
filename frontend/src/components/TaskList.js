import React, { useState } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import TaskItem from './TaskItem';
import { deleteTaskList } from '../services/api';
import './TaskList.css';

// TaskList component is responsible for rendering a list of tasks with drag-and-drop functionality (although it doesn't work yet).
// It also handles the deletion of task lists.

const TaskList = ({ tasks, setTasks, selectedList, reloadTasks, onListDelete }) => {
  // State to manage the visibility of the delete button for a task list
  const [showDelete, setShowDelete] = useState(null);

  // Function to handle the end of a drag-and-drop operation
  const onDragEnd = (result) => {
    const { destination, source } = result;
    if (!destination) return; // If dropped outside the list, do nothing

    // Reorder tasks based on the drag-and-drop result
    const reorderedTasks = Array.from(tasks);
    const [movedTask] = reorderedTasks.splice(source.index, 1);
    reorderedTasks.splice(destination.index, 0, movedTask);

    setTasks(reorderedTasks); // Update the state with the reordered tasks
  };

  // Function to handle the deletion of a task list
  const handleListDelete = async (listId) => {
    try {
      await deleteTaskList(listId); // Call API to delete the task list
      onListDelete(); // Notify parent component about the deletion
    } catch (error) {
      console.error('Error deleting list:', error); // Log any errors
    }
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId="tasks">
        {(provided) => (
          <div {...provided.droppableProps} ref={provided.innerRef} className="task-list">
            <h2>Tasks</h2>
            {tasks.length > 0 ? (
              // Render each task as a draggable item
              tasks.map((task, index) => (
                <Draggable key={task.id} draggableId={task.id.toString()} index={index}>
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      className={`task-list-item ${task.id === selectedList ? 'selected' : ''}`}
                      onClick={() => setShowDelete(task.id)} // Show delete button on click
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
              <p>No tasks available</p> // Display message if no tasks are available
            )}
            {provided.placeholder} {/* Placeholder for drag-and-drop */}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
};

export default TaskList;