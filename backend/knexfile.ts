import type {Knex} from "knex";
import dotenv from "dotenv";

// Load environment variables from .env file
dotenv.config();

const config: {[key: string]: Knex.Config} = {
	development: {
		client: "pg",
		connection: {
			host: process.env.DB_HOST,
			port: parseInt(process.env.DB_PORT || "5432", 10),
			database: process.env.DB_NAME,
			user: process.env.DB_USER,
			password: process.env.DB_PASS,
		},
		migrations: {
			directory: "./src/db/migrations",
			extension: "ts",
		},
		seeds: {
			directory: "./src/db/seeds",
			extension: "ts",
		},
	},

	test: {
		client: "pg",
		connection: process.env.TEST_DATABASE_URL,
		migrations: {
			directory: "./src/db/migrations",
			extension: "ts",
		},
		seeds: {
			directory: "./src/db/seeds",
			extension: "ts",
		},
	},

	production: {
		client: "pg",
		connection: process.env.DATABASE_URL,
		migrations: {
			directory: "./src/db/migrations",
			extension: "ts",
		},
		seeds: {
			directory: "./src/db/seeds",
			extension: "ts",
		},
	},
};

export default config;
