import type { Request, Response } from 'express';
export declare class SubjectController {
    static createSubject: (req: Request, res: Response) => Promise<void>;
    static getFacultySubjects: (req: Request, res: Response) => Promise<void>;
    static getAllSubjects: (req: Request, res: Response) => Promise<void>;
    static getSubjectProfessors: (req: Request, res: Response) => Promise<void>;
    static getSubjectById: (req: Request, res: Response) => Promise<void>;
    static updateSubject: (req: Request, res: Response) => Promise<void>;
    static deleteSubject: (req: Request, res: Response) => Promise<void>;
}
