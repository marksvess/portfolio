// Админка контента. Открывается только локально: npm run dev -> http://localhost:4321/keystatic
// Поля повторяют схему src/content.config.ts (Reference.md, разделы 3.3–3.5).
import { collection, config, fields, singleton } from '@keystatic/core';

type Lang = 'en' | 'ru';
const L = (lang: Lang) => (lang === 'en' ? 'EN' : 'RU');

const profile = (lang: Lang) =>
  singleton({
    label: `Profile ${L(lang)}`,
    path: `src/content/profile/${lang}`,
    format: { data: 'yaml' },
    schema: {
      name: fields.text({ label: 'Name' }),
      title: fields.text({ label: 'Title' }),
      location: fields.text({ label: 'Location' }),
      photo: fields.image({
        label: 'Photo',
        directory: 'public/images/profile',
        publicPath: '/images/profile/',
      }),
      summary: fields.text({ label: 'Summary (home page, 1–3 sentences)', multiline: true }),
      bio: fields.text({ label: 'Bio (About page, blank line = new paragraph)', multiline: true }),
      highlights: fields.array(fields.text({ label: 'Highlight' }), {
        label: 'Highlights (with numbers)',
        itemLabel: (p) => p.value,
      }),
      skills: fields.array(
        fields.object({
          title: fields.text({ label: 'Title' }),
          description: fields.text({ label: 'Description' }),
        }),
        { label: 'Skills', itemLabel: (p) => p.fields.title.value },
      ),
      experience: fields.array(
        fields.object({
          company: fields.text({ label: 'Company' }),
          role: fields.text({ label: 'Role' }),
          period: fields.text({ label: 'Period', description: 'e.g. 2022 — now' }),
          location: fields.text({ label: 'Location' }),
          achievements: fields.array(fields.text({ label: 'Achievement' }), {
            label: 'Achievements',
            itemLabel: (p) => p.value,
          }),
        }),
        { label: 'Experience', itemLabel: (p) => `${p.fields.role.value}, ${p.fields.company.value}` },
      ),
      education: fields.array(
        fields.object({
          institution: fields.text({ label: 'Institution' }),
          degree: fields.text({ label: 'Degree' }),
          period: fields.text({ label: 'Period' }),
        }),
        { label: 'Education', itemLabel: (p) => p.fields.institution.value },
      ),
      contacts: fields.object(
        {
          email: fields.text({ label: 'Email' }),
          linkedin: fields.url({ label: 'LinkedIn URL' }),
          telegram: fields.url({ label: 'Telegram URL' }),
          github: fields.url({ label: 'GitHub URL' }),
        },
        { label: 'Contacts' },
      ),
    },
  });

const apps = (lang: Lang) =>
  collection({
    label: `Products ${L(lang)}`,
    slugField: 'title',
    path: `src/content/apps/${lang}/*`,
    format: { contentField: 'content' },
    entryLayout: 'form',
    columns: ['title', 'date'],
    schema: {
      title: fields.slug({
        name: { label: 'Title' },
        slug: { label: 'Slug', description: 'Latin only, the same for EN and RU versions' },
      }),
      tagline: fields.text({ label: 'Tagline (one line)' }),
      cover: fields.image({
        label: 'Cover (16:9)',
        directory: 'public/images/apps',
        publicPath: '/images/apps/',
      }),
      date: fields.date({ label: 'Date', validation: { isRequired: true } }),
      status: fields.select({
        label: 'Status',
        options: [
          { label: 'Live', value: 'live' },
          { label: 'MVP', value: 'mvp' },
          { label: 'Concept', value: 'concept' },
          { label: 'Archived', value: 'archived' },
        ],
        defaultValue: 'mvp',
      }),
      demoType: fields.select({
        label: 'Demo type',
        description: 'external = link to another site, embedded = folder apps/<slug>/ in this repo',
        options: [
          { label: 'External link', value: 'external' },
          { label: 'Embedded (this site)', value: 'embedded' },
          { label: 'No demo', value: 'none' },
        ],
        defaultValue: 'external',
      }),
      demoUrl: fields.url({ label: 'Demo URL (for external)' }),
      demoLanguages: fields.multiselect({
        label: 'Demo languages',
        options: [
          { label: 'English', value: 'en' },
          { label: 'Русский', value: 'ru' },
        ],
      }),
      role: fields.text({ label: 'My role', multiline: true }),
      tags: fields.array(fields.text({ label: 'Tag' }), { label: 'Tags', itemLabel: (p) => p.value }),
      problem: fields.text({ label: 'Problem', multiline: true }),
      solution: fields.text({ label: 'Solution', multiline: true }),
      outcome: fields.text({ label: 'Outcome and metrics', multiline: true }),
      links: fields.array(
        fields.object({ label: fields.text({ label: 'Label' }), url: fields.url({ label: 'URL' }) }),
        { label: 'Links', itemLabel: (p) => p.fields.label.value },
      ),
      featured: fields.checkbox({ label: 'Show on home page' }),
      draft: fields.checkbox({ label: 'Draft (hidden from the site)' }),
      content: fields.mdx({ label: 'Extra details (optional)' }),
    },
  });

const blog = (lang: Lang) =>
  collection({
    label: `Blog ${L(lang)}`,
    slugField: 'title',
    path: `src/content/blog/${lang}/*`,
    format: { contentField: 'content' },
    entryLayout: 'content',
    columns: ['title', 'date'],
    schema: {
      title: fields.slug({ name: { label: 'Title' }, slug: { label: 'Slug', description: 'Latin only' } }),
      description: fields.text({ label: 'Description', multiline: true }),
      date: fields.date({ label: 'Date', validation: { isRequired: true } }),
      tags: fields.array(fields.text({ label: 'Tag' }), { label: 'Tags', itemLabel: (p) => p.value }),
      cover: fields.image({ label: 'Cover', directory: 'public/images/blog', publicPath: '/images/blog/' }),
      draft: fields.checkbox({ label: 'Draft (hidden from the site)' }),
      content: fields.mdx({ label: 'Text' }),
    },
  });

export default config({
  storage: { kind: 'local' },
  ui: {
    brand: { name: 'Portfolio' },
    navigation: {
      Profile: ['profileEn', 'profileRu'],
      Products: ['appsEn', 'appsRu'],
      Blog: ['blogEn', 'blogRu'],
    },
  },
  singletons: { profileEn: profile('en'), profileRu: profile('ru') },
  collections: {
    appsEn: apps('en'),
    appsRu: apps('ru'),
    blogEn: blog('en'),
    blogRu: blog('ru'),
  },
});
