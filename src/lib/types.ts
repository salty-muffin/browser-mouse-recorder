export type ImageOption = false | 'half' | 'full';

export interface Placeholder {
	image: ImageOption;
	comment: boolean;
}

export type MouseDataType = 'move' | 'scroll';

export interface MouseData {
	type: MouseDataType;
	deltaX?: number;
	deltaY?: number;
	offsetX?: number;
	offsetY?: number;
	timestampMs: number;
}
