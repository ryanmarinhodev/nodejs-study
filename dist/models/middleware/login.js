"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.login = void 0;
const jsonwebtoken_1 = require("jsonwebtoken");
const login = (req, res, next) => {
    var _a;
    try {
        const token = (_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.split(' ')[1]; // Extrai o token
        if (!token) {
            return res.status(401).json({ message: 'Token não fornecido' });
        }
        const decode = (0, jsonwebtoken_1.verify)(token, process.env.Secret); // Verifica o token
        req.user = decode; // Define req.user com os dados decodificados
        next(); // Passa para o próximo middleware ou rota
    }
    catch (error) {
        return res.status(401).json({ message: 'Não autorizado ou token errado' });
    }
};
exports.login = login;
