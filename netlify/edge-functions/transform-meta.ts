import type { Context } from "https://edge.netlify.com";

export default async (request: Request, context: Context) => {
  const response = await context.next();
  const contentType = response.headers.get("content-type");

  // Only transform HTML files
  if (!contentType || !contentType.includes("text/html")) {
    return response;
  }

  let text = await response.text();

  // Get current date
  const now = new Date();

  // Calculate ISO week and year
  const target = new Date(now.valueOf());
  const dayNr = (now.getDay() + 6) % 7; // Monday = 0, Sunday = 6

  // Start of week (Monday)
  const monday = new Date(now.valueOf());
  monday.setDate(monday.getDate() - dayNr);

  // End of week (Sunday)
  const sunday = new Date(monday.valueOf());
  sunday.setDate(sunday.getDate() + 6);

  // ISO Week Number calculation
  target.setDate(target.getDate() - dayNr + 3); // Thursday
  const jan4 = new Date(target.getFullYear(), 0, 4);
  const dayOfJan4 = (jan4.getDay() + 6) % 7; // Monday = 0
  const firstMonday = new Date(jan4.valueOf());
  firstMonday.setDate(jan4.getDate() - dayOfJan4);

  const weekNum = Math.floor((target.getTime() - firstMonday.getTime()) / 604800000) + 1;

  // Format dates: DD.MM.YYYY
  const formatDate = (d: Date) => {
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    return `${day}.${month}.${year}`;
  };

  const kw = String(weekNum);
  const startDate = formatDate(monday);
  const endDate = formatDate(sunday);

  // Replace placeholders
  text = text.replaceAll("{{KW}}", kw);
  text = text.replaceAll("{{START_DATE}}", startDate);
  text = text.replaceAll("{{END_DATE}}", endDate);

  return new Response(text, response);
};
