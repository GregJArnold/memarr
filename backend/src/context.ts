import {User} from "./models/user";
import {Transaction} from "objection";

export interface Context {
	user?: User;
	trx?: Transaction;
}

export interface AuthContext extends Context {
	user: User;
} 

export interface TransactionContext extends Context {
	trx: Transaction;
}

export type AuthTransactionContext = AuthContext & TransactionContext;