import type { Request, Response, NextFunction } from 'express';
import { IProfessor } from '../models/Professor';
declare global {
    namespace Express {
        interface Request {
            professor: IProfessor;
        }
    }
}
export declare function professorExists(req: Request, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>>>;
