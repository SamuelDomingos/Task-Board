import { useState, useEffect, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import {
  createTask,
  getTasksByProject,
  updateTask,
  deleteTask,
} from "../service/api";

export const useTasks = (blockId) => {
  const { user } = useContext(AuthContext);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getTasksByProject(blockId, user.token);
      setTasks(response.tasks); // If API returns {tasks: [...]}
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (blockId && user?.token) {
      fetchTasks();
    }
  }, [blockId, user?.token]);

  const handleCreateTask = async (taskData) => {
    try {
      setLoading(true);
      setError(null);
      const newTask = await createTask(blockId, taskData, user.token);
      await fetchTasks(); // Busca as tarefas atualizadas após a criação
      return newTask;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };
  
  const handleUpdateTask = async (taskId, taskData) => {
    try {
      setLoading(true);
      setError(null);
      const updatedTask = await updateTask(blockId, taskId, taskData, user.token);
      await fetchTasks(); // Busca as tarefas atualizadas após a atualização
      return updatedTask;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };
  
  const handleDeleteTask = async (taskId) => {
    try {
      setLoading(true);
      setError(null);
      await deleteTask(blockId, taskId, user.token);
      await fetchTasks(); // Busca as tarefas atualizadas após a exclusão
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    tasks,
    loading,
    error,
    createTask: handleCreateTask,
    updateTask: handleUpdateTask,
    deleteTask: handleDeleteTask,
    refreshTasks: fetchTasks,
    setTasks,
  };
};

export default useTasks;