import { injectable, inject } from "tsyringe";
import { IOrderRepository } from "@domain/repositories/IOrderRepository";
import { AppError } from "@shared/errors/AppError";

@injectable()
export class AdvanceServiceStatusUseCase {
	constructor(
		@inject("OrderRepository") private orderRepository: IOrderRepository,
	) { }

	async execute(id: string, name: string): Promise<void> {
		const order = await this.orderRepository.findById(id);

		if (!order) {
			throw new AppError("Order not found", 404);
		}

		const service = order.services.find((s) => s.name === name);

		if (!service) {
			throw new AppError("Service not found", 404);
		}

		service.advanceStatus();

		await this.orderRepository.update(id, order);
	}
}
