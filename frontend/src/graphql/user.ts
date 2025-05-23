import {gql} from "@apollo/client";
import {BaseObject} from "./base";

export interface User extends BaseObject {
	email: string;
}

export const ME_QUERY = gql`
	query Me {
		me {
			id
			email
			createdAt
			updatedAt
		}
	}
`;
