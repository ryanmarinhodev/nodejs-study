import { pool } from '../../mysql';
import { v4 as uuidv4 } from 'uuid';
import { hash, compare } from 'bcryptjs';
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
          'INSERT INTO users (user_id, name, email, password) VALUES (?,?,?,?)',
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
    console.log('Login requisitado com:', request.body); // Log dos dados de login
    pool.getConnection((error: any, connection: any) => {
      if (error) {
        console.error('Erro na conexão com o banco de dados:', error);
        return response
          .status(500)
          .json({ error: 'Erro na conexão com o banco de dados' });
      }

      connection.query(
        'SELECT * FROM users WHERE email = ?',
        [email],
        (error: any, result: any[]) => {
          connection.release();
          if (error) {
            console.error('Erro na consulta ao banco de dados:', error);
            return response.status(400).json({ error: 'Erro na autenticação' });
          }

          if (!Array.isArray(result) || result.length === 0) {
            console.warn('Usuário não encontrado:', email);
            return response
              .status(404)
              .json({ error: 'Usuário não encontrado' });
          }

          const user = result[0];
          console.log('Usuário encontrado:', user); // Log do usuário encontrado

          compare(password, user.password, (err, isMatch) => {
            if (err) {
              console.error('Erro ao comparar senhas:', err);
              return response
                .status(400)
                .json({ error: 'Erro na autenticação' });
            }
            if (isMatch) {
              const token = sign(
                {
                  id: user['user_id'],
                  email: user.email,
                },
                process.env.SECRET as string,
                { expiresIn: '1d' }
              );
              console.log('Token gerado:', token); // Log do token gerado
              return response
                .status(200)
                .json({ token, message: 'Autenticado com sucesso' });
            } else {
              console.warn('Senha incorreta para o usuário:', email);
              return response.status(400).json({ error: 'Senha incorreta' });
            }
          });
        }
      );
    });
  }

  getUser(request: any, response: any) {
    console.log('request.user:', request.user); // Verifica o conteúdo do usuário decodificado
    console.log('Authorization Header:', request.headers.authorization);
    console.log(process.env.SECRET);
    console.log('Valor de process.env.SECRET:', process.env.SECRET);
    console.log(`Valor de process.env.SECRET: ${process.env.SECRET}`);

    if (!request.user || !request.user.email) {
      console.warn('Token inválido, email não encontrado. User:', request.user);
      return response
        .status(400)
        .send({ error: 'Token inválido, email não encontrado' });
    }
    try {
      const token = request.headers.authorization?.split(' ')[1];
      console.log('Token Recebido:', token);
      console.log('Ambiente:', process.env.NODE_ENV); // Verifica se o ambiente está corretamente definido

      if (!token) {
        console.warn('Token não encontrado no cabeçalho de autorização.');
        return response.status(401).send({ error: 'Token não fornecido.' });
      }

      console.log('SECRET Key:', process.env.SECRET); // Log do segredo
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
            'SELECT * FROM users WHERE email = ?',
            [decode.email],
            (error, resultado: any[]) => {
              conn.release();

              if (error) {
                console.error('Erro na consulta ao banco de dados:', error);
                return response.status(400).send({
                  error: 'Erro na consulta ao banco de dados',
                  response: null,
                });
              }

              if (!Array.isArray(resultado) || resultado.length === 0) {
                console.warn(
                  'Usuário não encontrado na consulta:',
                  decode.email
                );
                return response
                  .status(404)
                  .send({ error: 'Usuário não encontrado' });
              }

              const user = resultado[0];
              console.log('Usuário encontrado na consulta:', user); // Log do usuário encontrado

              return response.status(200).send({
                user: {
                  id: user['user_id'],
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
      console.error('Erro ao verificar o token:', err); // Log do erro
      return response.status(401).send({ error: 'Token inválido' });
    }
  }
}

export default UserRepository;
