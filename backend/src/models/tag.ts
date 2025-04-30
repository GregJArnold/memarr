import {RelationMappings} from "objection";
import {BaseModel} from "./base";
import {Meme} from "./meme";

export class Tag extends BaseModel {
	static tableName = "tag";

	name!: string;
	memeId!: string;
	meme?: Meme;

	static get relationMappings(): RelationMappings {
		return {
			meme: {
				relation: BaseModel.BelongsToOneRelation,
				modelClass: Meme,
				join: {
					from: "tags.meme_id",
					to: "memes.id",
				},
			},
		};
	}
}
