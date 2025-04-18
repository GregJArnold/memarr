import { BaseModel } from './base';

export class Tag extends BaseModel {
  static tableName = 'tag';

  name!: string;
  memeId!: string;

  static relationMappings = {
    meme: {
      relation: BaseModel.BelongsToOneRelation,
      modelClass: 'Meme',
      join: {
        from: 'tags.meme_id',
        to: 'memes.id'
      }
    }
  };
} 