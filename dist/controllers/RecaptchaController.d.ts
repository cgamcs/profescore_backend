import { Request, Response, NextFunction } from 'express';
export declare const verifyRecaptcha: (req: Request, res: Response, next: NextFunction) => Promise<void>;
