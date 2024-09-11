import { verify } from 'jsonwebtoken'


const login = (req: any, res:any, next:any) => {
    try {
        const decode = verify(req.headers.authorization, process.env.Secret as string);
        req.user = decode;
        next();
    } catch(error) {
        return res.status(401).json({message: 'Não autorizado'})
    }
}

export {login};