// Сгенерированная обёртка маршрута: вся вёрстка в src/views/. Меняется только код языка.
import type { APIContext } from 'astro';
import { blogRss } from '@/views/rss';

export const GET = (context: APIContext) => blogRss(context, 'ru');
