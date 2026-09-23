import { getCollection, getEntry, type CollectionEntry } from 'astro:content';
import { splitId, type Lang } from './i18n';

export type AppEntry = CollectionEntry<'apps'> & { slug: string; lang: Lang };
export type PostEntry = CollectionEntry<'blog'> & { slug: string; lang: Lang };

function withSlug<T extends { id: string }>(e: T) {
  return Object.assign(e, splitId(e.id));
}

export async function getApps(lang: Lang): Promise<AppEntry[]> {
  const all = await getCollection('apps', (e) => e.id.startsWith(`${lang}/`) && !e.data.draft);
  return all.map(withSlug).sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf());
}

export async function getPosts(lang: Lang): Promise<PostEntry[]> {
  const all = await getCollection('blog', (e) => e.id.startsWith(`${lang}/`) && !e.data.draft);
  return all.map(withSlug).sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf());
}

export async function getProfile(lang: Lang) {
  const entry = await getEntry('profile', lang);
  if (!entry) throw new Error(`Нет файла профиля src/content/profile/${lang}.yaml`);
  return entry.data;
}

/** Делит многострочный текст на абзацы по пустой строке. */
export function paragraphs(text: string): string[] {
  return text
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean);
}
