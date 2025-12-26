import { describe, it, expect, vi, beforeEach } from "vitest";
import { CreateUserUseCase } from "../../../../application/use-cases/user/CreateUserUseCase";
import { IUserRepository } from "../../../../domain/repositories/IUserRepository";
import { AppError } from "../../../../shared/errors/AppError";
import { User } from "../../../../domain/entities/User";

describe("CreateUserUseCase", () => {
	let createUserUseCase: CreateUserUseCase;
	let userRepositoryMock: IUserRepository;

	beforeEach(() => {
		userRepositoryMock = {
			findByEmail: vi.fn(),
			save: vi.fn(),
		};
		createUserUseCase = new CreateUserUseCase(userRepositoryMock);
	});

	it("should create a new user successfully", async () => {
		vi.mocked(userRepositoryMock.findByEmail).mockResolvedValue(null);

		await createUserUseCase.execute({
			email: "test@example.com",
			password: "password123",
		});

		expect(userRepositoryMock.findByEmail).toHaveBeenCalledWith(
			"test@example.com",
		);
		expect(userRepositoryMock.save).toHaveBeenCalled();
	});

	it("should throw error if user already exists", async () => {
		vi.mocked(userRepositoryMock.findByEmail).mockResolvedValue({
			email: "test@example.com",
			password: "hashed",
		} as User);

		await expect(
			createUserUseCase.execute({
				email: "test@example.com",
				password: "password123",
			}),
		).rejects.toBeInstanceOf(AppError);
	});
});
