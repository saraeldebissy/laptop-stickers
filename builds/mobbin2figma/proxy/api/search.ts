import type { VercelRequest, VercelResponse } from '@vercel/node';

const MOBBIN_BASE = 'https://mobbin.com';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method === 'OPTIONS') { res.status(200).end(); return; }
  if (req.method !== 'POST') { res.status(405).json({ error: 'Method not allowed' }); return; }

  const { token, filters, pageIndex = 0 } = req.body as {
    token: string;
    filters: { platform: string; screenPattern: string; industry: string; sortBy: string };
    pageIndex?: number;
  };

  if (!token) { res.status(400).json({ error: 'Missing token' }); return; }

  // Token may be "part0|part1" if the Supabase session is split across two cookies
  const cookieHeader = token.includes('|')
    ? `sb-ujasntkfphywizsdaapi-auth-token.0=${token.split('|')[0]}; sb-ujasntkfphywizsdaapi-auth-token.1=${token.split('|')[1]}`
    : `sb-ujasntkfphywizsdaapi-auth-token.0=${token}`;

  const mobbinRes = await fetch(`${MOBBIN_BASE}/api/content/search-screens`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Cookie': cookieHeader,
    },
    body: JSON.stringify({
      searchRequestId: '',
      filterOptions: {
        platform: filters.platform || 'ios',
        screenPatterns: filters.screenPattern ? [filters.screenPattern] : null,
        appCategories: filters.industry ? [filters.industry] : null,
        screenElements: null,
        screenKeywords: null,
        hasAnimation: null,
      },
      paginationOptions: {
        pageSize: 24,
        pageIndex,
        sortBy: filters.sortBy || 'trending',
      },
    }),
  });

  if (mobbinRes.status === 401) { res.status(401).json({ error: 'Token expired' }); return; }
  if (!mobbinRes.ok) { res.status(401).json({ error: 'Token expired' }); return; }

  let data: unknown;
  try {
    data = await mobbinRes.json();
  } catch {
    // Mobbin returned non-JSON (e.g. HTML redirect on bad session)
    res.status(401).json({ error: 'Token expired' }); return;
  }

  // Mobbin returns 200 with error body on auth failure
  const d = data as Record<string, unknown>;
  if ((d?.error as Record<string, unknown>)?.message === 'unauthenticated') {
    res.status(401).json({ error: 'Token expired' }); return;
  }

  res.status(200).json(data);
}
