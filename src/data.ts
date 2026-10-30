import collage from './assets/collage.jpg';
import aa50 from './assets/offer-aa50.jpg';

const titleFiles = import.meta.glob('./assets/titles/*.webp', { eager: true, import: 'default' }) as Record<string, string>;
export const TITLES: Record<string, string> = Object.fromEntries(
  Object.entries(titleFiles).map(([path, url]) => [path.split('/').pop()!.replace('.webp', ''), url]),
);

export const IMAGES = { collage, aa50 };

export type PlanId = string;
export type Plan = { id: PlanId; name: string; price: number; period: 'month' | 'year' };

export const PLANS: Plan[] = [
  { id: 'reader', name: 'Reader', price: 4, period: 'month' },
  { id: 'insider-monthly', name: 'Insider Monthly', price: 14, period: 'month' },
  { id: 'insider-annual', name: 'Insider Annual', price: 149, period: 'year' },
  { id: 'insider-plus', name: 'Insider Plus', price: 199, period: 'year' },
  { id: 'all-access', name: 'All Access', price: 249, period: 'year' },
];

export const planName = (id: PlanId) => PLANS.find((p) => p.id === id)?.name ?? id;

export type Stamp = { on: string; by: string };
export type Status = 'live' | 'scheduled' | 'draft';

export type Item = { id: string; text: string };
export type Reason = { id: string; label: string; offer: boolean };
export type Visual = { kind: 'image' | 'text'; image: string; title: string; items: Item[] };

export type ModuleType = 'headline' | 'intro' | 'keep' | 'carousel' | 'text' | 'reasons' | 'confirm';
export type Module = {
  id: string;
  type: ModuleType;
  visible: boolean;
  // only for added modules
  title?: string;
  body?: string;
  titles?: string[];
};

export type PageCfg = {
  name: string;
  status: Status;
  published: Stamp;
  modified: Stamp;
  modules: Module[];
  headline: string;
  left: Visual;
  right: Visual;
  keep: { label: string; destination: string };
  prompt: string;
  reasons: Reason[];
  warning: string;
  secondary: string;
  confirm: string;
};

export type Offer = {
  id: string;
  plan: PlanId;
  name: string;
  status: Status;
  published?: Stamp;
  scheduled?: string;
  modified: Stamp;
  trigger: 'reason' | 'land';
  reasonId: string;
  kind: 'renewal' | 'upgrade';
  coupon: string;
  target: PlanId;
  tenure: boolean;
  headline: string;
  visual: 'image' | 'text';
  image: string;
  eyebrow: string;
  bannerLines: string[];
  body: string;
  planLabel: string;
  savingsLabel: string;
  was: string;
  now: string;
  terms: string;
  cta: string;
  content: boolean;
  cohort: string;
  rank: number;
};

export const MEMBER = { firstName: 'Sam', since: 'Apr 2022', renewal: 'April 25, 2027' };

export const COUPONS = [
  { code: 'aa_renewal_50pct_annual', label: 'aa_renewal_50pct_annual · 50% off · annual · single-use' },
  { code: 'aa_renewal_99_annual', label: 'aa_renewal_99_annual · $99 next year · annual · single-use' },
  { code: 'aa_renewal_30pct_annual', label: 'aa_renewal_30pct_annual · 30% off · annual · single-use' },
  { code: 'insider_renewal_39_annual', label: 'insider_renewal_39_annual · $39 next year · annual · single-use' },
  { code: 'insider_monthly_half_3mo', label: 'insider_monthly_half_3mo · 50% off 3 months · monthly · single-use' },
  { code: 'upgrade_aa_40pct_annual', label: 'upgrade_aa_40pct_annual · 40% off All Access · annual · single-use' },
];

export const COHORTS = ['All members', 'Members over 2 years', 'Members under 6 months', 'Never watched a film'];

const items = (prefix: string, texts: string[]): Item[] => texts.map((text, i) => ({ id: `${prefix}${i}`, text }));

export const REASONS: Reason[] = [
  { id: 'rsn_expenses', label: "I'm cutting back on expenses", offer: true },
  { id: 'rsn_come_back', label: 'I plan to come back', offer: false },
  { id: 'rsn_values', label: "The content doesn't reflect my values", offer: false },
  { id: 'rsn_new_content', label: 'Not enough new content', offer: true },
  { id: 'rsn_specific', label: 'I signed up to watch something specific', offer: true },
  { id: 'rsn_ads', label: 'Too many ads', offer: true },
  { id: 'rsn_price', label: "The price isn't worth it for me right now", offer: true },
  { id: 'rsn_technical', label: 'Technical or user experience issues', offer: false },
  { id: 'rsn_other', label: 'Other', offer: false },
];

