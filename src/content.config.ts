import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

// Модель данных описана в Reference.md, разделы 3.3–3.5.
// Файлы лежат по языкам: src/content/<collection>/<lang>/<slug>.mdx

const link = z.object({ label: z.string(), url: z.string().url() });
// Keystatic сохраняет пустые поля как null: приводим к пустой строке.
const text = z.string().nullish().transform((v) => v ?? '');

const apps = defineCollection({
  loader: glob({ base: './src/content/apps', pattern: '**/*.{md,mdx}' }),
  schema: z
    .object({
      title: z.string(),
      tagline: z.string(),
      cover: z.string().nullish(),
      date: z.coerce.date(),
      status: z.enum(['live', 'mvp', 'concept', 'archived']),
      demoType: z.enum(['external', 'embedded', 'none']),
      demoUrl: z.string().url().nullish().or(z.literal('')),
      demoLanguages: z.array(z.string()).default([]),
      role: z.string(),
      tags: z.array(z.string()).default([]),
      problem: z.string(),
      solution: z.string(),
      outcome: z.string(),
      links: z.array(link).default([]),
      featured: z.boolean().default(false),
      draft: z.boolean().default(false),
    })
    .refine((d) => d.demoType !== 'external' || !!d.demoUrl, {
      message: 'demoType "external" требует заполненный demoUrl',
      path: ['demoUrl'],
    }),
});

const blog = defineCollection({
  loader: glob({ base: './src/content/blog', pattern: '**/*.{md,mdx}' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    date: z.coerce.date(),
    tags: z.array(z.string()).default([]),
    cover: z.string().nullish(),
    draft: z.boolean().default(false),
  }),
});

const profile = defineCollection({
  loader: glob({ base: './src/content/profile', pattern: '*.yaml' }),
  schema: z.object({
    name: z.string(),
    title: z.string(),
    location: text,
    photo: z.string().nullish(),
    summary: z.string(),
    bio: z.string(),
    highlights: z.array(z.string()).default([]),
    skills: z.array(z.object({ title: z.string(), description: z.string() })).default([]),
    experience: z
      .array(
        z.object({
          company: z.string(),
          role: z.string(),
          period: z.string(),
          location: text,
          achievements: z.array(z.string()).default([]),
        }),
      )
      .default([]),
    education: z
      .array(z.object({ institution: z.string(), degree: z.string(), period: z.string() }))
      .default([]),
    contacts: z
      .object({
        email: text,
        linkedin: text,
        telegram: text,
        github: text,
      })
      .default({ email: '', linkedin: '', telegram: '', github: '' }),
  }),
});

export const collections = { apps, blog, profile };
