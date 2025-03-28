import { Request, Response } from 'express';
export declare class DashboardController {
    static getRecentActivities: (req: Request, res: Response) => Promise<void>;
    static getDashboardStats: (req: Request, res: Response) => Promise<void>;
}
