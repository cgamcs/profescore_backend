import User from '../models/User';

export class UserController {
  static async getOrCreateUser(fingerprint, ip) {
    let user = await User.findOne({ fingerprint });
    if (!user) {
      user = new User({ fingerprint, ip });
      await user.save();
    }
    return user;
  }

  static async hasRatedRecently(user, professorId, subjectId) {
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const rated = user.ratedProfessors.find(rating =>
      rating.professorId.toString() === professorId &&
      rating.subjectId.toString() === subjectId &&
      rating.ratingDate > sixMonthsAgo
    );

    return !!rated;
  }

  static async addRating(user, professorId, subjectId) {
    user.ratedProfessors.push({ professorId, subjectId, ratingDate: new Date() });
    await user.save();
  }
}