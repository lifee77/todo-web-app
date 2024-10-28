import axios from 'axios';

const API_URL = 'http://127.0.0.1:5000/api';

axios.defaults.baseURL = API_URL;
axios.defaults.withCredentials = true;
axios.defaults.headers.common['Content-Type'] = 'application/json';

export async function fetchLists() {
    const response = await axios.get('/lists');
    return response.data;
}

export async function fetchTasks(listId) {
    const response = await axios.get(`/lists/${listId}/tasks`);
    return response.data;
}

export const addTask = async (listId, taskName) => {
    const response = await axios.post(`/lists/${listId}/tasks`, { name: taskName });
    return response.data;
};

export async function registerUser(username, password) {
    const response = await fetch(`${API_URL}/register`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, password })
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to register user');
    }

    return response.json();
}

export async function loginUser(username, password) {
    const response = await fetch(`${API_URL}/login`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, password })
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to login');
    }

    return response.json();
}

export async function logoutUser() {
    const response = await fetch(`${API_URL}/logout`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        }
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to logout');
    }

    return response.json();
}

export async function deleteTask(taskId) {
    const response = await fetch(`${API_URL}/tasks/${taskId}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        }
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to delete task');
    }

    return response.json();
}