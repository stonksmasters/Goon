import axios from 'axios';

const API = axios.create({ baseURL: 'http://localhost:5000/api' });

// Add request interceptors if needed

export default API;
