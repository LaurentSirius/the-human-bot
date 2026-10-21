import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';
import { extractYoutubeId } from './lib/youtube';

const releases = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/releases' }),
  schema: z
    .object({
      title: z.string(),
      /** Any YouTube link (watch, youtu.be, shorts…) or a bare video ID. */
      youtube: z.string().optional(),
      /** Legacy fields (still accepted). */
      youtubeId: z.string().optional(),
      youtubeUrl: z.string().optional(),
      date: z.coerce.date().optional(),
      featured: z.boolean().default(false),
      description: z.string().optional(),
      order: z.number().default(0),
    })
    .transform((data, ctx) => {
      const youtubeId =
        extractYoutubeId(data.youtube) ?? extractYoutubeId(data.youtubeId) ?? extractYoutubeId(data.youtubeUrl);
      if (!youtubeId) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: `Lien YouTube invalide pour « ${data.title} »`,
        });
        return z.NEVER;
      }
      return { ...data, youtubeId };
    }),
});

const links = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/links' }),
  schema: z.object({
    title: z.string(),
    url: z.string(),
    order: z.number().default(0),
    note: z.string().optional(),
  }),
});

export const collections = { releases, links };
