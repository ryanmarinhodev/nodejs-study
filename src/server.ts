import userRouter from './routes/userRouter';
import express from 'express';
import videosRoutes from './routes/videosRoutes';
import { config } from 'dotenv';
import morgan from 'morgan';

config();
const app = express();
app.use(morgan('dev'));

const cors = require('cors');

app.use(function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept'
  );
  res.header(
    'Access-Control-Allow-Methods',
    'POST, GET, PATCH, DELETE, OPTIONS'
  );
  next();
});

app.use('/user', userRouter);
app.use('/videos', videosRoutes);

console.log(process.env.SECRET);

app.use(
  cors({
    origin: '*', // Permite requisições de qualquer origem
    methods: ['GET', 'POST', 'PATCH', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
