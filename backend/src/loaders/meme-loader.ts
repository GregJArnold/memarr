import {BaseLoader} from "./base";
import {Meme} from "../models/meme";
import {Context} from "src/context";

export class MemeLoader extends BaseLoader<Meme> {
	constructor(ctx: Context) {
		super(ctx);
	}

	async batchLoad(keys: readonly string[]): Promise<Meme[]> {
		const memes = await Meme.query().whereIn("id", keys);
		const memeMap = new Map(memes.map(meme => [meme.id, meme]));
		return keys.map(key => memeMap.get(key) as Meme);
	}
}
