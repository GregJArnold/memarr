import {Knex} from "knex";

export async function up(knex: Knex): Promise<void> {
	await knex.schema.alterTable("event", table => {
		table.timestamp("acknowledged_at").nullable();
	});
}

export async function down(knex: Knex): Promise<void> {
	await knex.schema.alterTable("event", table => {
		table.dropColumn("acknowledged_at");
	});
}
