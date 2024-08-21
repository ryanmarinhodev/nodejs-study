import express from 'express';
import { pool } from './mysql';
import { v4 as uuidv4 } from 'uuid';
import { hash } from 'bcrypt';
import jwt from 'jsonwebtoken';

const app = express();
app.use(express.json());

const JWT_SECRET = 'your_secret_key'; // Certifique-se de que esta chave está configurada corretamente

app.post('/user', (request, response) => {
  const { name, email, password } = request.body;
  
  pool.getConnection((error: any, connection: any) => {
    if (error) {
      return response.status(500).json({ error });
    }

    hash(password, 10, (err, hashedPassword) => {
      if (err) {
        return response.status(500).json({ error: err });
      }

      const userId = uuidv4();

      connection.query(
        'INSERT INTO users (user_id, name, email, password) VALUES (?,?,?,?)',
        [userId, name, email, hashedPassword],
        (error: any, result: any, fields: any) => {
          connection.release();
          if (error) {
            return response.status(400).json({ error });
          }

          // Gerar o token JWT
          const token = jwt.sign(
            {
              user_id: userId,
              name,
              email
            },
            JWT_SECRET,
            { expiresIn: '1h' } // O token expira em 1 hora
          );

          // Retornar o token junto com a resposta de sucesso
          return response.status(200).json({ success: true, token });
        }
      );
    });
  });
});

app.listen(4000, () => {
  console.log('Server is running on port 4000');
});
