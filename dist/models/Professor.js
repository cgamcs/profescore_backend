"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importStar(require("mongoose"));
const ProfessorSchema = new mongoose_1.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    biography: {
        type: String,
        maxlength: [500, 'La descripción no puede exceder 500 caracteres']
    },
    department: {
        type: mongoose_1.Types.ObjectId,
        ref: 'Department',
        required: true
    },
    faculty: {
        type: mongoose_1.Types.ObjectId,
        ref: 'Faculty',
        required: true
    },
    subjects: [
        {
            type: mongoose_1.Types.ObjectId,
            ref: 'Subject',
            required: true
        }
    ],
    ratingStats: {
        totalRatings: { type: Number, default: 0 },
        averageGeneral: { type: Number, default: 0 },
        averageExplanation: { type: Number, default: 0 },
        averageAccessibility: { type: Number, default: 0 },
        averageDifficulty: { type: Number, default: 0 },
        averageAttendance: { type: Number, default: 0 },
        wouldRetakePercentage: { type: Number, default: 0 }
    }
}, { timestamps: true });
// Índice compuesto para evitar duplicados en la misma facultad
ProfessorSchema.index({ name: 1, faculty: 1 }, { unique: true, name: "unique_professor_per_faculty" });
const Professor = mongoose_1.default.model('Professor', ProfessorSchema);
exports.default = Professor;
//# sourceMappingURL=Professor.js.map