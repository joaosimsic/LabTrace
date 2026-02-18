import { injectable, inject } from "tsyringe";
import { IOrderRepository } from "@domain/repositories/IOrderRepository";
import { AppError } from "@shared/errors/AppError";

@injectable()
export class DeleteOrderUseCase {
	constructor(
		@inject("OrderRepository") private orderRepository: IOrderRepository,
	) { }

	async execute(id: string): Promise<void> {
		const order = await this.orderRepository.findById(id);

		if (!order) {
			throw new AppError("Order not found", 404);
		}

		if (order.state === "COMPLETED") {
			throw new AppError("Completed orders cannot be deleted", 403);
		}

		order.delete();

		await this.orderRepository.update(id, order);
	}
}
