import { verify } from 'jsonwebtoken';

const login = (req: any, res: any, next: any) => {
    
    try {
        
        const token = req.headers.authorization?.split(' ')[1]; // Extrai o token

        if (!token) {
            return res.status(401).json({ message: 'Token não fornecido' });
        }

        const decode = verify(token, process.env.Secret as string); // Verifica o token
        req.user = decode; // Define req.user com os dados decodificados
        next(); // Passa para o próximo middleware ou rota
    } catch (error) {
        return res.status(401).json({ message: 'Não autorizado ou token errado' });
    }
};

export { login };
