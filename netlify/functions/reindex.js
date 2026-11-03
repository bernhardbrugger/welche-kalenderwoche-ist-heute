const KEY = '8f3a1c9e2b7d4kw0';
const HOST = 'welche-kalenderwoche-ist-heute.at';

export default async () => {
  const page = `https://${HOST}/`;
  const endpoint = `https://api.indexnow.org/indexnow?url=${encodeURIComponent(page)}&key=${KEY}`;
  try {
    const response = await fetch(endpoint);
    console.log('indexnow', response.status);
  } catch (error) {
    console.log('indexnow failed', error);
  }
  return new Response('ok');
};

export const config = {
  schedule: '15 0 * * *',
};
