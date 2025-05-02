import gql from "graphql-tag";
import {
	DateTimeResolver,
	DateTimeTypeDefinition,
	EmailAddressResolver,
	EmailAddressTypeDefinition,
	JSONObjectDefinition,
	JSONObjectResolver,
} from "graphql-scalars";
import GraphQLUpload from "graphql-upload/GraphQLUpload.mjs";

export const scalarTypeDefs = gql`
	${DateTimeTypeDefinition}
	${EmailAddressTypeDefinition}
	${JSONObjectDefinition}
	scalar Upload
`;

export const scalarResolvers = {
	DateTime: DateTimeResolver,
	EmailAddress: EmailAddressResolver,
	Upload: GraphQLUpload,
	JSONObject: JSONObjectResolver,
};
