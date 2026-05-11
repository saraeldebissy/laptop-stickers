import type { VercelRequest, VercelResponse } from '@vercel/node';

const MOBBIN_BASE = 'https://mobbin.com';

const FALLBACK_CATEGORIES = [
  'Ecommerce', 'Finance', 'Health & Fitness', 'Social', 'Productivity',
  'Travel', 'Food & Drink', 'Entertainment', 'Education', 'Lifestyle',
];

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method === 'OPTIONS') { res.status(200).end(); return; }

  const { token } = (req.body as { token: string });

  try {
    const mobbinRes = await fetch(`${MOBBIN_BASE}/api/filter-tags/fetch-dictionary-definitions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({}),
    });

    if (!mobbinRes.ok) throw new Error('Failed');

    const data = await mobbinRes.json();
    const categories: string[] = data.definitions
      ?.find((d: { type: string }) => d.type === 'appCategory')
      ?.values?.map((v: { label: string }) => v.label) ?? FALLBACK_CATEGORIES;

    res.status(200).json({ categories });
  } catch {
    res.status(200).json({ categories: FALLBACK_CATEGORIES });
  }
}
