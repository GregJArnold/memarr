import {gql} from "@apollo/client";
import {BaseObject, inflateObject} from "./base";

export interface Tag extends BaseObject {
	name: string;
}

export const GET_TAGS_QUERY = gql`
	query GetTags {
		tags {
			id
			name
			createdAt
			updatedAt
		}
	}
`;

export const inflateTag = (tag: Tag): Tag => inflateObject(tag);
