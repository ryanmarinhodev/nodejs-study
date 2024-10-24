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
                    connection.release();
                    return response.status(500).json({ error });
                }
                connection.query('INSERT INTO users (user_id, name, email, password) VALUES (?,?,?,?)', [(0, uuid_1.v4)(), name, email, hashedPassword], (error) => {
                    connection.release();
                    if (error) {
                        return response.status(400).json(error);
                    }
                    response
                        .status(200)
                        .json({ message: 'Usuário criado com sucesso' });
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
                    .json({ error: 'Erro na conexão com o banco de dados' });
            }
            connection.query('SELECT * FROM users WHERE email = ?', [email], (error, result) => {
                // Casting do resultado para any[]
                connection.release();
                if (error) {
                    return response.status(400).json({ error: 'Erro na autenticação' });
                }
                if (!Array.isArray(result) || result.length === 0) {
                    return response
                        .status(404)
                        .json({ error: 'Usuário não encontrado' });
                }
                const user = result[0];
                (0, bcrypt_1.compare)(password, user.password, (err, isMatch) => {
                    if (err) {
                        return response
                            .status(400)
                            .json({ error: 'Erro na autenticação' });
                    }
                    if (isMatch) {
                        const token = (0, jsonwebtoken_1.sign)({
                            id: user['user-id'],
                            email: user.email,
                        }, process.env.SECRET, { expiresIn: '1d' });
                        return response
                            .status(200)
                            .json({ token, message: 'Autenticado com sucesso' });
                    }
                    else {
                        return response.status(400).json({ error: 'Senha incorreta' });
                    }
                });
            });
        });
    }
    getUser(request, response) {
        var _a;
        console.log('request.user:', request.user); // Verifica o conteúdo do usuário decodificado
        if (!request.user || !request.user.email) {
            return response
                .status(400)
                .send({ error: 'Token inválido, email não encontrado' });
        }
        try {
            console.log('Authorization Header:', request.headers.authorization);
            const token = (_a = request.headers.authorization) === null || _a === void 0 ? void 0 : _a.split(' ')[1]; // Pega o token sem o "Bearer"
            if (!token) {
                return response
                    .status(400)
                    .send({ error: 'Token não fornecido ou mal formatado' });
            }
            console.log('SECRET Key:', process.env.SECRET);
            const decode = (0, jsonwebtoken_1.verify)(token, process.env.SECRET);
            console.log('Decoded Token:', decode);
            if (decode.email) {
                mysql_1.pool.getConnection((error, conn) => {
                    if (error) {
                        console.error('Erro de conexão com o banco de dados:', error);
                        return response
                            .status(500)
                            .send({ error: 'Erro ao conectar ao banco de dados' });
                    }
                    conn.query('SELECT * FROM users WHERE email = ?', [decode.email], (error, resultado) => {
                        conn.release();
                        if (error) {
                            console.error('Erro na consulta ao banco de dados:', error);
                            return response.status(400).send({
                                error: 'Erro na consulta ao banco de dados',
                                response: null,
                            });
                        }
                        if (!Array.isArray(resultado) || resultado.length === 0) {
                            return response
                                .status(404)
                                .send({ error: 'Usuário não encontrado' });
                        }
                        const user = resultado[0];
                        console.log('User Found:', user);
                        return response.status(200).send({
                            user: {
                                id: user['user_id'],
                                nome: user.name,
                                email: user.email,
                            },
                        });
                    });
                });
            }
            else {
                return response
                    .status(400)
                    .send({ error: 'Token inválido, email não encontrado' });
            }
        }
        catch (err) {
            console.error('Erro ao verificar o token:', err);
            return response.status(401).send({ error: 'Token inválido' });
        }
    }
}
exports.default = UserRepository;
