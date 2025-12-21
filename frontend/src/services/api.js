import axios from "axios";

alert("API FILE LOADED — BASE URL = " + import.meta.env.VITE_API_BASE_URL);

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
});

export default api;