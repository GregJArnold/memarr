import {Request} from "express";
import jwt from "jsonwebtoken";
import {User} from "../models/user";
import {Context} from "../context";

export const authenticate = async (req: Request): Promise<Context> => {
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
