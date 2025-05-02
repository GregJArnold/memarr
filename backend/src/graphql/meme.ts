import {FileUploadService} from "../services/fileUpload";
import {Meme} from "../models/meme";
import {Tag} from "../models/tag";
import {Template} from "../models/template";
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
		pendingProcessing: Boolean!
		tags: [Tag!]!
		template: Template
		texts: [MemeText!]!
		url: String!
		createdAt: DateTime!
		updatedAt: DateTime!
	}

	type TextBlock {
		id: ID!
		key: String!
		label: String!
	}

	type MemeText {
		id: ID!
		content: String!
		textBlock: TextBlock!
	}

	type Query {
		memes(templateId: [ID!], textContent: String, tags: [ID!], allTags: Boolean): [Meme!]!
		meme(memeId: ID!): Meme
	}

	type Mutation {
		uploadMeme(file: Upload!): Meme!
		addTag(memeId: ID!, tagName: String!): Meme!
		removeTag(memeId: ID!, tagId: ID!): Meme!
		addTextBlock(memeId: ID!, text: String!, textBlockId: ID!): Meme!
		updateTextBlock(memeId: ID!, textBlockId: ID!, text: String!): Meme!
		deleteTextBlock(memeId: ID!, textBlockId: ID!): Meme!
	}
`;

const withMeme = <TRoot, TArgs extends Record<string, unknown>>(
	resolver: (root: TRoot, args: TArgs, ctx: AuthTransactionContext, meme: Meme) => Promise<unknown>
) =>
	withUser(
		withTransaction(async (root: TRoot, args: {memeId: string} & TArgs, ctx: AuthTransactionContext) => {
			const meme = await Meme.query(ctx.trx)
				.findById(args.memeId)
				.where("user_id", ctx.user.id)
				.withGraphJoined("[tags, template, texts.[textBlock]]");

			if (!meme) {
				throw new Error("Meme not found");
			}

			return resolver(root, args, ctx, meme);
		})
	);

export const resolvers = {
	Meme: {
		pendingProcessing: async (meme: Meme) => {
			if (!meme.tasks) meme.tasks = await meme.$relatedQuery("tasks");

			return meme.tasks.some(task => task.action === "process" && task.status === "pending");
		},
		url: (meme: Meme) => `http://localhost:4000/image/${meme.id}`,
	},
	Query: {
		memes: withUser(
			withTransaction(
				async (
					_: unknown,
					{
						templateId,
						textContent,
						tags,
						allTags,
					}: {templateId?: string[]; textContent?: string; tags?: string[]; allTags?: boolean},
					{user, trx}: AuthTransactionContext
				) => {
					let query = Meme.query(trx)
						.where("user_id", user.id)
						.withGraphFetched("[tags, template, texts.[textBlock]]");

					if (templateId && templateId.length > 0) {
						query = query.whereIn("template_id", templateId);
					}

					if (textContent) {
						query = query.whereExists(
							Meme.relatedQuery("texts", trx).where("content", "ilike", `%${textContent}%`)
						);
					}

					if (tags?.length) {
						if (allTags) {
							for (const tagId of tags) {
								query = query.whereExists(Meme.relatedQuery("tags", trx).where("id", tagId));
							}
						} else {
							query = query.whereExists(Meme.relatedQuery("tags", trx).whereIn("id", tags));
						}
					}

					return query;
				}
			)
		),
		meme: withMeme(async (_, __, ___, meme) => meme),
	},
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
		addTag: withMeme(async (_, {tagName}: {tagName: string}, {trx}, meme) => {
			await meme.$relatedQuery("tags", trx).insert({name: tagName});
			return meme.$query(trx).withGraphFetched("[tags, template, texts.[textBlock]]");
		}),
		removeTag: withMeme(async (_, {tagId}: {tagId: string}, {trx}, meme) => {
			await meme.$relatedQuery("tags", trx).deleteById(tagId);
			return meme.$query(trx).withGraphFetched("[tags, template, texts.[textBlock]]");
		}),
		addTextBlock: withMeme(
			async (_, {text, textBlockId}: {text: string; textBlockId: string}, {trx}, meme) => {
				await meme.$relatedQuery("texts", trx).insert({content: text, textBlockId});
				return meme.$query(trx).withGraphFetched("[tags, template, texts.[textBlock]]");
			}
		),
		updateTextBlock: withMeme(
			async (_, {textBlockId, text}: {textBlockId: string; text: string}, {trx}, meme) => {
				const textBlock = await meme.$relatedQuery("texts", trx).findById(textBlockId);

				if (!textBlock) {
					throw new Error("Text block not found");
				}

				await textBlock.$query(trx).patchAndFetch({content: text});
				return meme.$query(trx).withGraphFetched("[tags, template, texts.[textBlock]]");
			}
		),
		deleteTextBlock: withMeme(async (_, {textBlockId}: {textBlockId: string}, {trx}, meme) => {
			const textBlock = await meme.$relatedQuery("texts", trx).findById(textBlockId);

			if (!textBlock) {
				throw new Error("Text block not found");
			}

			await textBlock.$query(trx).delete();
			return meme.$query(trx).withGraphFetched("[tags, template, texts.[textBlock]]");
		}),
	},
};
