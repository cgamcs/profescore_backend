"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyRecaptcha = void 0;
const axios_1 = __importDefault(require("axios"));
const RECAPTCHA_SECRET_KEY = process.env.SECRET_KEY; // Reemplaza con tu secret key
const verifyRecaptcha = async (req, res, next) => {
    const { captcha } = req.body;
    try {
        const response = await axios_1.default.post(`https://www.google.com/recaptcha/api/siteverify?secret=${RECAPTCHA_SECRET_KEY}&response=${captcha}`);
        if (response.data.success) {
            next();
        }
        else {
            res.status(400).json({ error: 'Verificación de reCAPTCHA fallida' });
        }
    }
    catch (error) {
        console.error('Error al verificar reCAPTCHA:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};
exports.verifyRecaptcha = verifyRecaptcha;
//# sourceMappingURL=RecaptchaController.js.map