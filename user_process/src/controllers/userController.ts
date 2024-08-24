import { Request, Response } from 'express';
import User from '../models/userModel';
import { hash, compare } from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import redisClient from '../config/redis';
import message from '../utils/message';
import _enum from '../utils/enum';
import { channel } from '../config/rabbitmq';
import httpStatus from 'http-status';
import serverConfig from '../config/server-config';

export const register = async (req: Request, res: Response): Promise<void> => {
    try {
        const { username, email, password } = req.body;

        if (!username || !email || !password) {
            res.status(httpStatus.BAD_REQUEST).json({ message: message.ALL_FIELDS_REQUIRED });
            return;
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            res.status(httpStatus.BAD_REQUEST).json({ message: message.USER_ALREADY_EXISTS });
            return;
        }

        const hashedPassword = await hash(password, 10);

        const user = new User({
            userId: uuidv4(),
            username,
            email,
            password: hashedPassword
        });
        await user.save();

        if (channel) {
            const msg = JSON.stringify({ userId: user.userId, email: user.email });
            channel.sendToQueue(_enum.USER_CREATED, Buffer.from(msg));
            console.log('User created message sent to RabbitMQ');
        }
        res.status(httpStatus.CREATED).json({ message: message.USER_CREATED });
    } catch (error) {
        res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ message: message.INTERNAL_SERVER_ERROR, error });
    }
};

export const login = async (req: Request, res: Response): Promise<void> => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            res.status(httpStatus.BAD_REQUEST).json({ message: message.ALL_FIELDS_REQUIRED });
            return;
        }

        const user = await User.findOne({ email });
        if (!user) {
            res.status(httpStatus.BAD_REQUEST).json({ message: message.INVALID_EMAIL_OR_PASSWORD });
            return;
        }

        const isMatch = await compare(password, user.password);
        if (!isMatch) {
            res.status(httpStatus.BAD_REQUEST).json({ message: message.INVALID_EMAIL_OR_PASSWORD });
            return;
        }

        const token = jwt.sign({ userId: user._id }, serverConfig.JWT_SECRET as string, { expiresIn: '1h' });

        await redisClient.set(`auth_token_${user._id}`, token, { EX: 3600 });

        res.status(httpStatus.OK).json({ token });
    } catch (error) {
        res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ message: message.INTERNAL_SERVER_ERROR, error });
    }
};

export const logout = (req: Request, res: Response): void => {
    try {
        res.status(httpStatus.OK).json({ message: message.LOGOUT_USER });
    } catch (error) {
        res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ message: message.INTERNAL_SERVER_ERROR, error });
    }
};

export const getUserById = async (req: Request, res: Response): Promise<void> => {
    try {
        const { userId } = req.params;

        if (!userId) {
            res.status(httpStatus.BAD_REQUEST).json({ message: message.USER_ID_REQUIRED });
            return;
        }

        const user = await User.findOne({ userId });
        if (!user) {
            res.status(httpStatus.NOT_FOUND).json({ message: message.USER_NOT_FOUND });
            return;
        }

        res.status(httpStatus.OK).json(user);
    } catch (error) {
        res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ message: message.INTERNAL_SERVER_ERROR, error });
    }
};
