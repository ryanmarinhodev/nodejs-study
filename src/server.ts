import userRouter from "./routes/userRouter";
import express from 'express'
import videosRoutes from "./routes/videosRoutes";
import { config } from 'dotenv'

config();
const app = express();

app.use('/user', userRouter)
app.use('/videos', videosRoutes)

console.log(process.env.SECRET)



app.listen(4000, () => {
  console.log('Servidor rodando na porta 4000');
});
