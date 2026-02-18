import { ServiceStatus } from "../value-objects/service/ServiceStatus";
import { AppError } from "@/shared/errors/AppError";

export class Service {
	constructor(
		public name: string,
		public value: number,
		public status: ServiceStatus,
	) { }

	public advanceStatus(): void {
		const nextStatusMap: Record<ServiceStatus, ServiceStatus | null> = {
			PENDING: "DONE",
			DONE: null,
		};

		const nextStatus = nextStatusMap[this.status];

		if (!nextStatus) {
			throw new AppError(
				`Cannot advance service status from ${this.status}`,
				403,
			);
		}

		this.status = nextStatus;
	}
}
