import axios from "axios";

const aplication = import.meta.env.VITE_APLICATION;

const baseURL =
  aplication === "development"
    ? "http://127.0.0.1:3000"
    : "https://task-flow-api.vercel.app";

console.log(baseURL);

export const api = axios.create({
  baseURL,
});
