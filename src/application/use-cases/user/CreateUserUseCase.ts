import { injectable, inject } from "tsyringe";
import bcrypt from "bcryptjs";
import { IUserRepository } from "@domain/repositories/IUserRepository";
import { User } from "@domain/entities/User";
import { AppError } from "@shared/errors/AppError";

interface DTO {
	email: string;
	password: string;
}

@injectable()
export class CreateUserUseCase {
	constructor(
		@inject("UserRepository") private userRepository: IUserRepository,
	) { }

	async execute({ email, password }: DTO): Promise<void> {
		const user = await this.userRepository.findByEmail(email);

		if (user) {
			throw new AppError("User already exists", 400);
		}

		const hashedPassword = await bcrypt.hash(password, 8);
		const newUser = new User(email, hashedPassword);

		await this.userRepository.save(newUser);
	}
}
