import type {Knex} from "knex";

export async function up(knex: Knex): Promise<void> {
	await knex.schema.createTable("task", table => {
		table.uuid("id").primary().defaultTo(knex.raw("gen_random_uuid()"));
		table.uuid("meme_id").notNullable().references("id").inTable("meme").onDelete("CASCADE");
		table.string("action").notNullable();
		table.enu("status", ["pending", "processing", "completed", "failed"]).notNullable().defaultTo("pending");
		table.timestamp("created_at").notNullable().defaultTo(knex.fn.now());
		table.timestamp("updated_at").notNullable().defaultTo(knex.fn.now());
	});
}

export async function down(knex: Knex): Promise<void> {
	await knex.schema.dropTable("task");
}
