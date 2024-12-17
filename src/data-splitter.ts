import fs from 'node:fs';
import type { MouseData } from './lib/types';

// Parse command line argument
const args = process.argv.slice(2);

if (args.length === 0) {
	console.error('Error: No file path provided.');
	console.error('Usage: ts-node data-splitter.ts <file-path>');
	process.exit(1);
}

const dataFilePath = args[0];

// Read data from file
const data: MouseData[] = JSON.parse(fs.readFileSync(dataFilePath, 'utf-8'));

interface Data {
	x: number;
	y: number;
	t: number;
}

const moveData: Data[] = [];
const scrollData: Data[] = [];

// Iterate data and push it to the respective arrays
for (const item of data) {
	if (item.type === 'move') {
		moveData.push({ x: item.mouseX as number, y: item.mouseY as number, t: item.timestampMs });
	} else if (item.type === 'scroll') {
		scrollData.push({
			x: item.scrollDeltaX as number,
			y: item.scrollDeltaY as number,
			t: item.timestampMs
		});
	}
}

const index = dataFilePath.match(/\d+/g);

// Saves arrays, if not empty
if (moveData.length)
	fs.writeFileSync(`data/movedata_${index ?? '00'}.json`, JSON.stringify(moveData));
if (scrollData.length)
	fs.writeFileSync(`data/scrolldata_${index ?? '00'}.json`, JSON.stringify(scrollData));
