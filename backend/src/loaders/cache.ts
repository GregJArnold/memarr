import {Context} from "src/context";
import {BaseLoader} from "./base";
import {BaseModel} from "src/models/base";

export class LoaderCache {
	private loaders: Record<string, BaseLoader<BaseModel>>;
	protected ctx: Context;

	constructor(ctx: Omit<Context, "loaders">) {
		this.ctx = ctx as Context;
		this.loaders = {};
	}

	get<T extends BaseLoader<BaseModel>>(Loader: LoaderConstructor<T>): T {
		if (!this.loaders[Loader.name]) {
			this.loaders[Loader.name] = new Loader(this.ctx);
		}
		return this.loaders[Loader.name] as T;
	}

	async load<T extends BaseLoader<BaseModel>>(
		Loader: LoaderConstructor<T>,
		key: string | null | undefined
	): Promise<BaseModel | undefined> {
		return this.get(Loader).load(key);
	}
}

export interface LoaderConstructor<T extends BaseLoader<BaseModel>> {
	new (ctx: Context): T;
}
