import Knex from "knex";
import {Model, knexSnakeCaseMappers} from "objection";
import dotenv from "dotenv";

// Load environment variables from .env file
dotenv.config();

const knex = Knex({
	client: "pg",
	connection: {
		host: process.env.DB_HOST,
		port: parseInt(process.env.DB_PORT || "5432", 10),
		database: process.env.DB_NAME,
		user: process.env.DB_USER,
		password: process.env.DB_PASS,
	},
	pool: {
		min: 2,
		max: 10,
	},
	...knexSnakeCaseMappers(),
});

// Bind all Models to the knex instance
Model.knex(knex);

export default knex;
