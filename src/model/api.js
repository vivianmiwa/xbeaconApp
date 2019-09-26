import axios from 'axios';

const api = axios.create({
  baseURL: "http://179.106.206.14:3000/api"
});

export default api;
