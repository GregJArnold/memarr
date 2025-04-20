import {BaseModel} from "./base";
import {v4 as uuidv4} from "uuid";
import {Transaction} from "objection";
import {AIClassifier} from "../services/ai-classification";
import {readFile} from "fs/promises";
import {Template} from "./template";
import {transaction, IsolationLevel} from "../middleware/transaction";

export class Meme extends BaseModel {
	static tableName = "meme";

	templateId!: string;
	userId!: string;
	filePath!: string;

	static relationMappings = {
		template: {
			relation: BaseModel.BelongsToOneRelation,
			modelClass: "Template",
			join: {
				from: "meme.template_id",
				to: "template.id",
			},
		},
		user: {
			relation: BaseModel.BelongsToOneRelation,
			modelClass: "User",
			join: {
				from: "meme.user_id",
				to: "user.id",
			},
		},
		meme_texts: {
			relation: BaseModel.HasManyRelation,
			modelClass: "MemeText",
			join: {
				from: "meme.id",
				to: "meme_text.meme_id",
			},
		},
		tags: {
			relation: BaseModel.HasManyRelation,
			modelClass: "Tag",
			join: {
				from: "meme.id",
				to: "tag.meme_id",
			},
		},
	};

	async process(trx?: Transaction, classifier: AIClassifier): Promise<void> {
		const imageBuffer = await readFile(this.filePath);

		const result = await classifier.classifyImage(imageBuffer);

		return transaction(IsolationLevel.Serializable, async trx => {
			if (!result.template) {
				await this.relatedQuery("tags", trx).insert({name: "failed analysis"});
				return;
			}

			await this.$query(trx).patch({templateId: result.template.id});
			await this.relatedQuery("meme_texts", trx).delete();
			await this.relatedQuery("meme_texts", trx).insert(
				result.textBlocks.map(block => ({
					memeId: this.id,
					textBlockId: block.textBlockId,
					content: block.content,
				}))
			);
		});
	}
}
