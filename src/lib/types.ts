export type ImageOption = false | 'half' | 'full';

export interface Placeholder {
	image: ImageOption;
	comment: boolean;
}

export type MouseDataType = 'move' | 'scroll';

export interface MouseData {
	type: MouseDataType;
	scrollDeltaX?: number;
	scrollDeltaY?: number;
	mouseX?: number;
	mouseY?: number;
	timestampMs: number;
}
