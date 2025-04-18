import {BaseModel} from "./base";

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
	};
}
