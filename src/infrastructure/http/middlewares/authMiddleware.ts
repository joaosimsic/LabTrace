import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { AppError } from "@shared/errors/AppError";

interface IPayload {
	sub: string;
}

export function authMiddleware(
	req: Request,
	_res: Response,
	next: NextFunction,
): void {
	const authHeader = req.headers.authorization;

	if (!authHeader) {
		throw new AppError("Token missing", 401);
	}

	const [, token] = authHeader.split(" ");

	try {
		const secret = process.env.JWT_SECRET as string;
		const { sub: user_id } = jwt.verify(token, secret) as IPayload;

		req.user = { id: user_id };

		return next();
	} catch {
		throw new AppError("Invalid token", 401);
	}
}
