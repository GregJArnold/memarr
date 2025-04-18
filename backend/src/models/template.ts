import {BaseModel} from "./base";

export class Template extends BaseModel {
	static tableName = "template";

	name!: string;
	description?: string;

	static relationMappings = {
		memes: {
			relation: BaseModel.HasManyRelation,
			modelClass: "Meme",
			join: {
				from: "template.id",
				to: "meme.template_id",
			},
		},
		textBlocks: {
			relation: BaseModel.HasManyRelation,
			modelClass: "TextBlock",
			join: {
				from: "template.id",
				to: "text_block.template_id",
			},
		},
	};
}
