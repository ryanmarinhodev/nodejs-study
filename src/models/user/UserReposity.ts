import { pool } from '../../mysql';
import { v4 as uuidv4 } from 'uuid';
import { hash, compare } from 'bcrypt';
import { Request, Response } from 'express';
import { sign, verify } from 'jsonwebtoken';

class UserRepository {
  create(request: Request, response: Response) {
    const { name, email, password } = request.body;
    pool.getConnection((error: any, connection: any) => {
      if (error) {
        return response.status(500).json({ error });
      }

      hash(password, 10, (err, hashedPassword) => {
        if (err) {
          connection.release();
          return response.status(500).json({ error });
        }

        connection.query(
          'INSERT INTO user (`user-id`, name, email, password) VALUES (?,?,?,?)',
          [uuidv4(), name, email, hashedPassword],
          (error: any) => {
            connection.release();
            if (error) {
              return response.status(400).json(error);
            }
            response
              .status(200)
              .json({ message: 'Usuário criado com sucesso' });
          }
        );
      });
    });
  }

  login(request: Request, response: Response) {
    const { email, password } = request.body;
    pool.getConnection((error: any, connection: any) => {
      if (error) {
        return response
          .status(500)
          .json({ error: 'Erro na conexão com o banco de dados' });
      }

      connection.query(
        'SELECT * FROM user WHERE email = ?',
        [email],
        (error: any, result: any[]) => {
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

          compare(password, user.password, (err, isMatch) => {
            if (err) {
              return response
                .status(400)
                .json({ error: 'Erro na autenticação' });
            }

            if (isMatch) {
              const token = sign(
                {
                  id: user['user-id'], // Correção para o nome da propriedade com hífen
                  email: user.email,
                },
                process.env.SECRET as string,
                { expiresIn: '1d' }
              );

              return response
                .status(200)
                .json({ token, message: 'Autenticado com sucesso' });
            } else {
              return response.status(400).json({ error: 'Senha incorreta' });
            }
          });
        }
      );
    });
  }

  getUser(request: any, response: any) {
    console.log('request.user:', request.user); // Verifica o conteúdo do usuário decodificado

    if (!request.user || !request.user.email) {
      return response
        .status(400)
        .send({ error: 'Token inválido, email não encontrado' });
    }
    try {
      console.log('Authorization Header:', request.headers.authorization);

      const token = request.headers.authorization?.split(' ')[1]; // Pega o token sem o "Bearer"
      if (!token) {
        return response
          .status(400)
          .send({ error: 'Token não fornecido ou mal formatado' });
      }

      console.log('SECRET Key:', process.env.SECRET);

      const decode: any = verify(token, process.env.SECRET as string);
      console.log('Decoded Token:', decode);

      if (decode.email) {
        pool.getConnection((error, conn) => {
          if (error) {
            console.error('Erro de conexão com o banco de dados:', error);
            return response
              .status(500)
              .send({ error: 'Erro ao conectar ao banco de dados' });
          }

          conn.query(
            'SELECT * FROM user WHERE email = ?',
            [decode.email],
            (error, resultado: any[]) => {
              conn.release();

              if (error) {
                console.error('Erro na consulta ao banco de dados:', error); // Adiciona o log do erro
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
                  id: user['user-id'],
                  nome: user.name,
                  email: user.email,
                },
              });
            }
          );
        });
      } else {
        return response
          .status(400)
          .send({ error: 'Token inválido, email não encontrado' });
      }
    } catch (err) {
      console.error('Erro ao verificar o token:', err);
      return response.status(401).send({ error: 'Token inválido' });
    }
  }
}

export default UserRepository;
