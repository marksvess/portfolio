import rss from '@astrojs/rss';
import type { APIContext } from 'astro';
import { url, type Lang } from '@/lib/i18n';
import { getPosts, getProfile } from '@/lib/content';

export async function blogRss(context: APIContext, lang: Lang) {
  const p = await getProfile(lang);
  const posts = await getPosts(lang);
  return rss({
    title: `${p.name} — Blog`,
    description: p.summary,
    site: context.site!,
    items: posts.map((post) => ({
      title: post.data.title,
      description: post.data.description,
      pubDate: post.data.date,
      link: url(`blog/${post.slug}/`, lang),
    })),
    customData: `<language>${lang}</language>`,
  });
}
