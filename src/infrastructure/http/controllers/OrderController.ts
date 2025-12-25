import { injectable } from "tsyringe";
import { Request, Response } from "express";
import { CreateOrderUseCase } from "../../../application/use-cases/order/CreateOrderUseCase";
import { GetOrdersUseCase } from "../../../application/use-cases/order/GetOrdersUseCase";
import { handleHttpError } from "../utils/ErrorHandler";
import { OrderState } from "../../../domain/value-objects/order/OrderState";
import { AppError } from "../../../shared/errors/AppError";
import { AdvanceOrderStateUseCase } from "../../../application/use-cases/order/AdvanceOrderStateUseCase";

@injectable()
export class OrderController {
	constructor(
		private createOrderUseCase: CreateOrderUseCase,
		private getOrdersUseCase: GetOrdersUseCase,
		private advanceOrderStateUseCase: AdvanceOrderStateUseCase,
	) { }

	async create(req: Request, res: Response): Promise<Response> {
		try {
			const { lab, patient, customer, services } = req.body;

			if (!lab || !patient || !customer || !services) {
				throw new AppError("Missing required fields", 400);
			}

			await this.createOrderUseCase.execute(req.body);

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
