import {gql} from "@apollo/client";
import {BaseObject, inflateObject} from "./base";

export interface Template extends BaseObject {
	name: string;
}

export const GET_TEMPLATES_QUERY = gql`
	query GetTemplates {
		templates {
			id
			name
			createdAt
			updatedAt
		}
	}
`;

export const inflateTemplate = (template: Template): Template => inflateObject(template);
