import {gql} from "@apollo/client";
import {BaseObject} from "./base";
import {Meme} from "./meme";

export interface Event extends BaseObject {
	type: string;
	data: Record<string, any>;
	meme: Meme;
}

export const GET_EVENTS_QUERY = gql`
	query GetEvents {
		events {
			id
			type
			data
			createdAt
			updatedAt
			meme {
				id
				url
				template {
					name
				}
			}
		}
	}
`;
