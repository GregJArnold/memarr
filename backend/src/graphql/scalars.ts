import gql from 'graphql-tag';
import { 
  DateTimeResolver, 
  DateTimeTypeDefinition, 
  EmailAddressResolver, 
  EmailAddressTypeDefinition 
} from 'graphql-scalars';
import GraphQLUpload from 'graphql-upload/GraphQLUpload.mjs';

export const scalarTypeDefs = gql`
  ${DateTimeTypeDefinition}
  ${EmailAddressTypeDefinition}
  scalar Upload
`;

export const scalarResolvers = {
  DateTime: DateTimeResolver,
  EmailAddress: EmailAddressResolver,
  Upload: GraphQLUpload
}; 