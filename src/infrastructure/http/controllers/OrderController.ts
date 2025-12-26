import { injectable } from "tsyringe";
import { Request, Response } from "express";
import { CreateOrderUseCase } from "@application/use-cases/order/CreateOrderUseCase";
import { GetOrdersUseCase } from "@application/use-cases/order/GetOrdersUseCase";
import { handleHttpError } from "../utils/ErrorHandler";
import { OrderState } from "@domain/value-objects/order/OrderState";
import { AppError } from "@shared/errors/AppError";
import { AdvanceOrderStateUseCase } from "@application/use-cases/order/AdvanceOrderStateUseCase";
import { z } from "zod";

@injectable()
export class OrderController {
	constructor(
		private createOrderUseCase: CreateOrderUseCase,
		private getOrdersUseCase: GetOrdersUseCase,
		private advanceOrderStateUseCase: AdvanceOrderStateUseCase,
	) { }

	private createOrderSchema = z.object({
		lab: z.string().min(1, "Lab name is required"),
		patient: z.string().min(1, "Patient name is required"),
		customer: z.string().min(1, "Customer name is required"),
		services: z
			.array(
				z.object({
					name: z.string().min(1, "Service name is required"),
					value: z.number().positive("Service value must be greater than zero"),
				}),
			)
			.min(1, "Order must have at least one service"),
	});

	async create(req: Request, res: Response): Promise<Response> {
		try {
			const validatedRequest = this.createOrderSchema.parse(req.body);

			await this.createOrderUseCase.execute(validatedRequest);

			return res.status(201).json({ message: "Order was created" });
		} catch (err: unknown) {
			return handleHttpError(err, res);
		}
	}

	async get(req: Request, res: Response): Promise<Response> {
		try {
			const { state, page, limit } = req.query;

			if (!page || !limit) {
				throw new AppError("Missing page or limit parameters", 400);
			}

			const orders = await this.getOrdersUseCase.execute({
				state: state as OrderState,
				page: Number(page) || 1,
				limit: Number(limit) || 10,
			});

			return res.status(200).json(orders);
		} catch (err: unknown) {
			return handleHttpError(err, res);
		}
	}

	async advance(req: Request, res: Response): Promise<Response> {
		try {
			const { id } = req.params;

			if (!id) {
				throw new AppError("Missing order's id", 400);
			}

			await this.advanceOrderStateUseCase.execute(id);

			return res.status(200).json({ message: "Order state was advanced" });
		} catch (err: unknown) {
			return handleHttpError(err, res);
		}
	}
}
