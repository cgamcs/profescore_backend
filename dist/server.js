"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const cors_1 = __importDefault(require("cors"));
const cors_2 = __importDefault(require("./config/cors"));
const db_1 = require("./config/db");
const facultyRoutes_1 = __importDefault(require("./routes/facultyRoutes"));
const adminRoutes_1 = __importDefault(require("./routes/adminRoutes"));
dotenv_1.default.config();
(0, db_1.connectDB)();
const app = (0, express_1.default)();
app.use((0, cors_1.default)(cors_2.default));
app.use(express_1.default.json());
// Rutas públicas
app.use('/api/faculties', facultyRoutes_1.default);
// Rutas administrativas (login y operaciones protegidas)
app.use('/api/admin', adminRoutes_1.default);
exports.default = app;
//# sourceMappingURL=server.js.map