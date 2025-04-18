import {BaseModel} from "./base";

export class Submission extends BaseModel {
	static tableName = "submission";

	userId!: string;
	memeId!: string;
	templateId!: string;
	description?: string;
	status!: "pending" | "approved" | "rejected";

	static relationMappings = {
		user: {
			relation: BaseModel.BelongsToOneRelation,
			modelClass: "User",
			join: {
				from: "submissions.user_id",
				to: "users.id",
			},
		},
		meme: {
			relation: BaseModel.BelongsToOneRelation,
			modelClass: "Meme",
			join: {
				from: "submissions.meme_id",
				to: "memes.id",
			},
		},
		template: {
			relation: BaseModel.BelongsToOneRelation,
			modelClass: "Template",
			join: {
				from: "submissions.template_id",
				to: "templates.id",
			},
		},
	};
}
