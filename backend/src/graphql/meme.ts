import {FileUploadService} from "../services/fileUpload";
import {Meme} from "../models/meme";
import gql from "graphql-tag";
import {withTransaction} from "../middleware/transaction";
import {withUser} from "../middleware/auth";
import {AuthTransactionContext} from "../context";
import {FileUpload} from "graphql-upload/processRequest.mjs";

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
		uploadMeme: withUser(
			withTransaction(
				async (_: unknown, {file}: {file: Promise<FileUpload>}, {user, trx}: AuthTransactionContext) => {
					const {createReadStream, filename} = await file;
					const stream = createReadStream();
					const chunks: Buffer[] = [];

					for await (const chunk of stream) chunks.push(chunk);

					const buffer = Buffer.concat(chunks);
					const savedFilename = await fileUploadService.saveMeme(buffer, filename);

					const newMeme = await Meme.query(trx).insertAndFetch({
						userId: user.id,
						filePath: savedFilename,
					});

					await newMeme.$relatedQuery("tasks", trx).insert({action: "process"});

					await newMeme.$relatedQuery("events", trx).insert({
						userId: user.id,
						type: "meme_uploaded",
						data: {filename: savedFilename},
					});

					return newMeme;
				}
			)
		),
	},
};
