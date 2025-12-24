import "reflect-metadata";
import "./shared/container";
import express, { Application } from "express";
import { initMongoConnection } from "./infrastructure/db/mongoConnection";
import { orderRoutes } from "./infrastructure/http/routes/orderRoutes";

class App {
	app: Application;

	constructor() {
		this.app = express();
		this.middlewares();
		this.routes();
		this.dbs();
	}

	dbs(): void {
		initMongoConnection();
	}

	middlewares(): void {
		this.app.use(express.json());
	}

	routes(): void {
		this.app.use("/orders", orderRoutes);
	}
}

export default new App().app;
