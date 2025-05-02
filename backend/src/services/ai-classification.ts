import {Template} from "../models/template";
import {v4 as uuidv4} from "uuid";
import fetch from "node-fetch";

export interface AIClassificationResult {
	template?: Template;
	textBlocks: Array<{textBlockId: string; content: string}>;
}

export class AIClassifier {
	async classifyImage(imageBuffer: Buffer): Promise<AIClassificationResult> {
		const base64Image = imageBuffer.toString("base64");

		const prompt = `Analyze this meme image and identify:
1. The template name (e.g., "Distracted Boyfriend", "Drake Hotline Bling")
2. Any text blocks and their positions (e.g., "top text", "bottom text")

If you cannot identify the template, respond with "unknown" for the template name.
Format your response as JSON with the following structure:
{
  "templateName": "template name or unknown",
  "textBlocks": ["text", "text", "text"]
}`;

		const response = await fetch(`${process.env.OLLAMA_HOST}/api/generate`, {
			method: "POST",
			headers: {"Content-Type": "application/json"},
			body: JSON.stringify({
				model: "llava",
				prompt: prompt,
				images: [base64Image],
				stream: false,
			}),
		});

		if (!response.ok) throw new Error(`Ollama API error: ${response.statusText}`);

		const result = await response.json();
		const parsedResult = JSON.parse(result.response);

		if (parsedResult.templateName === "unknown") return {textBlocks: []};

		let template = await Template.query().findOne({name: parsedResult.templateName});
		if (!template) template = await new Template().$query().insertAndFetch({name: parsedResult.templateName});

		// Process text blocks
		const textBlocks = parsedResult.textBlocks.map((content: string) => ({textBlockId: uuidv4(), content}));

		return {
			template,
			textBlocks,
		};
	}
}
