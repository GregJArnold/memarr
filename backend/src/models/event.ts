import {BaseModel} from "./base";
import {User} from "./user";
import {Meme} from "./meme";
import {RelationMappings} from "objection";

export enum EventType {
	MemeCreated = "meme_created",
	MemeUpdated = "meme_updated",
	MemeDeleted = "meme_deleted",
	MemeProcessed = "meme_processed",
	TagCreated = "tag_created",
	TagUpdated = "tag_updated",
	TagDeleted = "tag_deleted",
	TextBlockCreated = "text_block_created",
	TextBlockUpdated = "text_block_updated",
	TextBlockDeleted = "text_block_deleted",
}

export class Event extends BaseModel {
	static tableName = "event";

	userId!: string;
	user?: User;
	memeId?: string;
	meme?: Meme;
	type!: EventType;
	acknowledgedAt?: Date;
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
