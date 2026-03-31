import { defineCollection, z } from 'astro:content';

const docs = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string().optional(),
    sidebar_position: z.number().optional(),
    // Preserve Docusaurus frontmatter fields so existing .md files validate
    slug: z.string().optional(),
    id: z.string().optional(),
  }),
});

export const collections = { docs };
