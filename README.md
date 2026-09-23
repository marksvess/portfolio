# Портфолио Maxim Glushchenko

Сайт-портфолио продакт-менеджера: резюме, блог и каталог продуктов, в каждый из которых можно зайти и попробовать MVP.
Все решения и их причины — в [Reference.md](Reference.md).

- Продакшен: https://marksvess.github.io/portfolio/ (после подключения домена — https://marksvess.com)
- Стек: Astro 7, MDX, Tailwind CSS 4, токены в стиле shadcn/ui, Keystatic, GitHub Pages.

## Запуск на компьютере

Нужен Node.js 22 или новее. Один раз после скачивания проекта:

```bash
npm install
```

Каждый раз для работы:

```bash
npm run dev
```

- Сайт: http://localhost:4321/
- Админка контента Keystatic: http://localhost:4321/keystatic

Остановить: `Ctrl + C` в терминале.

## Как добавить продукт (mini app)

1. Keystatic → **Products EN** → Add. Заполнить поля, поле Slug только латиницей.
2. Keystatic → **Products RU** → Add. Тот же Slug, что у английской версии.
3. Тип демо:
   - **External link** — ссылка на внешний сайт, заполнить Demo URL.
   - **Embedded** — MVP лежит в этом репозитории в папке `apps/<slug>/`, см. [apps/README.md](apps/README.md).
   - **No demo** — только описание.
4. Проверить страницу `http://localhost:4321/apps/<slug>/`.
5. Опубликовать: GitHub Desktop → Commit to main → Push origin.

## Как обновить резюме

Keystatic → **Profile EN** и **Profile RU**. Эти данные используются на главной, на странице «Обо мне» и в резюме `/cv/`.
PDF-версия: открыть `/cv/`, нажать «Save as PDF».

## Как написать статью

Keystatic → **Blog EN** / **Blog RU** → Add. Отметка Draft скрывает статью с сайта.

## Публикация

Каждый push в ветку `main` запускает сборку на GitHub (вкладка Actions), через 1–2 минуты сайт обновлён.
Проверить сборку локально перед push:

```bash
npm run build
npm run check:links
```

## Настройки на GitHub

Settings → Secrets and variables → Actions → **Variables**:

| Переменная | Значение | Когда |
|---|---|---|
| `PUBLIC_WEB3FORMS_KEY` | ключ с web3forms.com | чтобы заработала форма обратной связи |
| `PUBLIC_UMAMI_WEBSITE_ID` | Website ID из Umami Cloud | чтобы заработала аналитика |
| `SITE_URL` | `https://marksvess.com` | после подключения домена |
| `BASE_PATH` | `/` | после подключения домена |

## Структура

```
src/content/        контент: profile/, apps/<lang>/, blog/<lang>/
src/views/          вёрстка страниц (одна на оба языка)
src/pages/          маршруты: EN в корне, RU в ru/
src/styles/tokens.css  дизайн-токены (цвета, радиусы), позже из Figma
apps/<slug>/        исходники встроенных MVP
public/images/      картинки: apps/<slug>/cover.*, profile/, blog/
Data/               личные исходники (фото, резюме, CV), не публикуются
```
