import axios from "axios";

// Create an instance of Axios with custom configuration
const instance = axios.create({
  baseURL: "http://localhost:3010",
  timeout: 5000,
  headers: {
    "Content-Type": "application/json",
  },
});

export default instance;
