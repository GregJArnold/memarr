import gql from "graphql-tag";
import {withTransaction} from "../middleware/transaction";
import {withUser} from "../middleware/auth";
import {AuthTransactionContext} from "../context";
import {Template} from "../models/template";

export const typeDefs = gql`
	type Template {
		id: ID!
		name: String!
		description: String
		textBlocks: [TextBlock!]!
		createdAt: DateTime!
		updatedAt: DateTime!
	}

	extend type Query {
		templates: [Template!]!
		template(templateId: ID!): Template
	}
`;

export const resolvers = {
	Query: {
		templates: withUser(
			withTransaction(async (_: unknown, __: unknown, ctx: AuthTransactionContext) => {
				return Template.query(ctx.trx).orderBy("name").withGraphFetched("textBlocks");
			})
		),
		template: withUser(
			withTransaction(async (_: unknown, {templateId}: {templateId: string}, ctx: AuthTransactionContext) => {
				return Template.query(ctx.trx).findById(templateId).withGraphFetched("textBlocks").first();
			})
		),
	},
};
