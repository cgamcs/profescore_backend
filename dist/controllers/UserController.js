"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserController = void 0;
const User_1 = __importDefault(require("../models/User"));
class UserController {
    static async getOrCreateUser(fingerprint, ip) {
        let user = await User_1.default.findOne({ fingerprint });
        if (!user) {
            user = new User_1.default({ fingerprint, ip });
            await user.save();
        }
        return user;
    }
    static async hasRatedRecently(user, professorId, subjectId) {
        const sixMonthsAgo = new Date();
        sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
        const rated = user.ratedProfessors.find(rating => rating.professorId.toString() === professorId &&
            rating.subjectId.toString() === subjectId &&
            rating.ratingDate > sixMonthsAgo);
        return !!rated;
    }
    static async addRating(user, professorId, subjectId) {
        user.ratedProfessors.push({ professorId, subjectId, ratingDate: new Date() });
        await user.save();
    }
}
exports.UserController = UserController;
//# sourceMappingURL=UserController.js.map