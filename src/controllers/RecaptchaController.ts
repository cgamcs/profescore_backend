import { Request, Response, NextFunction } from 'express';
import axios from 'axios';

const RECAPTCHA_SECRET_KEY = process.env.SECRET_KEY; // Reemplaza con tu secret key

export const verifyRecaptcha = async (req: Request, res: Response, next: NextFunction) => {
  const { captcha } = req.body;

  try {
    const response = await axios.post(
      `https://www.google.com/recaptcha/api/siteverify?secret=${RECAPTCHA_SECRET_KEY}&response=${captcha}`
    );

    if (response.data.success) {
      next();
    } else {
      res.status(400).json({ error: 'Verificación de reCAPTCHA fallida' });
    }
  } catch (error) {
    console.error('Error al verificar reCAPTCHA:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};