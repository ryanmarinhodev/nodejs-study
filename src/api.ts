import axios from 'axios';

const token = localStorage.getItem('token');

const api = axios.create({
  baseURL: 'https://nodejs-study-production.up.railway.app', //Trocar esse endPoint para o novo quando hospedar essa api node
  headers: {
    'Access-Control-Allow-Origin': '*',
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  },
});

export default api;
