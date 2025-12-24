import { injectable } from "tsyringe";
import { Request, Response } from "express";
import { CreateOrderUseCase } from "../../../application/use-cases/order/CreateOrderUseCase";
import { ListAllOrdersUseCase } from "../../../application/use-cases/order/ListAllOrdersUseCase";
import { handleHttpError } from "../utils/ErrorHandler";
import { OrderState } from "../../../domain/value-objects/order/OrderState";

@injectable()
export class OrderController {
	constructor(
		private createOrderUseCase: CreateOrderUseCase,
		private listAllOrdersUseCase: ListAllOrdersUseCase,
	) { }

	async create(req: Request, res: Response): Promise<Response> {
		try {
			await this.createOrderUseCase.execute(req.body);

			return res.status(201).json({ message: "Order was created" });
		} catch (err: unknown) {
			return handleHttpError(err, res);
		}
	}

	async findAll(req: Request, res: Response): Promise<Response> {
		try {
			const { state } = req.query;

			const orders = await this.listAllOrdersUseCase.execute({
				state: state as OrderState,
			});

			return res.status(200).json(orders);
		} catch (err: unknown) {
			return handleHttpError(err, res);
		}
	}
}
