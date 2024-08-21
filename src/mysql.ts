import mysql from 'mysql2';

const pool = mysql.createPool({
    user: 'root',
    password: 'ryan@123',
    database: 'api-yt-project',
    host: 'localhost',
    port: 3306,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

export { pool };