export const reasonLabel = (id: string) => REASONS.find((r) => r.id === id)?.label ?? id;

const STAY = [
  'Watch Exclusive Films & Documentaries',
  'Access to Member-Exclusive Shows',
  'Watch Anytime, Anywhere - Access Daily Wire+ on desktop, mobile, and TV apps.',
  'New Content Added Weekly - Always something fresh to watch, read, or listen to.',
  'Invest in a media company that aligns with your values.',
  'Preserve Free Speech & Conservative Voices',
];

const AARON: Stamp = { on: 'Oct 20, 2026', by: 'Aaron Lensch' };
const HENRIQUE: Stamp = { on: 'Oct 28, 2026', by: 'Henrique Menezzo' };

export function makePage(plan: PlanId): PageCfg {
  return {
    name: `${plan.replace(/-/g, '_')}_cancellation_page`,
    status: 'live',
    published: AARON,
    modified: HENRIQUE,
    modules: [
      { id: 'm_headline', type: 'headline', visible: true },
      { id: 'm_intro', type: 'intro', visible: true },
      { id: 'm_keep', type: 'keep', visible: true },
      {
        id: 'm_carousel',
        type: 'carousel',
        visible: false,
        title: 'New this week',
        titles: ['the-pendragon-cycle', 'am-i-racist', 'the-gospels', 'bonhoeffer', 'mr-birchum', 'sons-of-liberty'],
      },
      { id: 'm_reasons', type: 'reasons', visible: true },
      { id: 'm_confirm', type: 'confirm', visible: true },
    ],
    headline: '{first_name}, the future needs builders like you.',
    left: { kind: 'image', image: collage, title: '', items: [] },
    right: { kind: 'text', image: '', title: 'Top reasons to stay!', items: items(`${plan}-stay-`, STAY) },
    keep: { label: 'Never mind, I want to keep fueling the fight.', destination: '/account/membership' },
    prompt: "Tell us why you're canceling your membership. We're always striving to improve your experience with DailyWire+.",
    reasons: REASONS.map((r) => ({ ...r })),
    warning: 'By clicking CONFIRM CANCELLATION below, you will lose access to your membership benefits when your membership expires.',
    secondary: 'Never mind',
    confirm: 'Confirm cancellation',
  };
}

const BODY_AA =
  'For less than half the price, dive into bold conversations with the voices you trust like Ben Shapiro, Matt Walsh, Michael Knowles, and Andrew Klavan.';

const base = (plan: PlanId, id: string): Offer => ({
  id,
  plan,
  name: '',
  status: 'live',
  published: AARON,
  modified: HENRIQUE,
  trigger: 'reason',
  reasonId: 'rsn_price',
  kind: 'renewal',
  coupon: 'aa_renewal_50pct_annual',
  target: plan,
  tenure: true,
  headline: '{first_name}, before you go...',
  visual: 'image',
  image: aa50,
  eyebrow: 'All Access Exclusive',
  bannerLines: ['Stay for', '50% off', 'your next year'],
  body: BODY_AA,
  planLabel: 'All Access',
  savingsLabel: 'Save 50%',
  was: '$249/year',
  now: '$124.50 for the next year',
  terms: 'Applied only to your renewal on {renewal_date}',
  cta: "Count Me In. I'll Keep Fighting for You.",
  content: false,
  cohort: 'All members',
  rank: 1,
});

