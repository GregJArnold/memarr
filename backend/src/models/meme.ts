import {BaseModel} from "./base";
import {RelationMappings, Transaction} from "objection";
import {AIClassifier} from "../services/ai-classification";
import {readFile} from "fs/promises";
import {Template} from "./template";
import {transaction, IsolationLevel} from "../middleware/transaction";
import {User} from "./user";
import {Task} from "./task";
import {Tag} from "./tag";
import {Event} from "./event";
import {MemeText} from "./meme-text";

export class Meme extends BaseModel {
	static tableName = "meme";

	templateId!: string;
	template?: Template;

	userId!: string;
	user?: User;

	filePath!: string;

	tasks?: Task[];
	tags?: Tag[];
	events?: Event[];
	texts?: MemeText[];

	static get relationMappings(): RelationMappings {
		return {
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
			texts: {
				relation: BaseModel.HasManyRelation,
				modelClass: MemeText,
				join: {
					from: "meme.id",
					to: "meme_text.meme_id",
				},
			},
			tags: {
				relation: BaseModel.HasManyRelation,
				modelClass: Tag,
				join: {
					from: "meme.id",
					to: "tag.meme_id",
				},
			},
			events: {
				relation: BaseModel.HasManyRelation,
				modelClass: Event,
				join: {
					from: "meme.id",
					to: "event.meme_id",
				},
			},
			tasks: {
				relation: BaseModel.HasManyRelation,
				modelClass: Task,
				join: {
					from: "meme.id",
					to: "task.meme_id",
				},
			},
		};
	}

	async process(classifier: AIClassifier, trx?: Transaction): Promise<void> {
		const imageBuffer = await readFile(this.filePath);
		const result = await classifier.classifyImage(imageBuffer);

		return transaction(IsolationLevel.Serializable, async trx => {
			if (!result.template) {
				await this.$relatedQuery("tags", trx).insert({name: "failed analysis"});
				return;
			}

			await result.template.$query(trx).insert();

			await this.$query(trx).patch({templateId: result.template.id});
			await this.$relatedQuery("meme_texts", trx).delete();
			await this.$relatedQuery("meme_texts", trx).insert(
				result.textBlocks.map(block => ({
					memeId: this.id,
					textBlockId: block.textBlockId,
					content: block.content,
				}))
			);
		});
	}
}
