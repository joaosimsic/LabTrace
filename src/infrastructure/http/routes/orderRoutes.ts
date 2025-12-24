import { Router } from "express";
import { container } from "tsyringe";
import { OrderController } from "../controllers/OrderController";

const orderRoutes = Router();
const orderController = container.resolve(OrderController);

orderRoutes.post("/", (req, res) => orderController.create(req, res));
orderRoutes.post("/all", (req, res) => orderController.findAll(req, res));

export { orderRoutes };
