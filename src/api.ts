import axios from 'axios';

const token = localStorage.getItem('token');

const api = axios.create({
<<<<<<< HEAD
  baseURL: 'https://localhost:4001', //Trocar esse endPoint para o novo quando hospedar essa api node
=======
  baseURL: 'http://localhost:4001', //https://nodejs-study-production.up.railway.app/ //http://localhost:4001
>>>>>>> c8f0cf8101cb7e1c19c1dc1153c4d6c209683254
  headers: {
    'Access-Control-Allow-Origin': '*',
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  },
});

export default api;
