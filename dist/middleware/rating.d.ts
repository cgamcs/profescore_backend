import type { Request, Response, NextFunction } from 'express';
import { IRating } from '../models/Rating';
declare global {
    namespace Express {
        interface Request {
            rating: IRating;
        }
    }
}
export declare function ratingExists(req: Request, res: Response, next: NextFunction): Promise<void>;
export declare function ratingBelongsToProfessor(req: Request, res: Response, next: NextFunction): Promise<void>;
