import { pool } from "../../../mysql";
import { v4 as uuidv4 } from "uuid";
import { Request, Response } from "express";


class VideoRepository {
  create(request: Request, response: Response) {
    const { title, description, user_id } = request.body;
    pool.getConnection((error: any, connection: any) => {
      if (error) {
        return response.status(500).json({ error });
      }
      connection.query(
        "INSERT INTO videos (`videos-id`, `user-id`, title, description) VALUES (?,?,?,?)",
        [uuidv4(), user_id, title, description],
        (error: any) => {
          connection.release();
          if (error) {
            return response.status(400).json(error);
          }
          response.status(200).json({ message: "video criado com sucesso!" });
        }
      );
    });
  }

  getVideos(request: Request, response: Response) {
    const { user_id } = request.body;
    console.log("Valor de user_id recebido:", user_id);
    
    pool.getConnection((error: any, connection: any) => {
      if (error) {
        return response
          .status(500)
          .json({ error: "Erro na conexão com o banco de dados" });
      }
      connection.query(
        'SELECT * FROM videos WHERE `user-id` = ?',
        [user_id],
        (error: any, result: any) => {
          connection.release();
          if (error) {
            return response
              .status(400)
              .json({ error: "Erro ao buscar os vídeos" });
          }
          return response
            .status(200)
            .json({ message: "Vídeos retornados com sucesso", videos: result }); 
            
        }
      );
    });
  }

  searchVideos(request: Request, response: Response) {
    const { search } = request.query;
    console.log("Valor de user_id recebido:", search);
    
    pool.getConnection((error: any, connection: any) => {
      if (error) {
        return response
          .status(500)
          .json({ error: "Erro na conexão com o banco de dados" });
      }
      connection.query(
        'SELECT * FROM videos WHERE title LIKE ?',
        [`%${search}%`],
        (error: any, result: any) => {
          connection.release();
          if (error) {
            return response
              .status(400)
              .json({ error: "Erro ao buscar os vídeos" });
          }
          return response
            .status(200)
            .json({ message: "Vídeos retornados com sucesso", videos: result }); 
            
        }
      );
    });
  }
}

export default VideoRepository;
