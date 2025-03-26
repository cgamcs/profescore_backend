import { Request, Response } from 'express';
export declare class AdminController {
    static createAdmin(req: Request, res: Response): Promise<void>;
    static adminLogin(req: Request, res: Response): Promise<void>;
}
