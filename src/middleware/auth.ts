import type { Request, Response, NextFunction } from 'express'
import { IAdmin } from '../models/Admin';
import jwt from 'jsonwebtoken'

declare global {
    namespace Express {
        interface Request {
            admin?: IAdmin;
        }
    }
}

export const adminAuth = (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ error: 'Acceso no autorizado' });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET!);
        req.admin = decoded as IAdmin;
        next();
    } catch (error) {
        res.status(401).json({ error: 'Token inválido' });
    }
};