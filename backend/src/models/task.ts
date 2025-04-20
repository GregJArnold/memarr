import {BaseModel} from "./base";
import {Meme} from "./meme";

export const TaskStatus = {
	Pending: "pending",
	Processing: "processing",
	Completed: "completed",
	Failed: "failed",
} as const;
export type TaskStatus = (typeof TaskStatus)[keyof typeof TaskStatus];

export class Task extends BaseModel {
	static tableName = "task";

	memeId!: string;
	action!: string;
	status!: TaskStatus;
	meme?: Meme;

	static relationMappings = {
		meme: {
			relation: BaseModel.BelongsToOneRelation,
			modelClass: "Meme",
			join: {
				from: "task.meme_id",
				to: "meme.id",
			},
		},
	};
}
