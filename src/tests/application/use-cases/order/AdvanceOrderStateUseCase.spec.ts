import { describe, it, expect, vi, beforeEach } from "vitest";
import { AdvanceOrderStateUseCase } from "../../../../application/use-cases/order/AdvanceOrderStateUseCase";
import { IOrderRepository } from "../../../../domain/repositories/IOrderRepository";
import { Order } from "../../../../domain/entities/Order";
import { AppError } from "../../../../shared/errors/AppError";

describe("AdvanceOrderStateUseCase", () => {
	let sut: AdvanceOrderStateUseCase;
	let orderRepositoryMock: IOrderRepository;

	beforeEach(() => {
		orderRepositoryMock = {
			save: vi.fn(),
			get: vi.fn(),
			findById: vi.fn(),
			update: vi.fn(),
		};
		sut = new AdvanceOrderStateUseCase(orderRepositoryMock);
	});

	it("should find order, advance state, and update repository", async () => {
		const order = new Order("Lab", "Pat", "Cust", "CREATED", "ACTIVE", []);

		vi.mocked(orderRepositoryMock.findById).mockResolvedValue(order);

		await sut.execute("some-id");

		expect(orderRepositoryMock.findById).toHaveBeenCalledWith("some-id");
		expect(order.state).toBe("ANALYSIS");
		expect(orderRepositoryMock.update).toHaveBeenCalledWith("some-id", order);
	});

	it("should throw error if order is not found", async () => {
		vi.mocked(orderRepositoryMock.findById).mockResolvedValue(null);

		await expect(sut.execute("invalid-id")).rejects.toBeInstanceOf(AppError);
	});
});
