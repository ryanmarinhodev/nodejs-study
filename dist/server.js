"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const userRouter_1 = __importDefault(require("./routes/userRouter"));
const express_1 = __importDefault(require("express"));
const videosRoutes_1 = __importDefault(require("./routes/videosRoutes"));
const dotenv_1 = require("dotenv");
(0, dotenv_1.config)();
const app = (0, express_1.default)();
app.use('/user', userRouter_1.default);
app.use('/videos', videosRoutes_1.default);
console.log(process.env.SECRET);
app.listen(4000, () => {
    console.log('Servidor rodando na porta 4000');
});
