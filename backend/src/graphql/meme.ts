import {FileUploadService} from "../services/fileUpload";
import {Meme} from "../models/meme";
import {Task} from "../models/task";
import gql from "graphql-tag";
import {withTransaction} from "../middleware/transaction";
import {AuthTransactionContext} from "../middleware/auth";
const fileUploadService = new FileUploadService();

export const typeDefs = gql`
	type Meme {
		id: ID!
		templateId: ID
		userId: ID!
		filePath: String!
		createdAt: DateTime!
		updatedAt: DateTime!
	}

	type Mutation {
		uploadMeme(file: Upload!): Meme!
	}
`;

export const resolvers = {
	Mutation: {
		uploadMeme: withTransaction(async (_: any, {file}: {file: any}, {user, trx}: AuthTransactionContext) => {
			if (!user) {
				throw new Error("Not authenticated");
			}

			const {createReadStream, filename} = await file;
			const stream = createReadStream();
			const chunks: Buffer[] = [];

			for await (const chunk of stream) chunks.push(chunk);

			const buffer = Buffer.concat(chunks);
			const savedFilename = await fileUploadService.saveMeme(buffer, filename);

			const newMeme = await Meme.query(trx).insert({
				userId: user.id,
				filePath: savedFilename,
			});

			await Task.query(trx).insert({memeId: newMeme.id, action: "process"});
			return newMeme;
		}),
	},
};
