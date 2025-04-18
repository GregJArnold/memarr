import { FileUploadService } from '../services/fileUpload';
import { Meme } from '../models/meme';
import gql from 'graphql-tag';

const fileUploadService = new FileUploadService();

export const typeDefs = gql`
  type Meme {
    id: ID!
    templateId: ID
    userId: ID!
    filePath: String!
    createdAt: DateTime!
    updatedAt: DateTime!
  }

  type Mutation {
    uploadMeme(file: Upload!): Meme!
  }
`;

export const resolvers = {
  Mutation: {
    uploadMeme: async (_: any, { file }: { file: any }, { user }: { user: any }) => {
      if (!user) {
        throw new Error('Not authenticated');
      }

      const { createReadStream, filename } = await file;
      const stream = createReadStream();
      const chunks: Buffer[] = [];

      for await (const chunk of stream) {
        chunks.push(chunk);
      }

      const buffer = Buffer.concat(chunks);
      const savedFilename = await fileUploadService.saveMeme(buffer, filename);

      const meme = await Meme.query().insert({
        userId: user.id,
        filePath: savedFilename
      });

      return meme;
    }
  }
}; 