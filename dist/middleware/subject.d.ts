import type { Request, Response, NextFunction } from 'express';
import { ISubject } from '../models/Subject';
declare global {
    namespace Express {
        interface Request {
            subject: ISubject;
        }
    }
}
export declare function subjectExists(req: Request, res: Response, next: NextFunction): Promise<void>;
export declare function subjectBelongsToFaculty(req: Request, res: Response, next: NextFunction): void;
