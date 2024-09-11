"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mysql_1 = require("../../mysql");
const uuid_1 = require("uuid");
const bcrypt_1 = require("bcrypt");
const jsonwebtoken_1 = require("jsonwebtoken");
class UserRepository {
    create(request, response) {
        const { name, email, password } = request.body;
        mysql_1.pool.getConnection((error, connection) => {
            if (error) {
                return response.status(500).json({ error });
            }
            (0, bcrypt_1.hash)(password, 10, (err, hashedPassword) => {
                if (err) {
                    return response.status(500).json({ error });
                }
                connection.query("INSERT INTO user (`user-id`, name, email, password) VALUES (?,?,?,?)", [(0, uuid_1.v4)(), name, email, hashedPassword], (error) => {
                    connection.release();
                    if (error) {
                        return response.status(400).json(error);
                    }
                    response.status(200).json({ mesage: 'Usuário criado com sucesso' });
                });
            });
        });
    }
    login(request, response) {
        const { email, password } = request.body;
        mysql_1.pool.getConnection((error, connection) => {
            if (error) {
                return response
                    .status(500)
                    .json({ error: "Erro na conexão com o banco de dados" });
            }
            connection.query("SELECT * FROM user WHERE email = ?", [email], (error, result) => {
                connection.release();
                if (error) {
                    return response.status(400).json({ error: "Erro na autenticação" });
                }
                if (result.length === 0) {
                    return response
                        .status(400)
                        .json({ error: "Usuário não encontrado" });
                }
                const user = result[0]; // Acessando a primeira posição do array
                (0, bcrypt_1.compare)(password, user.password, (err, isMatch) => {
                    if (err) {
                        return response
                            .status(400)
                            .json({ error: "Erro na autenticação" });
                    }
                    if (isMatch) {
                        const token = (0, jsonwebtoken_1.sign)({
                            id: user.user_id,
                            email: user.email,
                        }, process.env.Secret, { expiresIn: "1d" });
                        console.log(token);
                        return response.status(200).json({ token, message: 'Autenticado com sucesso' });
                    }
                    else {
                        return response.status(400).json({ error: "Senha incorreta" });
                    }
                });
            });
        });
    }
}
exports.default = UserRepository;
