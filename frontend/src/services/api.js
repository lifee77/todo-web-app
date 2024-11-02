//api.js
import axios from 'axios';

const API_URL = 'http://localhost:5000/api';
axios.defaults.baseURL = API_URL;
axios.defaults.withCredentials = true;
axios.defaults.headers.common['Content-Type'] = 'application/json';


// Update the axios interceptor
axios.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // Don't redirect if we're already on an auth route
      const authRoutes = ['/login', '/register'];
      if (!authRoutes.includes(window.location.pathname)) {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

// Update getCurrentUser function
export async function getCurrentUser() {
  try {
    const response = await axios.get('/current_user');
    return response.data; // Should return user data if authenticated
  } catch (error) {
    // Return null if not authenticated
    return null;
  }
}

// Login user
export async function loginUser(username, password) {
  try {
    const response = await axios.post('/login', { username, password });
    // Optionally, you can set authentication state here
    return response.data;
  } catch (error) {
    throw error;
  }
}

// Register user
export async function registerUser(username, password) {
  try {
    const response = await axios.post('/register', { username, password });
    return response.data;
  } catch (error) {
    throw error;
  }
}

// Logout user
export async function logoutUser() {
  try {
    const response = await axios.post('/logout');
    return response.data;
  } catch (error) {
    throw error;
  }
}

// Fetch lists
export async function fetchLists() {
  try {
    const response = await axios.get('/lists');
    return response.data;
  } catch (error) {
    throw error;
  }
}

// Fetch tasks
export async function fetchTasks(listId) {
  try {
    const response = await axios.get(`/lists/${listId}/tasks`);
    return response.data;
  } catch (error) {
    throw error;
  }
}


export async function createTaskList(name) {
  try {
    const response = await axios.post('/lists', { name });
    return response.data;
  } catch (error) {
    throw error;
  }
}

// Add task
export async function addTask(listId, title, parentId = null) {
  try {
    const response = await axios.post(`/lists/${listId}/tasks`, { title, parent_id: parentId });
    return response.data;
  } catch (error) {
    throw error;
  }
}

// Delete task
export async function deleteTask(taskId) {
  try {
    const response = await axios.delete(`/tasks/${taskId}`);
    return response.data;
  } catch (error) {
    throw error;
  }
}

// Move task
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

// Update task title
export async function updateTaskTitle(taskId, title) {
  try {
    const response = await axios.put(`/tasks/${taskId}`, { title });
    return response.data;
  } catch (error) {
    throw error;
  }
}