import express, { json, Request, Response } from 'express';
import { createConnection } from 'mysql2/promise';

// Função para estabelecer conexão com o banco de dados
async function getConnection() {
  return await createConnection({
    host: 'localhost',
    user: 'root', // Usuário do MariaDB com permissão para criar novos usuários
    password: 'ryan@123', // Senha do usuário root
    database: 'api-yt-project', // Banco de dados padrão onde o comando de criação será executado
  });
}

async function createUser(username: string, password: string): Promise<void> {
  const connection = await getConnection();

  const sql = `
    CREATE USER '${username}'@'localhost' IDENTIFIED BY '${password}';
    GRANT ALL PRIVILEGES ON *.* TO '${username}'@'localhost' WITH GRANT OPTION;
    FLUSH PRIVILEGES;
  `;

  try {
    await connection.query(sql);
    console.log(`Usuário ${username} criado com sucesso!`);
  } catch (error) {
    console.error('Erro ao criar o usuário:', error); 
    
  } finally {
    await connection.end();
  }
}

const app = express();
app.use(express.json());


app.post('/test', async (req: Request, res: Response) => {
    console.log('Rota /test acessada'); // Log para verificar se a rota é acessada
    const { username, password } = req.body;
    console.log('Dados recebidos:', { username, password });
  
    try {
      await createUser(username, password);
      res.status(200).send(`Usuário ${username} criado com sucesso!`);
    } catch (error) {
      console.error('Erro ao criar o usuário:', error);
      res.status(500).send('Erro ao criar o usuário');
    }
  });

const PORT = 4000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
  console.log('Esta mensagem confirma que o código mais recente está rodando.');
});
