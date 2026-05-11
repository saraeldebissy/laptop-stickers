export interface MobbinScreen {
  id: string;
  appName: string;
  screenPattern: string;
  imageUrl: string;
  thumbnailUrl: string;
}

export interface SearchFilters {
  platform: 'ios' | 'android' | 'web';
  screenPattern: string;
  industry: string;
  sortBy: 'trending' | 'popular' | 'publishedAt';
}

// Messages sent from UI iframe → sandbox
export type UIMessage =
  | { type: 'GET_TOKEN' }
  | { type: 'SET_TOKEN'; token: string }
  | { type: 'PASTE_SCREENS'; screens: Array<{ url: string; name: string }> }
  | { type: 'CLOSE_PLUGIN' };

// Messages sent from sandbox → UI iframe
export type SandboxMessage =
  | { type: 'TOKEN_VALUE'; token: string | null }
  | { type: 'PASTE_COMPLETE'; count: number }
  | { type: 'PASTE_ERROR'; message: string };