export const OFFERS: Offer[] = [
  {
    ...base('all-access', 'o1'),
    name: '20261020_aa_price_renewal_50',
    reasonId: 'rsn_price',
  },
  {
    ...base('all-access', 'o2'),
    name: '20261020_aa_ads_renewal_50',
    reasonId: 'rsn_ads',
  },
  {
    ...base('all-access', 'o3'),
    name: '20261022_aa_expenses_renewal_99',
    reasonId: 'rsn_expenses',
    coupon: 'aa_renewal_99_annual',
    visual: 'text',
    eyebrow: 'All Access Exclusive',
    bannerLines: ['Stay for', 'only $99', 'your next year'],
    body: 'Keep every film, series and show for $150 less than you pay today. One year, one price, nothing else changes.',
    savingsLabel: 'Save $150',
    now: '$99 for the next year',
  },
  {
    ...base('all-access', 'o4'),
    name: '20261024_aa_new_content_unwatched',
    reasonId: 'rsn_new_content',
    headline: "{first_name}, you haven't seen these yet",
    visual: 'text',
    eyebrow: 'Already in your library',
    bannerLines: ['More is', 'waiting', 'for you'],
    body: 'New films, series and shows land every week. These are already in your library, and you still have time to watch them.',
    content: true,
  },
  {
    ...base('all-access', 'o5'),
    name: '20261111_aa_landing_30',
    status: 'scheduled',
    published: undefined,
    scheduled: 'Nov 11, 2026 at 9:00 AM ET',
    trigger: 'land',
    reasonId: '',
    coupon: 'aa_renewal_30pct_annual',
    visual: 'text',
    bannerLines: ['Stay for', '30% off', 'your next year'],
    savingsLabel: 'Save 30%',
    now: '$174.30 for the next year',
    rank: 1,
  },
  {
    ...base('all-access', 'o6'),
    name: 'aa_specific_title_draft',
    status: 'draft',
    published: undefined,
    reasonId: 'rsn_specific',
    headline: '{first_name}, there is more where that came from',
    visual: 'text',
    eyebrow: 'Picked for you',
    bannerLines: ['Watch', 'what you', 'came for'],
    body: 'You came for one title. Here are a few more our members finish in a weekend.',
    content: true,
  },
  {
    ...base('insider-annual', 'o7'),
    name: '20261020_insider_price_renewal_39',
    coupon: 'insider_renewal_39_annual',
    visual: 'text',
    eyebrow: 'Insider Exclusive',
    bannerLines: ['Stay for', 'only $39', 'your next year'],
    body: 'Keep the shows, the films and the fight going for a fraction of the price.',
    planLabel: 'Insider Annual',
    savingsLabel: 'Save $110',
    was: '$149/year',
    now: '$39 for the next year',
  },
  {
    ...base('insider-annual', 'o8'),
    name: '20261020_insider_ads_upgrade_aa',
    reasonId: 'rsn_ads',
    kind: 'upgrade',
    coupon: 'upgrade_aa_40pct_annual',
    target: 'all-access',
    visual: 'text',
    eyebrow: 'Go ad-free',
    bannerLines: ['All Access', '40% off', 'no ads'],
    body: 'All Access is ad-free, with every film, series and show we make. Switch now and pay 40% less your first year.',
    planLabel: 'All Access',
    savingsLabel: 'Save 40%',
    was: '$249/year',
    now: '$149.40 for your first year',
    terms: 'Your plan changes today. Billed {renewal_date}.',
    cta: 'Upgrade and Keep Fighting',
  },
  {
    ...base('insider-monthly', 'o9'),
    name: '20261020_monthly_price_half_3mo',
    coupon: 'insider_monthly_half_3mo',
    visual: 'text',
    eyebrow: 'Insider Exclusive',
    bannerLines: ['Half price', 'for three', 'months'],
    body: 'Stay three more months at half the price. Cancel anytime after that.',
    planLabel: 'Insider Monthly',
    savingsLabel: 'Save 50%',
    was: '$14/month',
    now: '$7/month for 3 months',
  },
  {
    ...base('insider-plus', 'o10'),
    name: '20261020_plus_ads_upgrade_aa',
    reasonId: 'rsn_ads',
    kind: 'upgrade',
    coupon: 'upgrade_aa_40pct_annual',
    target: 'all-access',
    visual: 'text',
    eyebrow: 'Go ad-free',
    bannerLines: ['All Access', '40% off', 'no ads'],
    body: 'All Access is ad-free, with every film, series and show we make. Switch now and pay 40% less your first year.',
    planLabel: 'All Access',
    savingsLabel: 'Save 40%',
    was: '$249/year',
    now: '$149.40 for your first year',
    terms: 'Your plan changes today. Billed {renewal_date}.',
    cta: 'Upgrade and Keep Fighting',
  },
];

export const fill = (text: string) =>
  text.replace(/\{first_name\}/g, MEMBER.firstName).replace(/\{renewal_date\}/g, MEMBER.renewal);
