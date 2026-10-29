import { useState, type ReactNode } from 'react';
import { faAngleRight, faArrowLeft, faChevronDown, faCircleInfo, faPlus } from '@fortawesome/free-solid-svg-icons';
import { CancelFlowIcon, Fa } from '../components/Icon';
import { OfferCard, CardFoot, StatusLine } from '../components/OfferCard';
import { PageEditor } from '../components/PageEditor';
import { FullPreview, MiniPreview } from '../components/Preview';
import { PLANS, type Offer } from '../data';
import { params, usePage, usePlanOffers, useStore } from '../store';

function Info({ text }: { text: string }) {
  return (
    <span className="c-info" tabIndex={0}>
      <Fa icon={faCircleInfo} size={18} />
      <span className="c-tip" role="tooltip">
        {text}
      </span>
    </span>
  );
}

function SectionHead({ title, count, info, children }: { title: string; count?: number; info?: string; children?: ReactNode }) {
  return (
    <div className="c-sec-head">
      <h4>
        {title}
        {info && <Info text={info} />}
        {count !== undefined && <span className="c-count">• {count}</span>}
      </h4>
      {children}
    </div>
  );
}

function PlanTabs() {
  const plan = useStore((s) => s.plan);
  const setPlan = useStore((s) => s.setPlan);
  const offers = useStore((s) => s.offers);
  const live = (id: string) => offers.filter((o) => o.plan === id && o.status === 'live').length;
  return (
    <div className="c-tabs">
      {PLANS.map((p) => (
        <button key={p.id} type="button" className={'c-tab' + (plan === p.id ? ' is-on' : '')} onClick={() => setPlan(p.id)}>
          {p.name} • {live(p.id)}
        </button>
      ))}
    </div>
  );
}

function PageCard() {
  const page = usePage();
  const edit = useStore((s) => s.editPage);
  const [open, setOpen] = useState(true);
  return (
    <article className={'c-card' + (open ? ' is-open' : '')}>
      <header className="c-card-head">
        <div className="c-card-name">
          <input className="c-title-input" value={page.name} onChange={(e) => edit({ name: e.target.value })} aria-label="Page name" />
          <p className="c-card-sub">{page.modules.filter((m) => m.visible).length} modules on the page. Drag to reorder.</p>
        </div>
        <StatusLine status={page.status} published={page.published} />
        <button type="button" className="c-chev-btn is-round" aria-label={open ? 'Collapse' : 'Expand'} onClick={() => setOpen(!open)}>
          <Fa icon={faChevronDown} size={18} />
        </button>
      </header>
      {open && (
        <>
          <PageEditor />
          <CardFoot status={page.status} modified={page.modified} />
        </>
      )}
    </article>
  );
}

function Overview() {
  const offers = useStore((s) => s.offers);
  const page = usePage();
  const planOffers = usePlanOffers();
  const live = offers.filter((o) => o.status === 'live').length;
  const covered = page.reasons.filter((r) => r.offer && planOffers.some((o) => o.status === 'live' && o.trigger === 'reason' && o.reasonId === r.id)).length;
  return (
    <div className="c-panel c-overview">
      <h3>Offer Overview</h3>
      <div className="c-stats">
        <div>
          <p className="c-stat-label">Live Offers</p>
          <p className="c-stat-value">
            {live}
            <span className="c-live-dot">•</span>
          </p>
        </div>
        <div>
          <p className="c-stat-label">Total Configured</p>
          <p className="c-stat-value">{offers.length}</p>
        </div>
        <div>
          <p className="c-stat-label">Reasons Covered</p>
          <p className="c-stat-value">
            {covered} of {page.reasons.length}
          </p>
        </div>
        <div>
          <p className="c-stat-label">Cancellation Page</p>
          <p className="c-stat-value">{page.status === 'live' ? 'Live' : 'Draft'}</p>
        </div>
      </div>
    </div>
  );
}

export function Cancellation() {
  const go = useStore((s) => s.go);
  const plan = useStore((s) => s.plan);
  const offers = usePlanOffers();
  const full = useStore((s) => s.fullPreview);
  const previewOffer = useStore((s) => s.previewOffer);
  const setPreviewOffer = useStore((s) => s.setPreviewOffer);
  const [open, setOpen] = useState<Record<string, boolean>>({ [params.get('offer') ?? 'o1']: true });

  const published = offers.filter((o) => o.status === 'live');
  const unpublished = offers.filter((o) => o.status !== 'live');

  const toggle = (o: Offer) => {
    const next = !open[o.id];
    setOpen({ ...open, [o.id]: next });
    // opening an offer puts it in the preview; closing the one on show goes back to the page
    if (next) setPreviewOffer(o.id);
    else if (previewOffer === o.id) setPreviewOffer(null);
  };

  const addOffer = () => {
    const id = 'n' + Date.now().toString(36);
    const base = offers[0] ?? useStore.getState().offers[0];
    useStore.setState((s) => ({
      offers: [
        ...s.offers,
        {
          ...base,
          id,
          plan,
          name: 'untitled_save_offer',
          status: 'draft',
          published: undefined,
          modified: { on: 'Oct 29, 2026', by: 'Henrique Menezzo' },
          reasonId: 'rsn_come_back',
          trigger: 'reason',
        },
      ],
    }));
    setOpen({ ...open, [id]: true });
    setPreviewOffer(id);
  };

  const list = (items: Offer[]) =>
    items.map((o) => <OfferCard key={o.id} offer={o} open={!!open[o.id]} onToggle={() => toggle(o)} />);

  return (
    <div className="c-offers-page">
      <nav className="c-crumbs">
        <button type="button" className="c-crumb-back" onClick={() => go('hub')} aria-label="Back">
          <Fa icon={faArrowLeft} size={20} />
        </button>
        <button type="button" className="c-crumb" onClick={() => go('hub')}>
          Lifecycle Management
        </button>
        <Fa icon={faAngleRight} size={15} className="c-crumb-sep" />
        <span className="c-crumb-here">Cancellation Flow</span>
      </nav>

      <section className="c-page">
        <header className="c-page-head">
          <span className="c-page-ico">
            <CancelFlowIcon size={30} />
          </span>
          <div>
            <h2>Cancellation Flow Management</h2>
            <p>Edit the cancellation page and the save offers members see before they cancel.</p>
          </div>
        </header>

        <div className="c-grid">
          <aside className="c-left">
            <Overview />
            <MiniPreview />
          </aside>

          <div className="c-right">
            <PlanTabs />

            <SectionHead title="Cancellation page" info="One page per plan. Members on this plan see it when they start to cancel." />
            <PageCard />

            <SectionHead
              title="Published offers"
              count={published.length}
              info="When a reason has more than one live offer, members see the one with the lowest rank."
            >
              <button type="button" className="c-btn is-dark" onClick={addOffer}>
                <Fa icon={faPlus} size={14} /> New offer
              </button>
            </SectionHead>
            {published.length ? list(published) : <div className="c-empty">No published offers.</div>}

            <SectionHead title="Unpublished offers" count={unpublished.length} />
            {unpublished.length ? list(unpublished) : <div className="c-empty">No unpublished offers.</div>}
          </div>
        </div>
      </section>
      {full && <FullPreview />}
    </div>
  );
}
