import {BaseObject} from "./base";
import {TextBlock} from "./textBlock";

export interface MemeText extends BaseObject {
	content: string;
	textBlock: TextBlock;
}
