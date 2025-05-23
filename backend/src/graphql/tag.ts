import gql from "graphql-tag";
import {withTransaction} from "../middleware/transaction";
import {withUser} from "../middleware/auth";
import {AuthTransactionContext} from "../context";
import {Tag} from "../models/tag";
import {MemeLoader} from "../loaders/meme-loader";

export const typeDefs = gql`
	type Tag {
		id: ID!
		name: String!
		createdAt: DateTime!
		updatedAt: DateTime!
		memeId: ID!
		meme: Meme!
	}

	extend type Query {
		tags: [Tag!]!
		tag(tagId: ID!): Tag
	}
`;

export const resolvers = {
	Query: {
		tags: withUser(
			withTransaction(async (_: unknown, __: unknown, ctx: AuthTransactionContext) => {
				return Tag.query(ctx.trx).orderBy("name");
			})
		),
		tag: withUser(
			withTransaction(async (_: unknown, {tagId}: {tagId: string}, ctx: AuthTransactionContext) => {
				return Tag.query(ctx.trx).findById(tagId);
			})
		),
	},
	Tag: {
		meme: MemeLoader.resolver("memeId"),
	},
};
