import { Request, Response } from 'express';
import Admin from '../models/Admin';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

export class AuthController {
    static adminLogin = async (req: Request, res: Response) => {
        const { email, password } = req.body;
        
        try {
            // Buscar admin
            const admin = await Admin.findOne({ email });
            if (!admin) {
                res.status(404).json({ error: 'Credenciales inválidas' })
                return 
            }

            // Validar contraseña
            const isValidPassword = await bcrypt.compare(password, admin.password);
            
            if (!isValidPassword) {
                res.status(400).json({ error: 'Credenciales inválidas' })
                return 
            }

            // Generar JWT
            const token = jwt.sign(
                { id: admin._id, email: admin.email },
                process.env.JWT_SECRET!,
                { expiresIn: '2h' }
            );

            res.json({ token });

        } catch (error) {
            res.status(500).json({ error: 'Error en el servidor' });
        }
    }
}