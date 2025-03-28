import type { Request, Response } from 'express';
import { IFaculty } from '../models/Faculty';
declare module 'express' {
    interface Request {
        faculty?: IFaculty;
    }
}
export declare class FacultyController {
    static createFaculty: (req: Request, res: Response) => Promise<void>;
    static getHomeData: (req: Request, res: Response) => Promise<void>;
    static getAllFaculties: (req: Request, res: Response) => Promise<void>;
    static getFacultyById: (req: Request, res: Response) => Promise<void>;
    static editFaculty: (req: Request, res: Response) => Promise<void>;
    static deleteFaculty: (req: any, res: any) => Promise<any>;
    static getFacultyDepartments: (req: Request, res: Response) => Promise<void>;
    static addDepartment: (req: Request, res: Response) => Promise<void>;
    static deleteDepartment: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
    static topRatedProfessors: (req: Request, res: Response) => Promise<void>;
}
