"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminAuth = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const adminAuth = (req, res, next) => {
    // Se espera que el token venga en el header: Authorization: Bearer <token>
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) {
        res.status(401).json({ error: 'Acceso denegado, no token' });
        return;
    }
    try {
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET || 'secret');
        req.admin = decoded;
        next();
    }
    catch (error) {
        res.status(400).json({ error: 'Token inválido' });
    }
};
exports.adminAuth = adminAuth;
//# sourceMappingURL=adminAuth.js.map