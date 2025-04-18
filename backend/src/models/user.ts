import { BaseModel } from './base';

export class User extends BaseModel {
  static tableName = 'user';

  email!: string;
  passwordHash!: string;

  static relationMappings = {
    memes: {
      relation: BaseModel.HasManyRelation,
      modelClass: 'Meme',
      join: {
        from: 'users.id',
        to: 'memes.user_id'
      }
    },
    events: {
      relation: BaseModel.HasManyRelation,
      modelClass: 'Event',
      join: {
        from: 'users.id',
        to: 'events.user_id'
      }
    },
    submissions: {
      relation: BaseModel.HasManyRelation,
      modelClass: 'Submission',
      join: {
        from: 'users.id',
        to: 'submissions.user_id'
      }
    }
  };
} 