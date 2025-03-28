import { Request, Response } from 'express';
export declare class RatingController {
    static createRating: (req: Request, res: Response) => Promise<void>;
    static getProfessorRatings: (req: Request, res: Response) => Promise<void>;
    static voteHelpful: (req: Request, res: Response) => Promise<void>;
    private static updateProfessorStats;
}
