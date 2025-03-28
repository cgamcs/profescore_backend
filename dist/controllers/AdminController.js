"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminController = void 0;
const Admin_1 = __importDefault(require("../models/Admin"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
class AdminController {
    // Controlador para crear un nuevo administrador
    static async createAdmin(req, res) {
        try {
            const { email, password, name } = req.body;
            // Verificar si ya existe un admin con ese email
            const existingAdmin = await Admin_1.default.findOne({ email });
            if (existingAdmin) {
                res.status(400).json({ error: 'El administrador ya existe' });
                return;
            }
            // Generar el hash de la contraseña
            const salt = await bcryptjs_1.default.genSalt(10);
            const hashedPassword = await bcryptjs_1.default.hash(password, salt);
            // Crear y guardar el nuevo administrador
            const newAdmin = new Admin_1.default({
                email,
                password: hashedPassword,
                name
            });
            await newAdmin.save();
            res.status(201).json({ message: 'Administrador creado correctamente', admin: newAdmin });
        }
        catch (error) {
            res.status(500).json({ error: 'Error al crear el administrador', details: error.message });
        }
    }
    // Login de admin
    static async adminLogin(req, res) {
        const { email, password } = req.body;
        try {
            const admin = await Admin_1.default.findOne({ email });
            if (!admin) {
                res.status(401).json({ error: 'Credenciales inválidas - correo' });
                return;
            }
            // Verificamos la contraseña
            const isMatch = await bcryptjs_1.default.compare(password, admin.password);
            if (!isMatch) {
                res.status(401).json({ error: 'Credenciales inválidas - contraseña' });
                return;
            }
            // Creamos el payload y generamos el token (validez 1 hora)
            const payload = { id: admin._id, email: admin.email };
            const token = jsonwebtoken_1.default.sign(payload, process.env.JWT_SECRET || 'secret', { expiresIn: '3h' });
            res.json({ token });
        }
        catch (error) {
            res.status(500).json({ error: 'Error en el servidor' });
        }
    }
}
exports.AdminController = AdminController;
//# sourceMappingURL=AdminController.js.map