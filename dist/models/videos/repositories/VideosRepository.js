"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mysql_1 = require("../../../mysql");
const uuid_1 = require("uuid");
class VideoRepository {
    create(request, response) {
        const { title, description, user_id } = request.body;
        mysql_1.pool.getConnection((error, connection) => {
            if (error) {
                return response.status(500).json({ error });
            }
            connection.query("INSERT INTO videos (`videos-id`, `user-id`, title, description) VALUES (?,?,?,?)", [(0, uuid_1.v4)(), user_id, title, description], (error) => {
                connection.release();
                if (error) {
                    return response.status(400).json(error);
                }
                response.status(200).json({ message: "video criado com sucesso!" });
            });
        });
    }
    getVideos(request, response) {
        const { user_id } = request.body;
        console.log("Valor de user_id recebido:", user_id);
        mysql_1.pool.getConnection((error, connection) => {
            if (error) {
                return response
                    .status(500)
                    .json({ error: "Erro na conexão com o banco de dados" });
            }
            connection.query('SELECT * FROM videos WHERE `user-id` = ?', [user_id], (error, result) => {
                connection.release();
                if (error) {
                    return response
                        .status(400)
                        .json({ error: "Erro ao buscar os vídeos" });
                }
                return response
                    .status(200)
                    .json({ message: "Vídeos retornados com sucesso", videos: result });
            });
        });
    }
    searchVideos(request, response) {
        const { search } = request.query;
        console.log("Valor de user_id recebido:", search);
        mysql_1.pool.getConnection((error, connection) => {
            if (error) {
                return response
                    .status(500)
                    .json({ error: "Erro na conexão com o banco de dados" });
            }
            connection.query('SELECT * FROM videos WHERE title LIKE ?', [`%${search}%`], (error, result) => {
                connection.release();
                if (error) {
                    return response
                        .status(400)
                        .json({ error: "Erro ao buscar os vídeos" });
                }
                return response
                    .status(200)
                    .json({ message: "Vídeos retornados com sucesso", videos: result });
            });
        });
    }
}
exports.default = VideoRepository;
