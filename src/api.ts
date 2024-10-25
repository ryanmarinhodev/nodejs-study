import axios from 'axios';

const token = localStorage.getItem('token');

const api = axios.create({
  baseURL: 'hhttps://nodejs-study-production.up.railway.app',
  headers: {
    'Access-Control-Allow-Origin': '*',
    'Content-Type': 'application/json',
    Authorization: token,
  },
});

export default api;
