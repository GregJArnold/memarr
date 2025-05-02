import {Knex} from "knex";

export async function up(knex: Knex): Promise<void> {
	await knex.schema.alterTable("event", table => {
		table.boolean("acknowledged").notNullable().defaultTo(false);
	});
}

export async function down(knex: Knex): Promise<void> {
	await knex.schema.alterTable("event", table => {
		table.dropColumn("acknowledged");
	});
}
