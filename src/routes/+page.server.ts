import type { ImageOption, Placeholder } from '$lib/types';
import type { PageServerLoad } from './$types';

const getRandomInt = (max: number) => {
	return Math.floor(Math.random() * max);
};

const createRandomPlaceholders = (length: number) => {
	const placeholders: Placeholder[] = [];
	const imageOptions: ImageOption[] = [false, 'half', 'full'];
	for (let i = 0; i < length; i++) {
		placeholders.push({
			image: imageOptions[getRandomInt(imageOptions.length)],
			comment: getRandomInt(2) > 0
		});
	}
	return placeholders;
};

export const load: PageServerLoad = async ({ url }) => {
	const lengthParam = url.searchParams.get('l');
	return {
		placeholders: createRandomPlaceholders(
			lengthParam && lengthParam.length ? parseInt(lengthParam) : 100
		)
	};
};
