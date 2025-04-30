import {BaseModel} from "./base";
import {User} from "./user";
import {Meme} from "./meme";
import {Template} from "./template";
import {RelationMappings} from "objection";

export class Submission extends BaseModel {
	static tableName = "submission";

	userId!: string;
	user?: User;
	memeId!: string;
	meme?: Meme;
	templateId!: string;
	template?: Template;
	description?: string;
	status!: "pending" | "approved" | "rejected";

	static get relationMappings(): RelationMappings {
		return {
			user: {
				relation: BaseModel.BelongsToOneRelation,
				modelClass: User,
				join: {
					from: "submissions.user_id",
					to: "users.id",
				},
			},
			meme: {
				relation: BaseModel.BelongsToOneRelation,
				modelClass: Meme,
				join: {
					from: "submissions.meme_id",
					to: "memes.id",
				},
			},
			template: {
				relation: BaseModel.BelongsToOneRelation,
				modelClass: Template,
				join: {
					from: "submissions.template_id",
					to: "templates.id",
				},
			},
		};
	}
}
