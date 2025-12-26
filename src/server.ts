import "dotenv/config";

import { appInstance } from "@/app";

const PORT = process.env.PORT;

const init = async (): Promise<void> => {
	try {
		await appInstance.dbs();

		appInstance.app.listen(PORT, () =>
			console.log(`Server is running on ${PORT}`),
		);
	} catch (err) {
		console.log("Server failed to run", err);
	}
};

init();
