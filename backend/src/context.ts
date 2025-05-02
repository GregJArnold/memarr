import {User} from "./models/user";
import {Transaction} from "objection";
import {LoaderCache} from "./loaders/cache";

export interface Context {
	user?: User;
	trx?: Transaction;
	loaders: LoaderCache;
}

export interface AuthContext extends Context {
	user: User;
}

export interface TransactionContext extends Context {
	trx: Transaction;
}

export type AuthTransactionContext = AuthContext & TransactionContext;
