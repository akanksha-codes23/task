import axios from "axios";

const API_URL = "http://localhost:8080/api/tasks";

export const getAllTasks = async (page = 0, size = 5) => {
  const response = await axios.get(API_URL, {
    params: { page, size }
  });
  return response.data;
};


export const getTasks = (params) => {
  return axios.get(API_URL, { params });
};

export const createTask = (task) => {
  return axios.post(API_URL, task);
};

export const updateTask = (id, task) => {
  return axios.put(`${API_URL}/${id}`, task);
};

export const deleteTask = (id) => {
  return axios.delete(`${API_URL}/${id}`);
};

/* ✅ FIX HERE 👇 */
export const getWeeklyProgress = () =>
  axios.get(`${API_URL}/progress/weekly`);

export const getMonthlyProgress = () =>
  axios.get(`${API_URL}/progress/monthly`);