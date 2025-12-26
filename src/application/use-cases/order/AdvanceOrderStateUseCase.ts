import { injectable, inject } from "tsyringe";
import { IOrderRepository } from "@domain/repositories/IOrderRepository";
import { AppError } from "@shared/errors/AppError";

@injectable()
export class AdvanceOrderStateUseCase {
	constructor(
		@inject("OrderRepository") private orderRepository: IOrderRepository,
	) { }

	async execute(id: string): Promise<void> {
		const order = await this.orderRepository.findById(id);

		if (!order) {
			throw new AppError("Order not found", 404);
		}

		order.advanceState();

		await this.orderRepository.update(id, order);
	}
}
