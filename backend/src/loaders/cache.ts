import {Context} from "src/context";
import {BaseLoader} from "./base";

export class LoaderCache {
	private loaders: Record<string, any>;
	protected ctx: Context;

	constructor(ctx: Context) {
		this.ctx = ctx;
		this.loaders = {};
	}

	get<T extends BaseLoader<any>>(Loader: LoaderConstructor<T>): T {
		if (!this.loaders[Loader.name]) {
			this.loaders[Loader.name] = new Loader(this.ctx);
		}
		return this.loaders[Loader.name];
	}

	async load<T extends BaseLoader<any>>(
		Loader: LoaderConstructor<T>,
		key: string | null | undefined
	): Promise<any> {
		return this.get(Loader).load(key);
	}
}

export interface LoaderConstructor<T extends BaseLoader<any>> {
	new (ctx: Context): T;
}
