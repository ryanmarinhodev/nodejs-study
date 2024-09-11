import mysql from 'mysql2';
import { config } from 'dotenv'

config()

const pool = mysql.createPool({
    "user": process.env.USER_DATABASE,
    "password": process.env.PASSWORD,
    "database": process.env.DATABASE,
    "host": process.env.HOST_DATABASE,
    "port": Number(process.env.PORTA_DATABASE)
});

export { pool };
