import { describe, it, expect } from "vitest";
import { Order } from "../../../domain/entities/Order";
import { Service } from "../../../domain/entities/Service";
import { AppError } from "../../../shared/errors/AppError";
import { OrderState } from "../../../domain/value-objects/order/OrderState";

describe("Order Entity", () => {
	const createOrder = (state: OrderState = "CREATED"): Order => {
		return new Order("Test Lab", "John Doe", "Customer A", state, "ACTIVE", [
			new Service("Blood Test", 100, "PENDING"),
		]);
	};

	it("should advance state from CREATED to ANALYSIS", () => {
		const order = createOrder("CREATED");
		order.advanceState();
		expect(order.state).toBe("ANALYSIS");
	});

	it("should advance state from ANALYSIS to COMPLETED", () => {
		const order = createOrder("ANALYSIS");
		order.advanceState();
		expect(order.state).toBe("COMPLETED");
	});

	it("should throw an error when trying to advance from COMPLETED", () => {
		const order = createOrder("COMPLETED");
		expect(() => order.advanceState()).toThrow(AppError);
	});
});
