import userRouter from "./routes/userRouter";
import express from 'express'

const app = express();

app.use('/user', userRouter)




app.listen(4000, () => {
  console.log('Servidor rodando na porta 4000');
});
