import userRouter from "./routes/userRouter";
import express from 'express'
import videosRoutes from "./routes/videosRoutes";
import { config } from 'dotenv'

config();
const app = express();

const cors = require('cors');

app.use(function(req,res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  res.header("Access-Control-Allow-Methods", "POST, GET, PATCH, DELETE, OPTIONS");
  next();
});

app.use(cors())


app.use('/user', userRouter)
app.use('/videos', videosRoutes)

console.log(process.env.SECRET)



app.listen(4000, () => {
  console.log('Servidor rodando na porta 4000');
});
