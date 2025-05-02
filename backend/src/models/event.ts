import {BaseModel} from "./base";
import {User} from "./user";
import {Meme} from "./meme";
import {RelationMappings} from "objection";

export class Event extends BaseModel {
	static tableName = "event";

	userId!: string;
	user?: User;
	memeId?: string;
	meme?: Meme;
	type!: string;
	acknowledged!: boolean;
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	data?: Record<string, any>;

	static get relationMappings(): RelationMappings {
		return {
			user: {
				relation: BaseModel.BelongsToOneRelation,
				modelClass: User,
				join: {
					from: "events.user_id",
					to: "users.id",
				},
			},
			meme: {
				relation: BaseModel.BelongsToOneRelation,
				modelClass: Meme,
				join: {
					from: "events.meme_id",
					to: "memes.id",
				},
			},
		};
	}
}
