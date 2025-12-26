import { container } from "tsyringe";
import { IOrderRepository } from "@domain/repositories/IOrderRepository";
import { OrderRepository } from "@infrastructure/db/repositories/OrderRepository";

container.registerSingleton<IOrderRepository>(
	"OrderRepository",
	OrderRepository,
);
