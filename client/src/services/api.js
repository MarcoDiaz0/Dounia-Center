import axios from "axios";

export const instance = axios.create({
  baseURL:
    import.meta.env.MODE === "development"
      ? "http://localhost:5000/api"
      : "/api",
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});
