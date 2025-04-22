import {BaseModel} from "./base";

export class MemeText extends BaseModel {
	static tableName = "meme_text";

	memeId!: string;
	textBlockId!: string;
	content!: string;

	static relationMappings = {
		meme: {
			relation: BaseModel.BelongsToOneRelation,
			modelClass: "Meme",
			join: {
				from: "meme_text.meme_id",
				to: "meme.id",
			},
		},
		textBlock: {
			relation: BaseModel.BelongsToOneRelation,
			modelClass: "TextBlock",
			join: {
				from: "meme_text.text_block_id",
				to: "text_block.id",
			},
		},
	};
}
