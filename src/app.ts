import express from "express";
import { initMongoConnection } from "./infrastructure/db/mongoConnection";

class App {
	app;

	constructor() {
		this.app = express();
		this.middlewares();
		this.routes();
		this.dbs();
	}

	middlewares() {
		this.app.use(express.json());
	}

	routes() {
		// this.app.use('/', assad);
	}

	dbs() {
		const db = initMongoConnection();	
		console.log(db);
	}
}

export default new App().app;
