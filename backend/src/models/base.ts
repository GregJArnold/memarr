import {Model, ModelObject} from "objection";

export class BaseModel extends Model {
	id!: string;
	createdAt!: Date;
	updatedAt!: Date;

	static modelPaths = [__dirname];

	$beforeInsert() {
		this.createdAt = new Date();
		this.updatedAt = new Date();
	}

	$beforeUpdate() {
		this.updatedAt = new Date();
	}
}

export type BaseModelType = ModelObject<BaseModel>;
