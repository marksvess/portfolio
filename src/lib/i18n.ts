export const LANGS = ['en', 'ru'] as const;
export type Lang = (typeof LANGS)[number];
export const DEFAULT_LANG: Lang = 'en';

const BASE = import.meta.env.BASE_URL.replace(/\/$/, '');

/**
 * Собирает ссылку внутри сайта с учётом base (/portfolio) и языка.
 * url('apps/', 'ru') -> /portfolio/ru/apps/
 * Для файлов (есть точка в последнем сегменте) слэш в конце не добавляется.
 */
export function url(path = '', lang: Lang = DEFAULT_LANG): string {
  const clean = path.replace(/^\/+/, '');
  const prefix = lang === DEFAULT_LANG ? '' : `${lang}/`;
  let full = `${BASE}/${prefix}${clean}`;
  const last = full.split('/').pop() ?? '';
  if (!full.endsWith('/') && !last.includes('.')) full += '/';
  return full;
}

/** Путь к файлу из public/ с учётом base. */
export function asset(path: string): string {
  if (/^https?:\/\//.test(path)) return path;
  return `${BASE}/${path.replace(/^\/+/, '')}`;
}

/** Путь текущей страницы без base и без языкового префикса: "apps/rice-calculator/". */
export function pathWithoutLang(pathname: string): string {
  let p = pathname.startsWith(BASE) ? pathname.slice(BASE.length) : pathname;
  p = p.replace(/^\/+/, '');
  for (const l of LANGS) {
    if (l === DEFAULT_LANG) continue;
    if (p === l || p.startsWith(`${l}/`)) p = p.slice(l.length).replace(/^\/+/, '');
  }
  return p;
}

/** Разбирает id записи коллекции "ru/rice-calculator" на язык и slug. */
export function splitId(id: string): { lang: Lang; slug: string } {
  const [lang, ...rest] = id.split('/');
  return { lang: lang as Lang, slug: rest.join('/') };
}

export function formatDate(date: Date, lang: Lang): string {
  return date.toLocaleDateString(lang === 'ru' ? 'ru-RU' : 'en-US', {
    year: 'numeric',
    month: 'long',
  });
}

export const ui = {
  en: {
    langName: 'English',
    switchTo: 'Русский',
    nav: { apps: 'Products', blog: 'Blog', about: 'About', contact: 'Contact' },
    hero: { viewApps: 'See products', contact: 'Get in touch' },
    home: {
      highlights: 'Highlights',
      skills: 'What I do',
      featured: 'Featured products',
      allApps: 'All products',
      latestPosts: 'Latest posts',
      allPosts: 'All posts',
    },
    apps: {
      title: 'Products',
      description: 'Products and MVPs I have built or managed. Open any card to read the story and try it.',
      empty: 'No products yet.',
      try: 'Try the MVP',
      tryExternal: 'Open product',
      noDemo: 'No public demo',
      problem: 'Problem',
      solution: 'Solution',
      outcome: 'Outcome',
      role: 'My role',
      links: 'Links',
      back: 'All products',
      demoLang: 'Demo available in',
      status: { live: 'Live', mvp: 'MVP', concept: 'Concept', archived: 'Archived' },
    },
    blog: { title: 'Blog', description: 'Notes on product management and building things.', empty: 'No posts yet.', back: 'All posts' },
    about: { title: 'About', experience: 'Experience', education: 'Education', skills: 'Skills', cv: 'Open CV' },
    cv: { title: 'CV', print: 'Save as PDF', hint: 'Use your browser print dialog and choose "Save as PDF".' },
    contact: {
      title: 'Contact',
      description: 'Write to me about a role, a product or a collaboration.',
      name: 'Name',
      email: 'Email',
      message: 'Message',
      send: 'Send',
      sending: 'Sending…',
      success: 'Thank you! Your message has been sent.',
      error: 'Something went wrong. Please write to me directly.',
      direct: 'Or reach me directly',
      formDisabled: 'The contact form is not configured yet. Please use the links below.',
    },
    notFound: { title: 'Page not found', back: 'Go to the home page' },
    footer: { built: 'Built with Astro' },
  },
  ru: {
    langName: 'Русский',
    switchTo: 'English',
    nav: { apps: 'Продукты', blog: 'Блог', about: 'Обо мне', contact: 'Контакты' },
    hero: { viewApps: 'Смотреть продукты', contact: 'Связаться' },
    home: {
      highlights: 'Достижения',
      skills: 'Чем занимаюсь',
      featured: 'Избранные продукты',
      allApps: 'Все продукты',
      latestPosts: 'Свежие статьи',
      allPosts: 'Все статьи',
    },
    apps: {
      title: 'Продукты',
      description: 'Продукты и MVP, которые я создавал или вёл. Откройте карточку, чтобы прочитать историю и попробовать продукт.',
      empty: 'Продуктов пока нет.',
      try: 'Попробовать MVP',
      tryExternal: 'Открыть продукт',
      noDemo: 'Публичного демо нет',
      problem: 'Проблема',
      solution: 'Решение',
      outcome: 'Результат',
      role: 'Моя роль',
      links: 'Ссылки',
      back: 'Все продукты',
      demoLang: 'Демо доступно на языках',
      status: { live: 'Работает', mvp: 'MVP', concept: 'Концепт', archived: 'В архиве' },
    },
    blog: { title: 'Блог', description: 'Заметки о продакт-менеджменте и создании продуктов.', empty: 'Статей пока нет.', back: 'Все статьи' },
    about: { title: 'Обо мне', experience: 'Опыт', education: 'Образование', skills: 'Навыки', cv: 'Открыть резюме' },
    cv: { title: 'Резюме', print: 'Сохранить в PDF', hint: 'Откройте печать в браузере и выберите «Сохранить как PDF».' },
    contact: {
      title: 'Контакты',
      description: 'Напишите мне о вакансии, продукте или сотрудничестве.',
      name: 'Имя',
      email: 'Email',
      message: 'Сообщение',
      send: 'Отправить',
      sending: 'Отправка…',
      success: 'Спасибо! Сообщение отправлено.',
      error: 'Не удалось отправить. Напишите мне напрямую.',
      direct: 'Или напишите напрямую',
      formDisabled: 'Форма обратной связи ещё не настроена. Воспользуйтесь ссылками ниже.',
    },
    notFound: { title: 'Страница не найдена', back: 'На главную' },
    footer: { built: 'Сделано на Astro' },
  },
} as const;

export function t(lang: Lang) {
  return ui[lang];
}
