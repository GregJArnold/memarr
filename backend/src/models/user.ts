import {BaseModel} from "./base";
import {Meme} from "./meme";
import {Event} from "./event";
import {Submission} from "./submission";
import {RelationMappings} from "objection";
export class User extends BaseModel {
	static tableName = "user";

	email!: string;
	password!: string;

	memes?: Meme[];
	events?: Event[];
	submissions?: Submission[];

	static get relationMappings(): RelationMappings {
		return {
			memes: {
				relation: BaseModel.HasManyRelation,
				modelClass: Meme,
				join: {
					from: "users.id",
					to: "memes.user_id",
				},
			},
			events: {
				relation: BaseModel.HasManyRelation,
				modelClass: Event,
				join: {
					from: "users.id",
					to: "events.user_id",
				},
			},
			submissions: {
				relation: BaseModel.HasManyRelation,
				modelClass: Submission,
				join: {
					from: "users.id",
					to: "submissions.user_id",
				},
			},
		};
	}
}
