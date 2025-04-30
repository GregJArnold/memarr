import {RelationMappings} from "objection";
import {BaseModel} from "./base";
import {Meme} from "./meme";
import {TextBlock} from "./text-block";

export class MemeText extends BaseModel {
	static tableName = "meme_text";

	memeId!: string;
	meme?: Meme;
	textBlockId!: string;
	textBlock?: TextBlock;
	content!: string;

	static get relationMappings(): RelationMappings {
		return {
			meme: {
				relation: BaseModel.BelongsToOneRelation,
				modelClass: Meme,
				join: {
					from: "meme_text.meme_id",
					to: "meme.id",
				},
			},
			textBlock: {
				relation: BaseModel.BelongsToOneRelation,
				modelClass: TextBlock,
				join: {
					from: "meme_text.text_block_id",
					to: "text_block.id",
				},
			},
		};
	}
}
