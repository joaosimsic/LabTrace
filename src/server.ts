import "dotenv/config";

import app from "./app";

const PORT = process.env.PORT;

const init = async () => {
	try {
		app.listen(PORT, () => console.log(`Server is running on ${PORT}`));
	} catch (err) {
		console.log("Server failed to run", err);
	}
};

init();
