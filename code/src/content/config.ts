import { defineCollection, z } from 'astro:content';

const learn = defineCollection({
	type: 'content',
	schema: z.object({
		title: z.string(),
		description: z.string(),
		pubDate: z.date(),
		author: z.string(),
	})
});

export const collections = { learn };
