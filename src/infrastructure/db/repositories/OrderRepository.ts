import { injectable } from "tsyringe";
import { IOrderRepository } from "@domain/repositories/IOrderRepository";
import { Order } from "@domain/entities/Order";
import { OrderModel, IOrderDocument } from "../models/OrderModel";
import { OrderState } from "@domain/value-objects/order/OrderState";
import { Service } from "@domain/entities/Service";

@injectable()
export class OrderRepository implements IOrderRepository {
	async save(order: Order): Promise<void> {
		await OrderModel.create(order);
	}

	async get({
		state,
		page,
		limit,
	}: {
		state?: OrderState;
		page: number;
		limit: number;
	}): Promise<Order[]> {
		const query: Record<string, unknown> = {};
		if (state) query.state = state;

		const docs = await OrderModel.find(query)
			.skip((page - 1) * limit)
			.limit(limit);

		return docs.map((doc) => this.mapToEntity(doc as IOrderDocument));
	}

	async findById(id: string): Promise<Order | null> {
		const doc = await OrderModel.findById(id);
		return doc ? this.mapToEntity(doc) : null;
	}

	async update(id: string, order: Partial<Order>): Promise<void> {
		await OrderModel.findByIdAndUpdate(id, { $set: order });
	}

	private mapToEntity(doc: IOrderDocument): Order {
		return new Order(
			doc.lab,
			doc.patient,
			doc.customer,
			doc.state,
			doc.status,
			doc.services.map((s) => new Service(s.name, s.value, s.status)),
			doc._id.toString(),
		);
	}
}
