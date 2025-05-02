import {gql} from "@apollo/client";
import {BaseObject, inflateObject} from "./base";
import {Tag} from "./tag";
import {Template} from "./template";
import {MemeText} from "./memeText";

export const MEME_FRAGMENT = gql`
	fragment MemeFragment on Meme {
		id
		createdAt
		updatedAt
		filePath
		pendingProcessing
		url
		tags {
			id
			name
		}
		template {
			id
			name
		}
		texts {
			id
			content
			textBlock {
				id
				key
				label
			}
		}
	}
`;

export const GET_MEME_QUERY = gql`
	query GetMeme($memeId: ID!) {
		meme(memeId: $memeId) {
			...MemeFragment @unmask
		}
	}
	${MEME_FRAGMENT}
`;

export const GET_MEMES_QUERY = gql`
	query GetMemes($templateId: [ID!], $textContent: String, $tags: [ID!], $allTags: Boolean) {
		memes(templateId: $templateId, textContent: $textContent, tags: $tags, allTags: $allTags) {
			...MemeFragment @unmask
		}
	}
	${MEME_FRAGMENT}
`;

export const UPLOAD_MEME_MUTATION = gql`
	mutation UploadMeme($file: Upload!) {
		uploadMeme(file: $file) {
			...MemeFragment @unmask
		}
	}
`;

export const ADD_TAG_MUTATION = gql`
	mutation AddTag($memeId: ID!, $tagName: String!) {
		addTag(memeId: $memeId, tagName: $tagName) {
			...MemeFragment @unmask
		}
	}
	${MEME_FRAGMENT}
`;

export const REMOVE_TAG_MUTATION = gql`
	mutation RemoveTag($memeId: ID!, $tagId: ID!) {
		removeTag(memeId: $memeId, tagId: $tagId) {
			...MemeFragment @unmask
		}
	}
`;

export const ADD_TEXT_BLOCK_MUTATION = gql`
	mutation AddTextBlock($memeId: ID!, $text: String!, $position: Int!) {
		addTextBlock(memeId: $memeId, text: $text, position: $position) {
			...MemeFragment @unmask
		}
	}
	${MEME_FRAGMENT}
`;

export const UPDATE_TEXT_BLOCK_MUTATION = gql`
	mutation UpdateTextBlock($textBlockId: ID!, $text: String!) {
		updateTextBlock(textBlockId: $textBlockId, text: $text) {
			...MemeFragment @unmask
		}
	}
	${MEME_FRAGMENT}
`;

export const DELETE_TEXT_BLOCK_MUTATION = gql`
	mutation DeleteTextBlock($textBlockId: ID!) {
		deleteTextBlock(textBlockId: $textBlockId) {
			...MemeFragment @unmask
		}
	}
	${MEME_FRAGMENT}
`;

export interface Meme extends BaseObject {
	filePath: string;
	pendingProcessing: boolean;
	tags: Tag[];
	texts: MemeText[];
	template: Template;
	url: string;
}

export const inflateMeme = (meme: Meme): Meme => {
	return inflateObject(meme);
};
