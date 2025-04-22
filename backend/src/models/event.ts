import {BaseModel} from "./base";

export class Event extends BaseModel {
	static tableName = "event";

	userId!: string;
	memeId?: string;
	type!: string;
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	data?: Record<string, any>;

	static relationMappings = {
		user: {
			relation: BaseModel.BelongsToOneRelation,
			modelClass: "User",
			join: {
				from: "events.user_id",
				to: "users.id",
			},
		},
		meme: {
			relation: BaseModel.BelongsToOneRelation,
			modelClass: "Meme",
			join: {
				from: "events.meme_id",
				to: "memes.id",
			},
		},
	};
}
