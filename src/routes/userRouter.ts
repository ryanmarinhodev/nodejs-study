import { Router } from 'express';
import express from 'express';
import UserRepository from '../models/user/UserReposity';
import { login } from '../models/middleware/login';

const userRouter = Router();
const userRepository = new UserRepository();

userRouter.use(express.json());

userRouter.post('/sign-up', (request, response) => {
  userRepository.create(request, response);
});

userRouter.post('/sign-in', (request, response) => {
  userRepository.login(request, response);
  console.log('Login requisitado com:', request.body);
});

userRouter.get('/get-user', login, (request, response) => {
  userRepository.getUser(request, response);
});

export default userRouter;
