// api.js
// This file contains functions to interact with the backend API using axios for HTTP requests.

import axios from 'axios';

// Set the base URL for axios
const API_URL = 'http://localhost:5000/api';
axios.defaults.baseURL = API_URL;
axios.defaults.withCredentials = true;
axios.defaults.headers.common['Content-Type'] = 'application/json';

// Update the axios interceptor to handle 401 Unauthorized responses
axios.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // Redirect to login page if the user is not authenticated and not already on an auth route
      const authRoutes = ['/login', '/register'];
      if (!authRoutes.includes(window.location.pathname)) {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

// Function to get the current authenticated user
export async function getCurrentUser() {
  try {
    const response = await axios.get('/current_user');
    return response.data; // Return user data if authenticated
  } catch (error) {
    // Return null if not authenticated
    return null;
  }
}

// Function to log in a user
export async function loginUser(username, password) {
  try {
    const response = await axios.post('/login', { username, password });
    // Optionally, you can set authentication state here
    return response.data;
  } catch (error) {
    throw error;
  }
}

// Function to register a new user
export async function registerUser(username, password) {
  try {
    const response = await axios.post('/register', { username, password });
    return response.data;
  } catch (error) {
    throw error;
  }
}

// Function to log out the current user
export async function logoutUser() {
  try {
    const response = await axios.post('/logout');
    return response.data;
  } catch (error) {
    throw error;
  }
}

// Function to fetch all task lists
export async function fetchLists() {
  try {
    const response = await axios.get('/lists');
    return response.data;
  } catch (error) {
    throw error;
  }
}

// Function to fetch tasks for a specific list
export async function fetchTasks(listId) {
  try {
    const response = await axios.get(`/lists/${listId}/tasks`);
    return response.data;
  } catch (error) {
    throw error;
  }
}

// Function to create a new task list
export async function createTaskList(name) {
  try {
    const response = await axios.post('/lists', { name });
    return response.data;
  } catch (error) {
    throw error;
  }
}

// Function to add a new task to a list
export async function addTask(listId, title, parentId = null) {
  try {
    const response = await axios.post(`/lists/${listId}/tasks`, { title, parent_id: parentId });
    return response.data;
  } catch (error) {
    throw error;
  }
}

// Function to delete a task
export async function deleteTask(taskId) {
  try {
    const response = await axios.delete(`/tasks/${taskId}`);
    return response.data;
  } catch (error) {
    throw error;
  }
}

// Function to move a task to a different list or parent task
export async function moveTask(taskId, newListId, newParentId = null) {
  try {
    const response = await axios.put(`/tasks/${taskId}/move`, {
      newListId,
      newParentId,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
}

// Function to update the title of a task
export async function updateTaskTitle(taskId, title) {
  try {
    const response = await axios.put(`/tasks/${taskId}`, { title });
    return response.data;
  } catch (error) {
    throw error;
  }
}

// Function to delete a task list
export const deleteTaskList = async (listId) => {
  try {
    const response = await axios.delete(`http://localhost:5000/api/task-lists/${listId}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting task list:", error);
    throw error;
  }
};