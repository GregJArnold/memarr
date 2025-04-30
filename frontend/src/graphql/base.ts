export interface BaseObject {
	id: string;
	createdAt: Date;
	updatedAt: Date;
}

export const inflateObject = <T extends BaseObject>(obj: T): T => {
	return {...obj, createdAt: new Date(obj.createdAt), updatedAt: new Date(obj.updatedAt)};
};
