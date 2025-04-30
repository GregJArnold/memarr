import {BaseModel} from "./base";
import {Meme} from "./meme";
import {TextBlock} from "./text-block";
import {RelationMappings} from "objection";
export class Template extends BaseModel {
	static tableName = "template";

	name!: string;

	description?: string;

	memes?: Meme[];
	textBlocks?: TextBlock[];

	static get relationMappings(): RelationMappings {
		return {
			memes: {
				relation: BaseModel.HasManyRelation,
				modelClass: Meme,
				join: {
					from: "template.id",
					to: "meme.template_id",
				},
			},
			textBlocks: {
				relation: BaseModel.HasManyRelation,
				modelClass: TextBlock,
				join: {
					from: "template.id",
					to: "text_block.template_id",
				},
			},
		};
	}
}
