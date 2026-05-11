import type { UIMessage, SandboxMessage, MobbinScreen, SearchFilters } from './types';
import { searchScreens, fetchCategories } from './api/mobbin-client';

// ── State ──────────────────────────────────────────────────────────────────
let token: string | null = null;
let selectedIds = new Set<string>();
let currentScreens: MobbinScreen[] = [];
let currentPage = 0;
let hasMore = false;

// ── DOM refs ───────────────────────────────────────────────────────────────
const authScreen     = document.getElementById('auth-screen')!;
const searchScreen   = document.getElementById('search-screen')!;
const tokenInput     = document.getElementById('token-input') as HTMLTextAreaElement;
const saveTokenBtn   = document.getElementById('save-token-btn') as HTMLButtonElement;
const patternInput   = document.getElementById('pattern-input') as HTMLInputElement;
const platformSel    = document.getElementById('platform-select') as HTMLSelectElement;
const industrySel    = document.getElementById('industry-select') as HTMLSelectElement;
const sortSel        = document.getElementById('sort-select') as HTMLSelectElement;
const searchBtn      = document.getElementById('search-btn') as HTMLButtonElement;
const resultsGrid    = document.getElementById('results-grid')!;
const emptyState     = document.getElementById('empty-state')!;
const loadMoreWrap   = document.getElementById('load-more-wrap')!;
const loadMoreBtn    = document.getElementById('load-more-btn') as HTMLButtonElement;
const pasteBtn       = document.getElementById('paste-btn') as HTMLButtonElement;
const errorBanner    = document.getElementById('error-banner')!;
const changeTokenBtn = document.getElementById('change-token-btn') as HTMLButtonElement;
const loadingOverlay = document.getElementById('loading-overlay')!;

// ── Messaging ──────────────────────────────────────────────────────────────
function post(msg: UIMessage) {
  parent.postMessage({ pluginMessage: msg }, '*');
}

// ── View switching ─────────────────────────────────────────────────────────
function showAuth() {
  authScreen.style.display = 'flex';
  searchScreen.style.display = 'none';
}

function showSearch() {
  authScreen.style.display = 'none';
  searchScreen.style.display = 'flex';
}

// ── Error banner ───────────────────────────────────────────────────────────
function showError(msg: string) {
  errorBanner.textContent = msg;
  errorBanner.style.display = 'block';
  setTimeout(() => { errorBanner.style.display = 'none'; }, 4000);
}

// ── Paste button label ─────────────────────────────────────────────────────
function updatePasteBtn() {
  const n = selectedIds.size;
  pasteBtn.textContent = `Paste ${n} screen${n !== 1 ? 's' : ''}`;
  pasteBtn.disabled = n === 0;
}

// ── Render a single result card ────────────────────────────────────────────
function renderCard(screen: MobbinScreen): HTMLElement {
  const card = document.createElement('div');
  card.className = 'screen-card';
  card.dataset.id = screen.id;
  if (selectedIds.has(screen.id)) card.classList.add('selected');

  const img = document.createElement('img');
  img.src = screen.thumbnailUrl;
  img.alt = screen.appName;
  img.loading = 'lazy';

  const label = document.createElement('div');
  label.className = 'screen-label';
  label.title = `${screen.appName} · ${screen.screenPattern}`;
  label.textContent = `${screen.appName} · ${screen.screenPattern}`;

  card.appendChild(img);
  card.appendChild(label);

  card.addEventListener('click', () => {
    if (selectedIds.has(screen.id)) {
      selectedIds.delete(screen.id);
      card.classList.remove('selected');
    } else {
      selectedIds.add(screen.id);
      card.classList.add('selected');
    }
    updatePasteBtn();
  });

  return card;
}

// ── Search ─────────────────────────────────────────────────────────────────
async function runSearch(append = false) {
  searchBtn.disabled = true;
  searchBtn.textContent = 'Searching…';

  if (!append) {
    currentScreens = [];
    selectedIds.clear();
    currentPage = 0;
    resultsGrid.innerHTML = '';
    emptyState.style.display = 'none';
    loadMoreWrap.style.display = 'none';
    updatePasteBtn();
  }

  const filters: SearchFilters = {
    platform: platformSel.value as SearchFilters['platform'],
    screenPattern: patternInput.value.trim(),
    industry: industrySel.value,
    sortBy: sortSel.value as SearchFilters['sortBy'],
  };

  try {
    const results = await searchScreens(token!, filters, currentPage);
    currentScreens = append ? [...currentScreens, ...results] : results;
    hasMore = results.length === 24;

    if (currentScreens.length === 0) {
      emptyState.style.display = 'block';
    } else {
      for (const screen of results) {
        resultsGrid.appendChild(renderCard(screen));
      }
    }

    loadMoreWrap.style.display = hasMore ? 'block' : 'none';
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Unknown';
    if (msg === 'AUTH_EXPIRED') {
      showError('Token expired. Update your token using the "Change token" link below.');
    } else {
      showError("Couldn't reach Mobbin. Check your connection.");
    }
  }

  searchBtn.disabled = false;
  searchBtn.textContent = 'Search';
}

// ── Taxonomy ───────────────────────────────────────────────────────────────
async function loadCategories() {
  const categories = await fetchCategories(token!);
  while (industrySel.options.length > 1) industrySel.remove(1);
  for (const cat of categories) {
    const opt = document.createElement('option');
    opt.value = cat;
    opt.textContent = cat;
    industrySel.appendChild(opt);
  }
}

// ── Event listeners ────────────────────────────────────────────────────────
saveTokenBtn.addEventListener('click', () => {
  const t = tokenInput.value.trim();
  if (!t) return;
  token = t;
  post({ type: 'SET_TOKEN', token: t });
  showSearch();
  loadCategories();
});

patternInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') runSearch();
});

searchBtn.addEventListener('click', () => runSearch());

loadMoreBtn.addEventListener('click', () => {
  currentPage++;
  runSearch(true);
});

changeTokenBtn.addEventListener('click', () => {
  tokenInput.value = token ?? '';
  showAuth();
});

pasteBtn.addEventListener('click', () => {
  const screens = currentScreens
    .filter(s => selectedIds.has(s.id))
    .map(s => ({ url: s.imageUrl, name: `${s.appName} — ${s.screenPattern}` }));

  loadingOverlay.style.display = 'flex';
  post({ type: 'PASTE_SCREENS', screens });
});

// ── Sandbox → UI messages ──────────────────────────────────────────────────
window.onmessage = (event: MessageEvent) => {
  const msg = event.data?.pluginMessage as SandboxMessage | undefined;
  if (!msg) return;

  switch (msg.type) {
    case 'TOKEN_VALUE':
      token = msg.token;
      if (token) { showSearch(); loadCategories(); }
      else { showAuth(); }
      break;

    case 'PASTE_COMPLETE':
      loadingOverlay.style.display = 'none';
      selectedIds.clear();
      updatePasteBtn();
      break;

    case 'PASTE_ERROR':
      loadingOverlay.style.display = 'none';
      showError(msg.message);
      break;
  }
};

// ── Init: ask sandbox for stored token ─────────────────────────────────────
post({ type: 'GET_TOKEN' });
