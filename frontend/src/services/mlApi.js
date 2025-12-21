import axios from "axios";

const mlApi = axios.create({
  baseURL: import.meta.env.VITE_ML_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export default mlApi;
