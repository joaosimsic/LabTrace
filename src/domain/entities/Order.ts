import { OrderState } from "../value-objects/order/OrderState";
import { OrderStatus } from "../value-objects/order/OrderStatus";
import { AppError } from "@application/exceptions/AppError";
import { Service } from "./Service";

export class Order {
  constructor(
    public lab: string,
    public patient: string,
    public customer: string,
    public state: OrderState,
    public status: OrderStatus,
    public services: Service[],
    public readonly id?: string,
  ) {}

	private allServicesDone(): boolean {
		return this.services.every((s) => s.status === "DONE");
	}

	public advanceState(): void {
		const nextStateMap: Record<OrderState, OrderState | null> = {
			CREATED: "ANALYSIS",
			ANALYSIS: "COMPLETED",
			COMPLETED: null,
		};

    const nextState = nextStateMap[this.state];

		if (!nextState) {
			throw new AppError(`Cannot advance order state from ${this.state}`, 403);
		}

		if (nextState === "COMPLETED" && !this.allServicesDone()) {
			throw new AppError(
				"All services must be completed before finishing the order",
				403,
			);
		}

		this.state = nextState;
	}

	public delete(): void {
		this.status = "DELETED";
	}
}
