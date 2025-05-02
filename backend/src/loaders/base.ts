import DataLoader from "dataloader";
import {BaseModel} from "../models/base";
import {Context} from "src/context";
import {IFieldResolver} from "@graphql-tools/utils";

export abstract class BaseLoader<V extends BaseModel> {
	protected loader: DataLoader<string, V>;
	protected ctx: Context;

	constructor(ctx: Context) {
		this.ctx = ctx;
		this.loader = new DataLoader(async keys => this.batchLoad(keys));
	}

	abstract batchLoad(keys: readonly string[]): Promise<V[]>;

	async load(key: string | null | undefined): Promise<V | undefined> {
		return key == null ? undefined : this.loader.load(key);
	}

	static resolver<P extends Record<string, any>>(prop: keyof P): IFieldResolver<P, Context> {
		return async (parent: P, _args: unknown, ctx: Context): Promise<any> =>
			ctx.loaders.load(this as any, parent[prop]);
	}
}
