import gql from 'graphql-tag';
import { Transaction } from 'objection';
import { User } from '../models/user';
import bcrypt from 'bcrypt';
import { withTransaction } from '../utils/transaction';

export const typeDefs = gql`
  type User {
    id: ID!
    email: EmailAddress!
    createdAt: DateTime!
    updatedAt: DateTime!
  }

  input SignUpInput {
    email: EmailAddress!
    password: String!
  }

  type Query {
    # Placeholder query to satisfy GraphQL's requirement
    _empty: String
  }

  type Mutation {
    signUp(input: SignUpInput!): User!
  }
`;

export const resolvers = {
  Query: {
    _empty: () => null
  },
  
  Mutation: {
    signUp: withTransaction(async (_: any, { input }: { input: { email: string; password: string } }, { trx }: { trx: Transaction }) => {
      const existingUser = await User.query(trx).findOne({ email: input.email });
      if (existingUser) {
        throw new Error('Email already registered');
      }

      const hashedPassword = await bcrypt.hash(input.password, 10);
      
      const user = await User.query(trx).insert({
        email: input.email,
        password: hashedPassword
      });

      return user;
    })
  }
}; 