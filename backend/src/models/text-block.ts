import {RelationMappings} from "objection";
import {BaseModel} from "./base";
import {MemeText} from "./meme-text";
import {Template} from "./template";

export class TextBlock extends BaseModel {
	static tableName = "text_block";

	templateId!: string;
	key!: string;
	label!: string;
	memeTexts?: MemeText[];
	template?: Template;

	static get relationMappings(): RelationMappings {
		return {
			template: {
				relation: BaseModel.BelongsToOneRelation,
				modelClass: Template,
				join: {
					from: "text_block.template_id",
					to: "template.id",
				},
			},
			memeTexts: {
				relation: BaseModel.HasManyRelation,
				modelClass: MemeText,
				join: {
					from: "text_block.id",
					to: "meme_text.text_block_id",
				},
			},
		};
	}
}
