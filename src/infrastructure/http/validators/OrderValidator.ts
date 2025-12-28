import { z } from "zod";
import { isMongoId } from "validator";
import { ORDER_STATES } from "@domain/value-objects/order/OrderState";

export const createOrderSchema = z.object({
	body: z.object({
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
	}),
});

export const getOrdersSchema = z.object({
	body: z.object({
		state: z.enum(ORDER_STATES).optional(),
		page: z.coerce.number().min(1).default(1),
		limit: z.coerce.number().min(1).max(100).default(10),
	}),
});

export const advanceOrderSchema = z.object({
	params: z.object({
		id: z.string().refine((val) => isMongoId(val), {
			message: "Invalid Order ID format",
		}),
	}),
});

export const advanceServiceSchema = z.object({
	body: z.object({
		id: z.string().refine((val) => isMongoId(val), {
			message: "Invalid Order ID format",
		}),
		name: z.string().min(1, "Name field is required"),
	}),
});
