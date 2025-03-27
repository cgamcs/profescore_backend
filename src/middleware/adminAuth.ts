import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

declare global {
  namespace Express {
    interface Request {
      admin?: any;
    }
  }
}

export const adminAuth = (req: Request, res: Response, next: NextFunction) => {
  // Se espera que el token venga en el header: Authorization: Bearer <token>
  const token = req.header('Authorization')?.replace('Bearer ', '');
  if (!token) {
    res.status(401).json({ error: 'Acceso denegado, no token' })
    return
  } 

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.admin = decoded;
    next();
  } catch (error) {
    res.status(400).json({ error: 'Token inválido' });
    return
  }
};