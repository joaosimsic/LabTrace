import { injectable, inject } from "tsyringe";
import { Order } from "../../../domain/entities/Order";
import { IOrderRepository } from "../../../domain/repositories/IOrderRepository";
import { Service } from "../../../domain/entities/Service";

interface DTO {
	lab: string;
	patient: string;
	customer: string;
	services: { name: string; value: number }[];
}

@injectable()
export class CreateOrderUseCase {
	constructor(
		@inject("OrderRepository") private orderRepository: IOrderRepository,
	) { }

	async execute({
		lab,
		patient,
		customer,
		services,
	}: DTO): Promise<void> {
		const servicesArr = services.map(
			(s) => new Service(s.name, s.value, "PENDING"),
		);

		const order = new Order(
			lab,
			patient,
			customer,
			"CREATED",
			"ACTIVE",
			servicesArr,
		);

		await this.orderRepository.save(order);
	}
}
