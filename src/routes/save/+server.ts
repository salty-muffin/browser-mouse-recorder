import fs from 'fs';
import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ request }) => {
	const filename = 'scrolldata.json';
	fs.writeFileSync(filename, await request.text());
	return json({ filename });
};
