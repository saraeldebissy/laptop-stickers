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

  const mobbinRes = await fetch(`${MOBBIN_BASE}/api/content/search-screens`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
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
  if (!mobbinRes.ok) { res.status(mobbinRes.status).json({ error: 'Mobbin API error' }); return; }

  const data = await mobbinRes.json();

  // Mobbin returns 200 with error body on auth failure
  if (data?.error?.message === 'unauthenticated' || data?.error?.message === 'Unauthorized') {
    res.status(401).json({ error: 'Token expired' }); return;
  }

  res.status(200).json(data);
}
