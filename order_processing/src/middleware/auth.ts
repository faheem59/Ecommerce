import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import redisClient from '../config/redis';
import message from '../utils/message';
import serverConfig from '../config/server-config';
import httpStatus from 'http-status';


const authMiddleware = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
        res.status(httpStatus.UNAUTHORIZED).json({ message: message.TOKEN_NOT_FOUND });
        return;
    }

    try {
        const decoded = jwt.verify(token, serverConfig.JWT_SECRET as string) as { userId: string };

        const redisToken = await redisClient.get(`auth_token_${decoded.userId}`);

        if (redisToken === token) {
            req.userId = decoded.userId;
            next();
        } else {
            res.status(httpStatus.UNAUTHORIZED).json({ message: message.INVALID_TOKEN });
        }
    } catch (error) {
        res.status(httpStatus.UNAUTHORIZED).json({ message: message.UNAUHTORIZED });
    }
};

export default authMiddleware;
