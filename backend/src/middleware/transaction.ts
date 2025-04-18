import {BaseModel} from "../models/base";
import {GraphQLFieldResolver} from "graphql";
import {Transaction} from "objection";

export const withTransaction = <TResult, TParent, TContext, TArgs>(
	resolver: GraphQLFieldResolver<TParent, TContext, TArgs, TResult>
): GraphQLFieldResolver<TParent, TContext & {trx: Transaction}, TArgs, Promise<TResult>> => (parent, args, context, info) =>
	BaseModel.transaction(async trx => resolver(parent, args, {...context, trx}, info)); 