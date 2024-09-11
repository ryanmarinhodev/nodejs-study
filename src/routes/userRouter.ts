import { Router } from 'express';
import express from 'express'
import UserRepository from "../models/user/UserReposity";

const userRouter = Router();
const userRepository = new UserRepository()

userRouter.use(express.json());


userRouter.post('/sign-up', (request, response) => {
  userRepository.create(request, response)
});

userRouter.post('/sign-in', (request, response) => {
    userRepository.login(request, response);
  });





export default userRouter;