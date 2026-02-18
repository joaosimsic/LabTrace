import { Router } from "express";
import { container } from "tsyringe";
import { OrderController } from "../controllers/OrderController";
import { authMiddleware } from "../middlewares/authMiddleware";
import { validationMiddleware } from "../middlewares/validationMiddleware";
import {
	createOrderSchema,
	getOrdersSchema,
	advanceOrderSchema,
	advanceServiceSchema,
} from "../validators/OrderValidator";

const orderRoutes = Router();
const orderController = container.resolve(OrderController);

orderRoutes.use(authMiddleware);

orderRoutes.post("/", validationMiddleware(createOrderSchema), (req, res) =>
  orderController.create(req, res),
);
orderRoutes.get("/", validationMiddleware(getOrdersSchema), (req, res) =>
  orderController.get(req, res),
);
orderRoutes.patch(
  "/:id/advance",
  validationMiddleware(advanceOrderSchema),
  (req, res) => orderController.advance(req, res),
);

orderRoutes.patch(
  "/service",
  validationMiddleware(addServiceSchema),
  (req, res) => orderController.addService(req, res),
);

orderRoutes.delete(
	"/:id",
	validationMiddleware(advanceOrderSchema),
	(req, res) => orderController.delete(req, res),
);

orderRoutes.patch("/", validationMiddleware(advanceServiceSchema), (req, res) =>
	orderController.advanceService(req, res),
);

export { orderRoutes };
