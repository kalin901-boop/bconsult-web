# BConsult

Начална основа за публичния сайт на BConsult. Използва подхода на Деловод — Next.js App Router, TypeScript и Tailwind — без неговите бизнес модули и външни услуги.

## Изисквания

- Node.js **24.x** (виж `.nvmrc`).
- npm, включен с Node.js.

## Локално стартиране

```sh
npm ci
npm run dev
```

Отвори <http://localhost:3000>. За началния сайт не са необходими API ключове, база данни или `.env.local`.

## Команди

| Команда                | Предназначение                                                 |
| ---------------------- | -------------------------------------------------------------- |
| `npm run dev`          | Локален сървър с обновяване при промяна                        |
| `npm run lint`         | ESLint, без допустими предупреждения                           |
| `npm run type-check`   | Генериране на Next.js route types и strict TypeScript проверка |
| `npm run format:check` | Проверка на форматирането                                      |
| `npm run format`       | Форматиране на файловете                                       |
| `npm run check`        | Всички проверки за качество                                    |
| `npm run build`        | Production build                                               |
| `npm run start`        | Production сървър след успешен build                           |
| `npm run test:e2e`     | Playwright проверки на desktop и mobile след build             |

За проверка преди качване:

```sh
npm run check
npm run build
npm run start
```

Провери сайта в браузър, включително на тесен екран и с клавиатура. За Playwright изпълни `npx playwright install chromium`, след това `npm run build` и `npm run test:e2e`. Тестовете стартират собствен production сървър на порт 3107; остави порта свободен. Покриват keyboard skip link, responsive overflow и връщане към началото от HTTP 404. CI изпълнява проверките, production build и Playwright на push към `main` и на pull request. Външни услуги не са необходими за build.

## Структура

```text
src/
  app/                   # Страници, root layout, metadata, стилове и 404
  components/            # Споделени компоненти и layout
  lib/                   # Конфигурация на сайта и споделена логика
.github/
  workflows/ci.yml       # Автоматични проверки и build
  dependabot.yml         # Предложения за обновяване на зависимости
AGENTS.md                # Правила за AI асистенти и работа по кода
.env.example             # Описание на environment variables; без реални тайни
```

Началната страница представя Б-Консулт с послание „Очаквайте скоро“, пастелни цветове и трите направления: счетоводни услуги, застраховки и административно съдействие. Показва и текущия hostname за проверка на домейна. Няма фиктивни контакти, форми или потребителски данни. Страниците са Server Components; браузърната логика за hostname е изолирана в малък Client Component.

Използваме Node.js 24, Next.js 16, React 19, TypeScript 5.9 и Tailwind CSS 4. ESLint 9 е избран за съвместимост с peer dependencies на React lint plugins; обновявай го заедно с Next.js lint конфигурацията. Основните версии са в `package.json`, а възпроизводимите точни версии — в `package-lock.json`.

## Vercel

1. Качи repository-то в GitHub и го импортирай като нов проект във Vercel.
2. Избери **Framework Preset: Next.js**, не `Other` от стария HTML вариант.
3. **Root Directory:** коренът на repository-то. **Node.js Version:** `24.x`.
4. Остави стандартните настройки: build `npm run build`, автоматична output directory и инсталация от npm lockfile. Не задавай `public` като output.
5. Environment variables за началния сайт **не са нужни**.
6. Deploy, след това добави домейна през **Settings → Domains** и въведи точните DNS записи, показани от Vercel.

Отвори домейна и провери дали зарежда BConsult и показва правилния hostname. Провери и HTTPS в браузъра; страницата сама по себе си не доказва сертификата или всички DNS записи. Не е нужен `vercel.json` за стандартния Next.js deployment.

## Конвенции

- `@/` сочи към `src/`. Route-specific кодът остава при съответния route; споделеният UI — в `components/`.
- Server Components по подразбиране; `"use client"` само при реална нужда от браузърни API или интерактивност.
- Български интерфейс, английски имена в кода, семантичен HTML, видим focus и responsive layout.
- Системни шрифтове и локални ресурси; без външни заявки за шрифтове при build.
- `.next/`, `next-env.d.ts`, зависимости и локални environment файлове са генерирани/локални и не се commit-ват.
- Необходимите промени по зависимостите се правят с npm и включват lockfile-а.
- Реални secrets се пазят в `.env.local` или Vercel Environment Variables. `NEXT_PUBLIC_*` е публично и не е място за secrets.

## Граници на началната основа

Няма authentication, база данни, имейл услуги, analytics или бизнес модули. Добавят се при конкретни изисквания, а не като празни интеграции. Има lint, type, format и build проверки, както и Playwright behavior tests в `e2e/`, без тестове на статичен текст.

Този repository не наследява код, ключове, infrastructure или лиценз от Деловод. Не е зададен лиценз за публично разпространение; избери такъв изрично, ако проектът ще бъде open source.

## Проверка на началната основа

При създаването са изпълнени успешно `npm run check` и `npm run build`. Production сървърът е проверен в Chromium на 1440 px и 390 px: начална страница с HTTP 200, правилно показване на hostname, работа на skip link с клавиатура, липса на хоризонтално преливане, HTTP 404 за липсващ адрес и работещ линк обратно към началото. Няма отчетени JavaScript грешки. Vercel deployment, GitHub Actions и реалният домейн трябва да се проверят след качването; не са изпълнявани локално.

Пастелната страница „Очаквайте скоро Б-Консулт“ е проверена визуално на 1440 px и 390 px без отчетени JavaScript грешки. `npm run test:e2e` преминава успешно: 4 проверки общо за desktop и mobile.
