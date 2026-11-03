import type { Context } from 'https://edge.netlify.com';
import {
  currentWeek,
  sameWeek,
  viennaISODate,
  weekByNumber,
  weeksInIsoYear,
  type WeekInfo,
} from './lib/week.ts';

/**
 * Fills the HTML that Google reads with the Vienna calendar week.
 *
 * The week number itself was never off by one. Search snippets lagged because
 * a crawl from last week stayed in Google's index, and a cached HTML document
 * could outlive the week it described. This function:
 * - answers for Europe/Vienna, including the Sunday-night / Monday-morning boundary
 * - puts that answer in the title, description, JSON-LD and the first paragraph
 * - gives week pages a stable title that does not go stale
 * - tells the CDN to keep HTML for two minutes, not for a week
 * - serves a sitemap whose homepage lastmod is today's Vienna date
 */

const SITE = 'https://welche-kalenderwoche-ist-heute.at';

interface Copy {
  title: string;
  description: string;
  question: string;
  answer: string;
  bootLine: string;
}

const STATIC_PAGES: Record<string, { title: string; description: string }> = {
  '/info': {
    title: 'Kalenderwoche verstehen · ISO 8601, Feiertage, Fenstertage',
    description:
      'Wie die Kalenderwoche nach ISO 8601 gezählt wird und welche Feiertage und Fenstertage in Österreich, Deutschland und der Schweiz gelten.',
  },
  '/kontakt': {
    title: 'Kontakt · Welche Kalenderwoche ist heute?',
    description: 'Nachricht an die Kalenderwochen-App.',
  },
  '/datenschutz': {
    title: 'Datenschutz · Welche Kalenderwoche ist heute?',
    description: 'Datenschutzerklärung. Keine Konten, keine Tracker, Einstellungen bleiben im Browser.',
  },
};

function escapeHtml(value: string): string {
  return value.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;');
}

function todayCopy(info: WeekInfo): Copy {
  return {
    title: `KW ${info.week} ist heute (${info.range}) | Welche Kalenderwoche?`,
    description: `Heute, ${info.weekday}, ${info.todayLong}, ist KW ${info.week} (${info.range}). Feiertage und Fenstertage für AT, DE und CH.`,
    question: 'Welche Kalenderwoche ist heute?',
    answer: `Heute, am ${info.weekday}, dem ${info.todayLong}, ist Kalenderwoche ${info.week}. Sie läuft von ${info.startLong} bis ${info.endLong} (${info.iso}).`,
    bootLine: `${info.weekday}, ${info.todayLong} · ${info.iso} · Wien`,
  };
}

function weekCopy(info: WeekInfo): Copy {
  return {
    title: `KW ${info.week} ${info.weekYear} (${info.range})`,
    description: `Kalenderwoche ${info.week} (${info.iso}) dauert vom ${info.startLong} bis ${info.endLong}.`,
    question: `Kalenderwoche ${info.week}`,
    answer: `Kalenderwoche ${info.week} im Jahr ${info.weekYear} beginnt am Montag, ${info.startLong}, und endet am Sonntag, ${info.endLong}.`,
    bootLine: `${info.range} · ${info.iso}`,
  };
}

function missingCopy(): Copy {
  return {
    title: 'Diese Kalenderwoche gibt es nicht',
    description: 'Ein ISO-Jahr hat 52 oder 53 Kalenderwochen. Diese Nummer liegt außerhalb.',
    question: 'Diese Woche gibt es nicht',
    answer: 'Ein Jahr hat 52 oder 53 Kalenderwochen. Die aufgerufene Nummer liegt außerhalb.',
    bootLine: 'ISO 8601',
  };
}

function jsonLd(copy: Copy, canonical: string, info: WeekInfo, todayPage: boolean, withFaq: boolean): string {
  const page = {
    '@type': 'WebPage',
    name: copy.title,
    url: canonical,
    description: copy.description,
    dateModified: viennaISODate(),
    inLanguage: 'de-AT',
  };
  if (!withFaq) {
    return JSON.stringify({ '@context': 'https://schema.org', '@graph': [page] });
  }
  return JSON.stringify({
    '@context': 'https://schema.org',
    '@graph': [
      page,
      {
        '@type': 'FAQPage',
        mainEntity: [
          {
            '@type': 'Question',
            name: todayPage ? 'Welche Kalenderwoche ist heute?' : `Wann ist KW ${info.week} ${info.weekYear}?`,
            acceptedAnswer: { '@type': 'Answer', text: copy.answer },
          },
          {
            '@type': 'Question',
            name: `Von wann bis wann geht KW ${info.week}?`,
            acceptedAnswer: {
              '@type': 'Answer',
              text: `KW ${info.week} (${info.iso}) beginnt am Montag, ${info.startLong}, und endet am Sonntag, ${info.endLong}.`,
            },
          },
        ],
      },
    ],
  });
}

