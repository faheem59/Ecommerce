
// import { Request, Response, NextFunction } from 'express';
// import jwt from 'jsonwebtoken';
// import redisClient from '../config/redis';
// import serverConfig from '../config/server-config';

// const authMiddleware = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
//     const token = req.headers.authorization?.split(' ')[1];
//     if (!token) {
//         res.status(401).json({ message: 'No token provided' });
//         return;
//     }

//     try {
//         const decoded = jwt.verify(token, serverConfig.JWT_SECRET as string) as { userId: string };
//         const redisToken = await redisClient.get(`auth_token_${decoded.userId}`);

//         if (redisToken === token) {
//             req.userId = decoded.userId;
//             next();
//         } else {
//             res.status(401).json({ message: 'Invalid token' });
//         }
//     } catch (error) {
//         res.status(401).json({ message: 'Unauthorized' });
//     }
// };

// export default authMiddleware;
