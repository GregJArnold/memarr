import {Request} from "express";
import jwt from "jsonwebtoken";
import {User} from "../models/user";
import {Context} from "../context";
import {GraphQLFieldResolver, GraphQLResolveInfo} from "graphql";

export const authenticate = async (req: Request): Promise<Partial<Context>> => {
	const authHeader = req.headers.authorization;
	if (!authHeader) {
		return {};
	}

	const token = authHeader.replace("Bearer ", "");
	if (!token) {
		return {};
	}

	try {
		const decoded = jwt.verify(token, process.env.JWT_SECRET || "your-secret-key") as {userId: string};
		const user = await User.query().findById(decoded.userId);
		if (!user) {
			throw new Error("User not found");
		}
		return {user};
	} catch (error) {
		if (error instanceof jwt.JsonWebTokenError) {
			throw new Error("Invalid token");
		}
		if (error instanceof jwt.TokenExpiredError) {
			throw new Error("Token expired");
		}
		throw error;
	}
};

export function withUser<TResult, TParent, TContext extends Context, TArgs>(
	resolver: GraphQLFieldResolver<TParent, TContext & {user: User}, TArgs, Promise<TResult>>
): GraphQLFieldResolver<TParent, TContext, TArgs, Promise<TResult>> {
	return async (parent: TParent, args: TArgs, ctx: TContext, info: GraphQLResolveInfo): Promise<TResult> => {
		if (!ctx.user) throw new Error("Not authenticated");
		return resolver(parent, args, ctx as TContext & {user: User}, info);
	};
}
