import { describe, it, expect, vi, beforeEach } from "vitest";
import { CreateOrderUseCase } from "@application/use-cases/order/CreateOrderUseCase";
import { IOrderRepository } from "@domain/repositories/IOrderRepository";

describe("CreateOrderUseCase", () => {
	let createOrderUseCase: CreateOrderUseCase;
	let orderRepositoryMock: IOrderRepository;

	beforeEach(() => {
		orderRepositoryMock = {
			save: vi.fn(),
			get: vi.fn(),
			findById: vi.fn(),
			update: vi.fn(),
		};
		createOrderUseCase = new CreateOrderUseCase(orderRepositoryMock);
	});

	it("should create an order with correct initial values", async () => {
		const input = {
			lab: "Lab X",
			patient: "Patient Y",
			customer: "Customer Z",
			services: [{ name: "Hemogram", value: 50 }],
		};

		await createOrderUseCase.execute(input);

		expect(orderRepositoryMock.save).toHaveBeenCalledTimes(1);

		const savedOrder = vi.mocked(orderRepositoryMock.save).mock.calls[0][0];
		expect(savedOrder.lab).toBe(input.lab);
		expect(savedOrder.state).toBe("CREATED");
		expect(savedOrder.services[0].status).toBe("PENDING");
	});
});
