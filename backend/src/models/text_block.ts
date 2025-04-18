import { BaseModel } from './base';

export class TextBlock extends BaseModel {
  static tableName = 'text_block';

  templateId!: string;
  key!: string;
  label!: string;

  static relationMappings = {
    template: {
      relation: BaseModel.BelongsToOneRelation,
      modelClass: 'Template',
      join: {
        from: 'text_block.template_id',
        to: 'template.id'
      }
    },
    memeTexts: {
      relation: BaseModel.HasManyRelation,
      modelClass: 'MemeText',
      join: {
        from: 'text_block.id',
        to: 'meme_text.text_block_id'
      }
    }
  };
} 