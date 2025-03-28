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
const SubjectSchema = new mongoose_1.Schema({
    name: {
        type: String,
        required: [true, 'El nombre de la materia es obligatorio'],
        unique: false,
        trim: true
    },
    credits: {
        type: Number,
        required: true,
        min: [1, 'Los créditos deben ser al menos 1'],
        max: [6, 'Los créditos no pueden exceder 6']
    },
    description: {
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
    professors: [
        {
            type: mongoose_1.Types.ObjectId,
            ref: 'Professor'
        }
    ]
}, { timestamps: true });
SubjectSchema.index({ name: 1, faculty: 1 }, {
    unique: true,
    name: "unique_subject_per_faculty",
    partialFilterExpression: { faculty: { $exists: true } }
});
const Subject = mongoose_1.default.model('Subject', SubjectSchema);
exports.default = Subject;
//# sourceMappingURL=Subject.js.map