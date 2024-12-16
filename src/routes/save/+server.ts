import fs from 'fs';
import path from 'path';
import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ request }) => {
	// Create data dir
	const dataDir = 'data';
	fs.mkdirSync(dataDir, { recursive: true });

	// Filter out & and sort previously existing saved data files
	const existingFiles = fs
		.readdirSync(dataDir)
		.filter((file) => file.search(/scrolldata_\d+.json/) >= 0)
		.sort();

	// Ffind index of last saved data file
	const index = existingFiles.length ? existingFiles[existingFiles.length - 1].match(/\d+/g) : null;
	const newIndex = index ? parseInt(index[0]) + 1 : 0;
	// Increment index or start with 0
	const filename = path.join(dataDir, `scrolldata_${String(newIndex).padStart(2, '0')}.json`);

	// Save data and return filepath in response
	fs.writeFileSync(filename, await request.text());
	return json({ filename });
};
