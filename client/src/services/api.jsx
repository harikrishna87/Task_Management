import axios from 'axios';

const API_URL = "http://localhost:5001/api";

export const getTasks = () => axios.get(`${API_URL}/tasks`);
export const createTask = (taskData) => axios.post(`${API_URL}/tasks`, taskData);
export const updateTask = (id, taskData) => axios.put(`${API_URL}/tasks/${id}`, taskData);
export const deleteTask = (id) => axios.delete(`${API_URL}/tasks/${id}`);

export const getTimeEntriesForTask = (taskId) => axios.get(`${API_URL}/time-entries/task/${taskId}`);
export const createTimeEntry = (timeEntryData) => axios.post(`${API_URL}/time-entries`, timeEntryData);
export const updateTimeEntryAPI = (id, timeEntryData) => axios.put(`${API_URL}/time-entries/${id}`, timeEntryData);
export const deleteTimeEntryAPI = (id) => axios.delete(`${API_URL}/time-entries/${id}`);

export const getStatistics = () => axios.get(`${API_URL}/statistics`);