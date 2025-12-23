import { Order } from "../entities/Order";
import { OrderState } from "../value-objects/OrderState";

export interface IOrderRepository {
	save(order: Order): Promise<void>;
	findAll(filters: { state?: OrderState }): Promise<Order[]>;
	findById(id: string): Promise<Order | null>;
	update(id: string, order: Partial<Order>): Promise<void>;
}
