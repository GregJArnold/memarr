import gql from "graphql-tag";
import {withTransaction} from "../middleware/transaction";
import {withUser} from "../middleware/auth";
import {AuthTransactionContext} from "../context";
import {Event} from "../models/event";
import {MemeLoader} from "../loaders/meme-loader";

export const typeDefs = gql`
	type Event {
		id: ID!
		type: String!
		data: JSONObject!
		createdAt: DateTime!
		updatedAt: DateTime!
		acknowledgedAt: DateTime
		memeId: ID!
		meme: Meme!
	}

	extend type Query {
		events: [Event!]!
	}

	extend type Mutation {
		acknowledgeEvent(eventId: ID!): Event!
	}
`;

export const resolvers = {
	Query: {
		events: withUser(
			withTransaction(async (_: unknown, __: unknown, {user, trx}: AuthTransactionContext) => {
				return Event.query(trx).where("userId", user.id).orderBy("createdAt", "desc");
			})
		),
	},
	Mutation: {
		acknowledgeEvent: withUser(
			withTransaction(
				async (_: unknown, {eventId}: {eventId: string}, {user, trx}: AuthTransactionContext) => {
					const event = await Event.query(trx).where("id", eventId).where("userId", user.id).first();
					if (!event) throw new Error("Event not found");

					return event.$query(trx).patchAndFetch({acknowledgedAt: fn.now()});
				}
			)
		),
	},
	Event: {
		meme: MemeLoader.resolver("memeId"),
	},
};
