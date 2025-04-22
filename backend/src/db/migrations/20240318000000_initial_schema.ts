import type {Knex} from "knex";

export async function up(knex: Knex): Promise<void> {
	// Create user table
	await knex.schema.createTable("user", table => {
		table.uuid("id").primary().defaultTo(knex.raw("gen_random_uuid()"));
		table.string("email").notNullable().unique();
		table.string("password").notNullable();
		table.timestamp("created_at").notNullable().defaultTo(knex.fn.now());
		table.timestamp("updated_at").notNullable().defaultTo(knex.fn.now());
	});

	// Create template table
	await knex.schema.createTable("template", table => {
		table.uuid("id").primary().defaultTo(knex.raw("gen_random_uuid()"));
		table.string("name").notNullable().unique();
		table.string("description");
		table.timestamp("created_at").notNullable().defaultTo(knex.fn.now());
		table.timestamp("updated_at").notNullable().defaultTo(knex.fn.now());
	});

	// Create text_block table (template text block definitions)
	await knex.schema.createTable("text_block", table => {
		table.uuid("id").primary().defaultTo(knex.raw("gen_random_uuid()"));
		table.uuid("template_id").notNullable().references("id").inTable("template").onDelete("CASCADE");
		table.string("key").notNullable();
		table.string("label").notNullable();
		table.timestamp("created_at").notNullable().defaultTo(knex.fn.now());
		table.timestamp("updated_at").notNullable().defaultTo(knex.fn.now());
	});

	// Create meme table
	await knex.schema.createTable("meme", table => {
		table.uuid("id").primary().defaultTo(knex.raw("gen_random_uuid()"));
		table.uuid("user_id").notNullable().references("id").inTable("user").onDelete("CASCADE");
		table.uuid("template_id").references("id").inTable("template").onDelete("CASCADE");
		table.string("file_path").notNullable();
		table.timestamp("created_at").notNullable().defaultTo(knex.fn.now());
		table.timestamp("updated_at").notNullable().defaultTo(knex.fn.now());
	});

	// Create meme_text table (actual text content for memes)
	await knex.schema.createTable("meme_text", table => {
		table.uuid("id").primary().defaultTo(knex.raw("gen_random_uuid()"));
		table.uuid("meme_id").notNullable().references("id").inTable("meme").onDelete("CASCADE");
		table.uuid("text_block_id").notNullable().references("id").inTable("text_block").onDelete("CASCADE");
		table.text("content").notNullable();
		table.timestamp("created_at").notNullable().defaultTo(knex.fn.now());
		table.timestamp("updated_at").notNullable().defaultTo(knex.fn.now());
	});

	// Create tag table
	await knex.schema.createTable("tag", table => {
		table.uuid("id").primary().defaultTo(knex.raw("gen_random_uuid()"));
		table.string("name").notNullable();
		table.uuid("meme_id").notNullable().references("id").inTable("meme").onDelete("CASCADE");
		table.timestamp("created_at").notNullable().defaultTo(knex.fn.now());
		table.timestamp("updated_at").notNullable().defaultTo(knex.fn.now());
	});

	// Create event table
	await knex.schema.createTable("event", table => {
		table.uuid("id").primary().defaultTo(knex.raw("gen_random_uuid()"));
		table.uuid("user_id").notNullable().references("id").inTable("user").onDelete("CASCADE");
		table.uuid("meme_id").references("id").inTable("meme").onDelete("SET NULL");
		table.string("type").notNullable();
		table.jsonb("data");
		table.timestamp("created_at").notNullable().defaultTo(knex.fn.now());
		table.timestamp("updated_at").notNullable().defaultTo(knex.fn.now());
	});

	// Create submission table
	await knex.schema.createTable("submission", table => {
		table.uuid("id").primary().defaultTo(knex.raw("gen_random_uuid()"));
		table.uuid("user_id").notNullable().references("id").inTable("user").onDelete("CASCADE");
		table.uuid("meme_id").notNullable().references("id").inTable("meme").onDelete("CASCADE");
		table.uuid("template_id").notNullable().references("id").inTable("template").onDelete("CASCADE");
		table.text("description");
		table.string("status").notNullable().defaultTo("pending");
		table.timestamp("created_at").notNullable().defaultTo(knex.fn.now());
		table.timestamp("updated_at").notNullable().defaultTo(knex.fn.now());
	});
}

export async function down(knex: Knex): Promise<void> {
	await knex.schema.dropTable("submission");
	await knex.schema.dropTable("event");
	await knex.schema.dropTable("meme_text");
	await knex.schema.dropTable("tag");
	await knex.schema.dropTable("meme");
	await knex.schema.dropTable("text_block");
	await knex.schema.dropTable("template");
	await knex.schema.dropTable("user");
}
