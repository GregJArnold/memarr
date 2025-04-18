import { BaseModel } from '../models/base';
import { GraphQLFieldResolver } from 'graphql';

export const withTransaction = <TResult, TParent, TContext, TArgs>(
  resolver: GraphQLFieldResolver<TParent, TContext, TArgs, TResult>
): GraphQLFieldResolver<TParent, TContext, TArgs, Promise<TResult>> => 
  (parent, args, context, info) => 
    BaseModel.transaction(async (trx) => resolver(parent, args, { ...context, trx }, info));
