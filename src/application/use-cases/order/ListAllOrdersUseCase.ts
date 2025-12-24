import { injectable, inject } from "tsyringe";
import { IOrderRepository } from "../../../domain/repositories/IOrderRepository";
import { OrderState } from "../../../domain/value-objects/order/OrderState";
import { Order } from "../../../domain/entities/Order";

interface DTO {
	state?: OrderState;
}

@injectable()
export class ListAllOrdersUseCase {
	constructor(
		@inject("OrderRepository") private orderRepository: IOrderRepository,
	) { }

	async execute(filter: DTO): Promise<Order[]> {
		return await this.orderRepository.findAll(filter);
	}
}
