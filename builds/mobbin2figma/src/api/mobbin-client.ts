import type { MobbinScreen, SearchFilters } from '../types';

// Replace with your deployed proxy URL after running: cd proxy && npx vercel --prod
export const PROXY_URL = 'https://YOUR_PROXY_URL.vercel.app';

export const FALLBACK_CATEGORIES = [
  'Ecommerce', 'Finance', 'Health & Fitness', 'Social', 'Productivity',
  'Travel', 'Food & Drink', 'Entertainment', 'Education', 'Lifestyle',
];

export async function searchScreens(
  token: string,
  filters: SearchFilters,
  pageIndex = 0
): Promise<MobbinScreen[]> {
  const res = await fetch(`${PROXY_URL}/api/search`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ token, filters, pageIndex }),
  });

  if (res.status === 401) throw new Error('AUTH_EXPIRED');
  if (!res.ok) throw new Error(`API_ERROR:${res.status}`);

  const data = await res.json();
  return (data.screens ?? []).map((s: Record<string, unknown>) => ({
    id: s.id as string,
    appName: s.appName as string,
    screenPattern: (s.screenPatterns as string[])?.[0] ?? '',
    imageUrl: s.screenUrl as string,
    thumbnailUrl: (s.screenCdnImgSources as { src: string } | null)?.src ?? (s.screenUrl as string),
  }));
}

export async function fetchCategories(token: string): Promise<string[]> {
  try {
    const res = await fetch(`${PROXY_URL}/api/taxonomy`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token }),
    });
    if (!res.ok) return FALLBACK_CATEGORIES;
    const data = await res.json();
    return (data.categories as string[]) ?? FALLBACK_CATEGORIES;
  } catch {
    return FALLBACK_CATEGORIES;
  }
}
