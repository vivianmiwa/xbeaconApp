import axios from 'axios';

const api = axios.create({
  baseURL: "http://179.106.206.148/api"
});

export default api;
