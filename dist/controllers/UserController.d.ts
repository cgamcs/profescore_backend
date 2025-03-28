export declare class UserController {
    static getOrCreateUser(fingerprint: any, ip: any): Promise<any>;
    static hasRatedRecently(user: any, professorId: any, subjectId: any): Promise<boolean>;
    static addRating(user: any, professorId: any, subjectId: any): Promise<void>;
}