function sitemap(): string {
  const today = viennaISODate();
  const now = currentWeek();
  const urls: { loc: string; lastmod: string; changefreq: string; priority: string }[] = [
    { loc: `${SITE}/`, lastmod: today, changefreq: 'daily', priority: '1.0' },
    { loc: `${SITE}/info`, lastmod: '2026-11-03', changefreq: 'monthly', priority: '0.4' },
    { loc: `${SITE}/kontakt`, lastmod: '2026-11-03', changefreq: 'yearly', priority: '0.2' },
    { loc: `${SITE}/datenschutz`, lastmod: '2026-11-03', changefreq: 'yearly', priority: '0.1' },
  ];

  for (const year of [now.weekYear - 1, now.weekYear, now.weekYear + 1]) {
    for (let week = 1; week <= weeksInIsoYear(year); week += 1) {
      const info = weekByNumber(year, week);
      if (!info) continue;
      const [day, month, isoYear] = info.start.split('.');
      const monday = `${isoYear}-${month}-${day}`;
      urls.push({
        loc: `${SITE}/kw/${year}/${week}`,
        lastmod: monday <= today ? monday : today,
        changefreq: 'weekly',
        priority: sameWeek(info, now) ? '0.8' : '0.5',
      });
    }
  }

  const body = urls
    .map(
      (url) =>
        `  <url><loc>${url.loc}</loc><lastmod>${url.lastmod}</lastmod><changefreq>${url.changefreq}</changefreq><priority>${url.priority}</priority></url>`,
    )
    .join('\n');
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${body}\n</urlset>\n`;
}

export default async (request: Request, context: Context) => {
  const url = new URL(request.url);
  if (url.pathname === '/sitemap.xml') {
    return new Response(sitemap(), {
      headers: {
        'content-type': 'application/xml; charset=utf-8',
        'cache-control': 'public, max-age=0, must-revalidate',
        'netlify-cdn-cache-control': 'public, max-age=600, must-revalidate',
      },
    });
  }

  const response = await context.next();
  const contentType = response.headers.get('content-type');
  if (!contentType || !contentType.includes('text/html')) return response;

  const now = currentWeek();
  const pathname = url.pathname.replace(/\/$/, '') || '/';
  const weekMatch = pathname.match(/^\/kw\/(\d{4})\/(\d{1,2})$/);
  const specific = weekMatch ? weekByNumber(Number(weekMatch[1]), Number(weekMatch[2])) : null;
  const invalidWeek = Boolean(weekMatch && !specific);
  const info = specific ?? now;
  // Week URLs keep a title that stays true after the week ends.
  // Only the homepage claims "heute", and only for Vienna's current week.
  // A week number that does not exist must not inherit that claim.
  const staticPage = STATIC_PAGES[pathname];
  const todayPage = !weekMatch && !staticPage;
  const copy = specific ? weekCopy(specific) : invalidWeek ? missingCopy() : todayCopy(now);
  const title = staticPage?.title ?? copy.title;
  const description = staticPage?.description ?? copy.description;
  const canonical = specific ? `${SITE}/kw/${info.weekYear}/${info.week}` : pathname === '/' ? `${SITE}/` : `${SITE}${pathname}`;

  const replacements: Record<string, string> = {
    '{{TITLE}}': escapeHtml(title),
    '{{DESCRIPTION}}': escapeHtml(description),
    '{{CANONICAL}}': escapeHtml(canonical),
    '{{QUESTION}}': escapeHtml(staticPage ? staticPage.title : copy.question),
    '{{ANSWER}}': escapeHtml(copy.answer),
    '{{BOOT_LINE}}': escapeHtml(copy.bootLine),
    '{{KW}}': String(specific ? specific.week : invalidWeek ? (weekMatch?.[2] ?? '–') : now.week),
    '{{JSON_LD}}': jsonLd(
      todayPage ? todayCopy(now) : copy,
      canonical,
      todayPage ? now : info,
      todayPage,
      !invalidWeek && !staticPage,
    ),
    '{{ROBOTS}}': invalidWeek ? 'noindex, follow' : 'index, follow, max-snippet:-1, max-image-preview:large',
  };

  let text = await response.text();
  for (const [token, value] of Object.entries(replacements)) {
    text = text.replaceAll(token, value);
  }

  const headers = new Headers(response.headers);
  headers.delete('content-length');
  headers.set('cache-control', 'public, max-age=0, must-revalidate');
  headers.set('netlify-cdn-cache-control', 'public, max-age=120, must-revalidate');
  headers.set('x-kw-week', `${info.iso}`);
  return new Response(text, {
    status: response.status,
    statusText: response.statusText,
    headers,
  });
};
