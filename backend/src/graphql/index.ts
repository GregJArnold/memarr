import {readdirSync} from "fs";
import {join} from "path";
import {makeExecutableSchema} from "@graphql-tools/schema";
import {scalarTypeDefs, scalarResolvers} from "./scalars";

const graphqlDir = __dirname;

export const createSchema = () => {
	const files = readdirSync(graphqlDir).filter(file => file.endsWith(".ts") && file !== "index.ts");

	const typeDefs = [scalarTypeDefs];
	const resolvers = [scalarResolvers];

	for (const file of files) {
		const module = require(join(graphqlDir, file));
		if (module.typeDefs) typeDefs.push(module.typeDefs);
		if (module.resolvers) resolvers.push(module.resolvers);
	}

	return makeExecutableSchema({
		typeDefs,
		resolvers,
	});
};
