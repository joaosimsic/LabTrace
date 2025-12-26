import { injectable, inject } from "tsyringe";
import { IOrderRepository } from "@domain/repositories/IOrderRepository";
import { OrderState } from "@domain/value-objects/order/OrderState";
import { Order } from "@domain/entities/Order";

interface DTO {
	state?: OrderState;
	page: number;
	limit: number;
}

@injectable()
export class GetOrdersUseCase {
	constructor(
		@inject("OrderRepository") private orderRepository: IOrderRepository,
	) { }

	async execute({ state, page, limit }: DTO): Promise<Order[]> {
		return await this.orderRepository.get({ state, page, limit });
	}
}
