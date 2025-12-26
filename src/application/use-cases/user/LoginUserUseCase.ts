import { injectable, inject } from "tsyringe";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { IUserRepository } from "@domain/repositories/IUserRepository";
import { AppError } from "@shared/errors/AppError";

interface DTO {
	email: string;
	password: string;
}

interface Response {
	token: string;
}

@injectable()
export class LoginUserUseCase {
	constructor(
		@inject("UserRepository") private userRepository: IUserRepository,
	) { }

	async execute({ email, password }: DTO): Promise<Response> {
		const user = await this.userRepository.findByEmail(email);

		if (!user) {
			throw new AppError("Email or password incorrect", 401);
		}

		const passwordMatch = await bcrypt.compare(password, user.password);

		if (!passwordMatch) {
			throw new AppError("Email or password incorrect", 401);
		}

		const secret = process.env.JWT_SECRET as string;

		const token = jwt.sign({}, secret, {
			subject: user.id,
			expiresIn: "1d",
		});

		return { token };
	}
}
