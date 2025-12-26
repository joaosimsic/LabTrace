import { container } from "tsyringe";
import { IUserRepository } from "@domain/repositories/IUserRepository";
import { UserRepository } from "@infrastructure/db/repositories/UserRepository";

container.registerSingleton<IUserRepository>("UserRepository", UserRepository);
