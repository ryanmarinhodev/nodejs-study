import { createConnection, Connection } from 'mysql2/promise';

export async function getConnection(): Promise<Connection> {
  return await createConnection({
    host: 'localhost',
    user: 'root', // Usuário do MariaDB com permissão para criar novos usuários
    password: 'ryan@123', // Senha do usuário root
    database: 'api-yt-project', // Banco de dados padrão onde o comando de criação será executado
  });
}
