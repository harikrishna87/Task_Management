import { createContext, useState, useEffect, useCallback, useContext } from 'react';
import * as api from '../services/api';
import { message } from 'antd';

const TaskContext = createContext();

export const TaskProvider = ({ children }) => {
  const [tasks, setTasks] = useState([]);
  const [timeEntries, setTimeEntries] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchTasks = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.getTasks();
      setTasks(response.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch tasks');
      message.error(err.response?.data?.message || 'Failed to fetch tasks');
    } finally {
      setLoading(false);
    }
  }, []);

  const addTask = async (taskData) => {
    setLoading(true);
    try {
      const response = await api.createTask(taskData);
      setTasks((prevTasks) => [response.data, ...prevTasks]);
      message.success('Task added successfully!');
      return response.data;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add task');
      message.error(err.response?.data?.errors?.[0]?.msg || err.response?.data?.message || 'Failed to add task');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const editTask = async (id, taskData) => {
    setLoading(true);
    try {
      const response = await api.updateTask(id, taskData);
      setTasks((prevTasks) =>
        prevTasks.map((task) => (task._id === id ? response.data : task))
      );
      message.success('Task updated successfully!');
      return response.data;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update task');
      message.error(err.response?.data?.errors?.[0]?.msg || err.response?.data?.message || 'Failed to update task');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const removeTask = async (id) => {
    setLoading(true);
    try {
      await api.deleteTask(id);
      setTasks((prevTasks) => prevTasks.filter((task) => task._id !== id));
      setTimeEntries(prev => {
        const newEntries = {...prev};
        delete newEntries[id];
        return newEntries;
      });
      message.success('Task deleted successfully!');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete task');
      message.error(err.response?.data?.message || 'Failed to delete task');
    } finally {
      setLoading(false);
    }
  };

  const fetchTimeEntries = useCallback(async (taskId) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.getTimeEntriesForTask(taskId);
      setTimeEntries((prev) => ({ ...prev, [taskId]: response.data }));
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch time entries');
      message.error(err.response?.data?.message || `Failed to fetch time entries for task ${taskId}`);
    } finally {
      setLoading(false);
    }
  }, []);

  const addTimeEntry = async (entryData) => {
    setLoading(true);
    try {
      const response = await api.createTimeEntry(entryData);
      setTimeEntries((prev) => ({
        ...prev,
        [entryData.taskId]: [...(prev[entryData.taskId] || []), response.data],
      }));
      message.success('Time entry added successfully!');
      return response.data;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add time entry');
      message.error(err.response?.data?.errors?.[0]?.msg || err.response?.data?.message || 'Failed to add time entry');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  return (
    <TaskContext.Provider
      value={{
        tasks,
        timeEntries,
        loading,
        error,
        fetchTasks,
        addTask,
        editTask,
        removeTask,
        fetchTimeEntries,
        addTimeEntry,
      }}
    >
      {children}
    </TaskContext.Provider>
  );
};

export const useTasks = () => useContext(TaskContext);