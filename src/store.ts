import { create } from 'zustand';
import { PLANS, OFFERS, makePage, type Offer, type PageCfg, type PlanId } from './data';

export type Route = 'hub' | 'cancellation';

type State = {
  route: Route;
  plan: PlanId;
  pages: Record<PlanId, PageCfg>;
  offers: Offer[];
  // which module the editor has open; the small preview scrolls to it
  openModule: string | null;
  // offer shown over the page in the small preview (null = page only)
  previewOffer: string | null;
  fullPreview: boolean;
  go: (route: Route) => void;
  setPlan: (plan: PlanId) => void;
  editPage: (patch: Partial<PageCfg>) => void;
  editOffer: (id: string, patch: Partial<Offer>) => void;
  setOpenModule: (id: string | null) => void;
  setPreviewOffer: (id: string | null) => void;
  setFullPreview: (on: boolean) => void;
};

export const params = new URLSearchParams(location.search);
const fromHash = (): Route => (location.hash.includes('cancellation') ? 'cancellation' : 'hub');

export const useStore = create<State>((set) => ({
  route: fromHash(),
  plan: params.get('plan') ?? 'all-access',
  pages: Object.fromEntries(PLANS.map((p) => [p.id, makePage(p.id)])),
  offers: OFFERS,
  openModule: params.get('module'),
  previewOffer: params.get('offer'),
  fullPreview: params.get('full') === '1',
  go: (route) => {
    location.hash = route === 'hub' ? '/lifecycle-management' : '/lifecycle-management/cancellation';
    window.scrollTo(0, 0);
    set({ route });
  },
  setPlan: (plan) => set({ plan, previewOffer: null, openModule: null }),
  editPage: (patch) => set((s) => ({ pages: { ...s.pages, [s.plan]: { ...s.pages[s.plan], ...patch } } })),
  editOffer: (id, patch) => set((s) => ({ offers: s.offers.map((o) => (o.id === id ? { ...o, ...patch } : o)) })),
  setOpenModule: (openModule) => set({ openModule }),
  setPreviewOffer: (previewOffer) => set({ previewOffer }),
  setFullPreview: (fullPreview) => set({ fullPreview }),
}));

window.addEventListener('hashchange', () => useStore.setState({ route: fromHash() }));

export const usePage = () => useStore((s) => s.pages[s.plan]);
export const usePlanOffers = () => {
  const plan = useStore((s) => s.plan);
  const offers = useStore((s) => s.offers);
  return offers.filter((o) => o.plan === plan);
};

// The offer a member would get for a trigger: live, matching, lowest rank wins
export function pickOffer(offers: Offer[], page: PageCfg, trigger: 'land' | string): Offer | null {
  const live = offers.filter((o) => o.status === 'live');
  if (trigger === 'land') return live.filter((o) => o.trigger === 'land').sort((a, b) => a.rank - b.rank)[0] ?? null;
  const reason = page.reasons.find((r) => r.id === trigger);
  if (!reason?.offer) return null;
  return live.filter((o) => o.trigger === 'reason' && o.reasonId === trigger).sort((a, b) => a.rank - b.rank)[0] ?? null;
}
