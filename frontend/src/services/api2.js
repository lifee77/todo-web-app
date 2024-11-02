import axios from 'axios';

const API_URL = 'http://127.0.0.1:5000/api';
axios.defaults.baseURL = API_URL;
axios.defaults.withCredentials = true;  // This ensures that cookies or credentials are included by default
axios.defaults.headers.common['Content-Type'] = 'application/json';

// Fetch lists (authenticated)
export async function fetchLists() {
  const response = await axios.get('/lists', { withCredentials: true });
  return response.data;
}

// Fetch tasks for a list (authenticated)
export async function fetchTasks(listId) {
  const response = await axios.get(`/lists/${listId}/tasks`, { withCredentials: true });
  return response.data;
}

// Add a new task to a list (authenticated)
export async function addTask(listId, title, parentId = null) {
  const response = await axios.post(`/lists/${listId}/tasks`, { title, parent_id: parentId }, { withCredentials: true });
  return response.data;
}

// Register a new user (public)
export async function registerUser(username, password) {
  const response = await axios.post('/register', { username, password });
  return response.data;
}

// Log in a user (public)
export async function loginUser(username, password) {
  try {
      const response = await axios.post('/login', { username, password }, { 
          withCredentials: true,
          headers: {
              'Content-Type': 'application/json'
          }
      });
      return response.data;
  } catch (error) {
      throw error;
  }
}
// Log out a user (authenticated)
export async function logoutUser() {
  const response = await axios.post('/logout', { withCredentials: true });
  return response.data;
}

// Delete a task (authenticated)
export async function deleteTask(taskId) {
  const response = await axios.delete(`/tasks/${taskId}`, { withCredentials: true });
  return response.data;
}

// Add an axios interceptor to handle unauthorized responses
axios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Redirect to login or handle unauthorized state
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Update getCurrentUser function
export async function getCurrentUser() {
  try {
    const response = await axios.get('/current_user', { withCredentials: true });
    return response.data;
  } catch (error) {
    if (error.response && error.response.status === 401) {
      throw new Error('Not authenticated');
    }
    throw error;
  }
}