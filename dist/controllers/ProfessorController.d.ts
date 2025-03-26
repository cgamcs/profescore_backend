import type { Request, Response } from 'express';
export declare class ProfessorController {
    static createProfessor: (req: Request, res: Response) => Promise<void>;
    static createProfessorWithMultipleSubjects: (req: Request, res: Response) => Promise<void>;
    static getAllProfessorsWithDetails: (req: Request, res: Response) => Promise<void>;
    static getAllProfessors: (req: Request, res: Response) => Promise<void>;
    static getFacultyProfessors: (req: Request, res: Response) => Promise<void>;
    static getProfessorById: (req: Request, res: Response) => Promise<void>;
    static updateProfessor: (req: Request, res: Response) => Promise<void>;
    static deleteProfessor: (req: Request, res: Response) => Promise<void>;
}
