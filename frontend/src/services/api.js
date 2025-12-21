import axios from "axios";

console.log(
  "API BASE (prod):",
  import.meta.env.VITE_API_BASE_URL
);

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL
});

export default api;
