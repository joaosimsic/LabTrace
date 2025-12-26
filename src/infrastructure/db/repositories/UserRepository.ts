import { injectable } from "tsyringe";
import { IUserRepository } from "@domain/repositories/IUserRepository";
import { User } from "@domain/entities/User";
import { UserModel } from "../models/UserModel";

@injectable()
export class UserRepository implements IUserRepository {
	async findByEmail(email: string): Promise<User | null> {
		const user = await UserModel.findOne({ email });

		if (!user) return null;

		return new User(user.email, user.password, user._id.toString());
	}

	async save(user: User): Promise<void> {
		await UserModel.create(user);
	}
}
