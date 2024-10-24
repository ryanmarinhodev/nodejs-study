"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const express_2 = __importDefault(require("express"));
const UserReposity_1 = __importDefault(require("../models/user/UserReposity"));
const login_1 = require("../models/middleware/login");
const userRouter = (0, express_1.Router)();
const userRepository = new UserReposity_1.default();
userRouter.use(express_2.default.json());
userRouter.post('/sign-up', (request, response) => {
    userRepository.create(request, response);
});
userRouter.post("/sign-in", (request, response) => {
    userRepository.login(request, response);
});
userRouter.get('/get-user', login_1.login, (request, response) => {
    userRepository.getUser(request, response);
});
exports.default = userRouter;
