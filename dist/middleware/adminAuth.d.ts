import { Request, Response, NextFunction } from 'express';
declare global {
    namespace Express {
        interface Request {
            admin?: any;
        }
    }
}
export declare const adminAuth: (req: Request, res: Response, next: NextFunction) => void;
