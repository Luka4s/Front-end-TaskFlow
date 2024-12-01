import axios from "axios";

export const api = axios.create({
  baseURL: "https://task-flow-api.vercel.app",
});

console.log(process.env.NODE_ENV);
