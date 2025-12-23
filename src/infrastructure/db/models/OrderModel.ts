import mongoose, { Schema, Document } from "mongoose";
import { OrderState } from "../../../domain/value-objects/OrderState";
import { OrderStatus } from "../../../domain/value-objects/OrderStatus";

export interface IOrderDocument extends Document {
	lab: string;
	patient: string;
	customer: string;
	state: OrderState;
	status: OrderStatus;
	services: {
		name: string;
		value: number;
		status: "PENDING" | "DONE";
	}[];
}

const OrderSchema = new Schema({
	lab: { type: String, required: true },
	patient: { type: String, required: true },
	customer: { type: String, required: true },
	state: {
		type: String,
		enum: ["CREATED", "ANALYSIS", "COMPLETED"],
		default: "CREATED",
	},
	status: { type: String, enum: ["ACTIVE", "DELETED"], default: "ACTIVE" },
	services: [
		{
			name: { type: String, required: true },
			value: { type: Number, required: true },
			status: { type: String, enum: ["PENDING", "DONE"], default: "PENDING" },
		},
	],
});

export const OrderModel = mongoose.model("Order", OrderSchema);
