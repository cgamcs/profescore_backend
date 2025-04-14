import { Request, Response } from 'express';
import Admin from '../models/Admin';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export class AdminController {
  // Controlador para crear un nuevo administrador
  static async createAdmin(req: Request, res: Response) {
    try {
      const { email, password, name } = req.body;

      // Verificar si ya existe un admin con ese email
      const existingAdmin = await Admin.findOne({ email });
      if (existingAdmin) {
        res.status(400).json({ error: 'El administrador ya existe' })
        return 
      }

      // Generar el hash de la contraseña
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      // Crear y guardar el nuevo administrador
      const newAdmin = new Admin({
        email,
        password: hashedPassword,
        name
      });
      await newAdmin.save()

      res.status(201).json({ message: 'Administrador creado correctamente', admin: newAdmin })
    } catch (error) {
      res.status(500).json({ error: 'Error al crear el administrador', details: error.message })
    }
  }

  // Login de admin
  static async adminLogin(req: Request, res: Response) {
    const { email, password } = req.body;
    try {
      const admin = await Admin.findOne({ email })
      if (!admin) {
        res.status(401).json({ error: 'Credenciales inválidas - correo' })
        return
      }

      // Verificamos la contraseña
      const isMatch = await bcrypt.compare(password, admin.password)
      if (!isMatch) {
        res.status(401).json({ error: 'Credenciales inválidas - contraseña' })
        return
      }

      // Creamos el payload y generamos el token (validez 1 hora)
      const payload = { id: admin._id, email: admin.email };
      const token = jwt.sign(payload, process.env.JWT_SECRET || 'secret', { expiresIn: '8h' })

      res.json({ token })
    } catch (error) {
      res.status(500).json({ error: 'Error en el servidor' })
    }
  }
}