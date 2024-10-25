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
const cors = require('cors');
app.use(function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    res.header('Access-Control-Allow-Methods', 'POST, GET, PATCH, DELETE, OPTIONS');
    next();
});
app.use(cors());
app.use('/user', userRouter_1.default);
app.use('/videos', videosRoutes_1.default);
console.log(process.env.SECRET);
const PORT = process.env.PORT || 4001;
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
