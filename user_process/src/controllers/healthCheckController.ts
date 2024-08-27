
import { Request, Response } from 'express';
import httpStatus from 'http-status';

const getHealthStatus = (req: Request, res: Response): void => {
    res.status(httpStatus.OK).json({
        status: 'ok',
        timestamp: new Date()
    });
};

export { getHealthStatus };
