import express from 'express';
import { pool } from './mysql';
import { v4 as uuidv4 } from 'uuid';
import { hash, compare } from 'bcrypt';
import { sign } from 'jsonwebtoken';

const app = express();
app.use(express.json());

app.post('/user/sign-up', (request, response) => {
  const { name, email, password } = request.body;
  pool.getConnection((error: any, connection: any) => {
    if (error) {
      return response.status(500).json({ error });
    }

    hash(password, 10, (err, hashedPassword) => {
      if (err) {
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
          response.status(200).json({ success: true });
        }
      );
    });
  });
});

app.post('/user/sign-in', (request, response) => {
  const { email, password } = request.body;
  pool.getConnection((error: any, connection: any) => {
    if (error) {
      return response.status(500).json({ error: "Erro na conexão com o banco de dados" });
    }

    connection.query(
      'SELECT * FROM users WHERE email = ?',
      [email],
      (error: any, result: any[]) => {
        connection.release();
        if (error) {
          return response.status(400).json({ error: "Erro na autenticação" });
        }

        if (result.length === 0) {
          return response.status(400).json({ error: "Usuário não encontrado" });
        }

        const user = result[0]; // Acessando a primeira posição do array

        compare(password, user.password, (err, isMatch) => {
          if (err) {
            return response.status(400).json({ error: "Erro na autenticação" });
          }

          if (isMatch) {
            const token = sign(
              {
                id: user.user_id,
                email: user.email
              },
              "segredo",
              { expiresIn: "1d" }
            );

            console.log(token);
            return response.status(200).json({ token });
          } else {
            return response.status(400).json({ error: "Senha incorreta" });
          }
        });
      }
    );
  });
});

app.listen(4000, () => {
  console.log('Server is running on port 4000');
});
