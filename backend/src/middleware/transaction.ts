import {BaseModel} from "../models/base";
import {GraphQLFieldResolver, GraphQLResolveInfo} from "graphql";
import {Transaction} from "objection";
import {DBError} from "db-errors";
import retry, {Options} from "async-retry";

const retryOptions: Options = {
	retries: 10,
	factor: 2,
	minTimeout: 1000,
	randomize: true,
};

export const IsolationLevel = {
	ReadCommitted: "READ COMMITTED",
	RepeatableRead: "REPEATABLE READ",
	Serializable: "SERIALIZABLE",
} as const;

export type IsolationLevel = (typeof IsolationLevel)[keyof typeof IsolationLevel];
type TransactionCallback<T> = (trx: Transaction) => Promise<T>;

const simpleTransaction = <T>(level: IsolationLevel, callback: TransactionCallback<T>): Promise<T> =>
	BaseModel.knex()
		.raw(`SET TRANSACTION ISOLATION LEVEL ${level};`)
		.then(() => BaseModel.transaction(callback));

const retryTransaction = <T>(level: IsolationLevel, callback: TransactionCallback<T>): Promise<T> =>
	retry<T>(async (bail): Promise<any> => {
		try {
			return await simpleTransaction(level, callback);
		} catch (err) {
			const {code} = (err instanceof DBError ? err.nativeError : err) as {code: string};
			if (code === "40001") throw err;
			bail(err);
		}
	}, retryOptions);

export function transaction<T>(level: IsolationLevel, callback: TransactionCallback<T>): Promise<T> {
	switch (level) {
		case IsolationLevel.ReadCommitted:
			return simpleTransaction(level, callback);
		case IsolationLevel.RepeatableRead:
		case IsolationLevel.Serializable:
			return retryTransaction(level, callback);
		default:
			throw new Error(`Unknown isolation level: ${level}`);
	}
}

export function withTransaction<TParent, TContext, TArgs, TResult>(
	isolationLevel: IsolationLevel,
	resolver: GraphQLFieldResolver<TParent, TContext, TArgs, TResult>
): GraphQLFieldResolver<TParent, TContext & {trx: Transaction}, TArgs, Promise<TResult>>;
export function withTransaction<TParent, TContext, TArgs, TResult>(
	resolver: GraphQLFieldResolver<TParent, TContext, TArgs, TResult>
): GraphQLFieldResolver<TParent, TContext & {trx: Transaction}, TArgs, Promise<TResult>>;
export function withTransaction<TParent, TContext, TArgs, TResult>(
	typeOrResolver: GraphQLFieldResolver<TParent, TContext, TArgs, TResult> | IsolationLevel,
	resolver?: GraphQLFieldResolver<TParent, TContext, TArgs, TResult>
): GraphQLFieldResolver<TParent, TContext & {trx: Transaction}, TArgs, Promise<TResult>> {
	if (typeof typeOrResolver === "function") {
		resolver = typeOrResolver;
		typeOrResolver = IsolationLevel.Serializable;
	}
	return (parent: TParent, args: TArgs, ctx: TContext, info: GraphQLResolveInfo): Promise<TResult> =>
		transaction(
			typeOrResolver as IsolationLevel,
			// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
			async (trx: Transaction) => resolver!(parent, args, {...ctx, trx}, info)
		);
}
