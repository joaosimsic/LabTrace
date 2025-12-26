import { Request, Response } from "express";
import { injectable } from "tsyringe";
import { CreateUserUseCase } from "@application/use-cases/user/CreateUserUseCase";
import { LoginUserUseCase } from "@application/use-cases/user/LoginUserUseCase";
import { handleHttpError } from "../utils/ErrorHandler";
import { AppError } from "@shared/errors/AppError";
import validator from "validator";
import { z } from "zod";

@injectable()
export class AuthController {
	constructor(
		private createUserUseCase: CreateUserUseCase,
		private loginUserUseCase: LoginUserUseCase,
	) { }

	private authSchema = z.object({
		email: z.string().min(1, "Email is required").trim().toLowerCase(),
		password: z
			.string()
			.min(6, "Password must be at least 6 characters")
			.max(72, "Password is too long"),
	});

	async create(req: Request, res: Response): Promise<Response> {
		try {
			const { email, password } = this.authSchema.parse(req.body);

			if (!validator.isEmail(email)) {
				throw new AppError("Invalid email format", 400);
			}

			await this.createUserUseCase.execute({
				email,
				password,
			});

			return res.status(201).json({ message: "User created" });
		} catch (err: unknown) {
			return handleHttpError(err, res);
		}
	}

	async login(req: Request, res: Response): Promise<Response> {
		try {
			const validatedRequest = this.authSchema.parse(req.body);

			const result = await this.loginUserUseCase.execute(validatedRequest);

			return res.status(200).json(result);
		} catch (err: unknown) {
			return handleHttpError(err, res);
		}
	}
}
