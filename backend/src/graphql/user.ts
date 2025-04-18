import gql from 'graphql-tag';
import { Transaction } from 'objection';
import { User } from '../models/user';
import bcrypt from 'bcrypt';
import { withTransaction } from '../utils/transaction';
import jwt from 'jsonwebtoken';

export const typeDefs = gql`
  type User {
    id: ID!
    email: EmailAddress!
    createdAt: DateTime!
    updatedAt: DateTime!
  }

  type AuthPayload {
    token: String!
    user: User!
  }

  type Query {
    me: User
  }

  type Mutation {
    signUp(email: EmailAddress!, password: String!): User!
    login(email: EmailAddress!, password: String!): AuthPayload!
  }
`;

export const resolvers = {
  Query: {
    me: async (_: any, __: any, { user }: { user: any }) => {
      if (!user) {
        throw new Error('Not authenticated');
      }
      return user;
    },
  },
  
  Mutation: {
    signUp: withTransaction(async (_: any, { email, password }: { email: string; password: string }, { trx }: { trx: Transaction }) => {
      const existingUser = await User.query(trx).findOne({ email });
      if (existingUser) {
        throw new Error('Email already registered');
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      
      const user = await User.query(trx).insert({
        email,
        password: hashedPassword,
      });

      return user;
    }),

    login: async (_: any, { email, password }: { email: string; password: string }) => {
      const user = await User.query().findOne({ email });
      if (!user) {
        throw new Error('Invalid email or password');
      }

      const validPassword = await bcrypt.compare(password, user.password);
      if (!validPassword) {
        throw new Error('Invalid email or password');
      }

      const token = jwt.sign(
        { userId: user.id },
        process.env.JWT_SECRET || 'your-secret-key',
        { expiresIn: '1d' },
      );

      return {
        token,
        user,
      };
    },
  },
}; 