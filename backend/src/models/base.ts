import { Model, ModelObject } from 'objection';

export class BaseModel extends Model {
  id!: string;
  createdAt!: Date;
  updatedAt!: Date;


  $beforeInsert() {
    this.createdAt = new Date();
    this.updatedAt = new Date();
  }

  $beforeUpdate() {
    this.updatedAt = new Date();
  }
}

export type BaseModelType = ModelObject<BaseModel>; 