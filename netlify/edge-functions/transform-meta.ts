import type { Context } from 'https://edge.netlify.com';
import { currentWeek } from './lib/week.ts';

/**
 * Fills the placeholders in the served HTML (title, description, Open Graph) with the current week,
 * so search engines and link previews never see the raw placeholders or a stale week.
 */
export default async (_request: Request, context: Context) => {
  const response = await context.next();
  const contentType = response.headers.get('content-type');

  // Only transform HTML documents
  if (!contentType || !contentType.includes('text/html')) {
    return response;
  }

  const { week, start, end } = currentWeek();
  const text = (await response.text())
    .replaceAll('{{KW}}', String(week))
    .replaceAll('{{START_DATE}}', start)
    .replaceAll('{{END_DATE}}', end);

  // The body length changes with the replacement: the original content-length would be wrong.
  const headers = new Headers(response.headers);
  headers.delete('content-length');
  return new Response(text, { status: response.status, statusText: response.statusText, headers });
};
