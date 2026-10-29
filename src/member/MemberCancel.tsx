import { useEffect, useMemo, useRef, useState } from 'react';
import { Logo } from '../components/Icon';
import { IMAGES, MEMBER, TITLES, fill, type Module, type Offer, type PageCfg, type Reason, type Visual } from '../data';
import { params, pickOffer } from '../store';

const Check = ({ color }: { color: string }) => (
  <svg width="32" height="32" viewBox="0 0 32 32" fill="none" aria-hidden>
    <path d="M22.0756 10L24 11.5705L13.4433 22L8 17.1411L9.84193 15.4969L13.2783 18.5644L22.0756 10Z" fill={color} />
  </svg>
);

const Arrow = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden>
    <path d="M5.333 12H19.333M5.333 12L9.333 14.4M5.333 12L9.333 9.6" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

function VisualBlock({ v }: { v: Visual }) {
  if (v.kind === 'image') return v.image ? <img className="mp-intro-img" src={v.image} alt="" /> : <div className="mp-intro-img is-empty" />;
  return (
    <div className="mp-stay">
      {v.title && <h2>{v.title}</h2>}
      <ul>
        {v.items.map((it) => (
          <li key={it.id}>
            <span className="mp-stay-check">
              <Check color="#D81C24" />
            </span>
            {it.text}
          </li>
        ))}
      </ul>
    </div>
  );
}

// "Never mind, I want to keep fueling the fight." — the live page hides "I want to" on phones
function KeepLabel({ label }: { label: string }) {
  const m = label.match(/^(.*?,\s*)(I want to\s+)(.*)$/i);
  if (!m) return <>{label}</>;
  return (
    <>
      {m[1]}
      <span className="mp-md">{m[2]}</span>
      {m[3]}
    </>
  );
}

export function OfferBanner({ offer }: { offer: Offer }) {
  if (offer.visual === 'image') return <img className="mp-offer-img" src={offer.image || IMAGES.aa50} alt="" />;
  const wall = Object.values(TITLES);
  return (
    <div className="mp-banner">
      <div className="mp-banner-wall" aria-hidden>
        {[...wall, ...wall].slice(0, 14).map((src, i) => (
          <img key={i} src={src} alt="" />
        ))}
      </div>
      <span className="mp-banner-mark">
        DW<b>+</b>
      </span>
      <div className="mp-banner-copy">
        {offer.eyebrow && <span className="mp-banner-eyebrow">{offer.eyebrow}</span>}
        {offer.bannerLines.map((l, i) => (
          <span key={i} className={'mp-banner-line' + (i === 1 ? ' is-big' : '')}>
            {l}
          </span>
        ))}
      </div>
      <span className="mp-banner-terms">*Terms &amp; conditions apply</span>
    </div>
  );
}

export function SaveOfferModal({
  offer,
  onClose,
  animate = true,
}: {
  offer: Offer;
  onClose?: () => void;
  animate?: boolean;
}) {
  const [accepted, setAccepted] = useState(false);
  return (
    <div className={'mp-overlay' + (animate ? ' is-anim' : '')} onClick={onClose}>
      <div className="mp-modal" onClick={(e) => e.stopPropagation()}>
        <div className="mp-modal-scroll">
          <div className="mp-modal-in">
            {offer.tenure && !accepted && <p className="mp-tenure">Member since {MEMBER.since}</p>}
            <button className="mp-close" aria-label="Close" onClick={onClose}>
              <svg width="13" height="13" viewBox="0 0 13 13" aria-hidden>
                <path
                  d="M0.70775 12.6155L0 11.9078L5.6 6.30775L0 0.70775L0.70775 0L6.30775 5.6L11.9078 0L12.6155 0.70775L7.0155 6.30775L12.6155 11.9078L11.9078 12.6155L6.30775 7.0155L0.70775 12.6155Z"
                  fill="white"
                />
              </svg>
            </button>
            {accepted ? (
              <>
                <h2 className="mp-modal-h">You’re staying, {MEMBER.firstName}.</h2>
                <div className="mp-offer-card">
                  <div className="mp-offer-body">
                    <p className="mp-offer-text">
                      {offer.kind === 'upgrade'
                        ? `You’re now on ${offer.planLabel}. ${offer.now.replace(/^\$/, 'Your price is $')}.`
                        : `${offer.savingsLabel.replace(/^save/i, 'Your')} discount is applied to your renewal on ${MEMBER.renewal}. Nothing else changes.`}
                    </p>
                    <button className="mp-offer-cta" onClick={onClose}>
                      Back to my account
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <>
                <h2 className="mp-modal-h">{fill(offer.headline)}</h2>
                <div className="mp-offer-card">
                  <OfferBanner offer={offer} />
                  <div className="mp-offer-body">
                    <p className="mp-offer-text">{offer.body}</p>
                    {offer.content && (
                      <div className="mp-unwatched">
                        <span>Still in your library</span>
                        <div>
                          {['the-pendragon-cycle', 'bonhoeffer', 'the-gospels', 'mr-birchum'].map((t) => (
                            <img key={t} src={TITLES[t]} alt="" />
                          ))}
                        </div>
                      </div>
                    )}
                    <div>
                      <div className="mp-plan">
                        <p className="mp-plan-name">{offer.planLabel}</p>
                        <p className="mp-plan-save">{offer.savingsLabel}</p>
                      </div>
                      <div className="mp-price">
                        <p className="mp-price-was">{offer.was}</p>
                        <p className="mp-price-now">{offer.now}</p>
                      </div>
                      <p className="mp-terms">{fill(offer.terms)}</p>
                      <button className="mp-offer-cta" onClick={() => setAccepted(true)}>
                        {offer.cta}
                      </button>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function Mod({ m, page, reasons, reason, setReason }: { m: Module; page: PageCfg; reasons: Reason[]; reason: string | null; setReason: (id: string) => void }) {
  switch (m.type) {
    case 'headline':
      return <h2 className="mp-headline">{fill(page.headline)}</h2>;
    case 'intro':
      return (
        <div className="mp-intro">
          <VisualBlock v={page.left} />
          <VisualBlock v={page.right} />
        </div>
      );
    case 'keep':
      return (
        <a className="mp-btn is-red mp-keep">
          <span className="mp-keep-in">
            <span className="mp-md-flex">
              <Arrow />
            </span>
            <span>
              <KeepLabel label={page.keep.label} />
            </span>
          </span>
        </a>
      );
    case 'carousel':
      return (
        <div className="mp-carousel">
          <h2>{m.title}</h2>
          <div className="mp-carousel-row">
            {(m.titles ?? []).map((t) => (
              <img key={t} src={TITLES[t]} alt="" />
            ))}
          </div>
        </div>
      );
    case 'text':
      return (
        <div className="mp-text">
          <h2>{m.title}</h2>
          <p>{m.body}</p>
        </div>
      );
    case 'reasons':
      return (
        <form className="mp-form" onSubmit={(e) => e.preventDefault()}>
          <div>
            <h3>{page.prompt}</h3>
            <h3 className="mp-required">REQUIRED</h3>
          </div>
          <ul>
            {reasons.map((r) => (
              <li key={r.id}>
                <label className="mp-reason">
                  <input type="radio" name="reason" checked={reason === r.id} onChange={() => setReason(r.id)} />
                  <span className="mp-box">
                    <Check color="#FFF" />
                  </span>
                  <span>{r.label}</span>
                </label>
              </li>
            ))}
          </ul>
        </form>
      );
    case 'confirm':
      return (
        <div className="mp-confirm">
          <p className="mp-warning">{page.warning}</p>
          <div className="mp-confirm-btns">
            <a className="mp-btn is-ghost">{page.secondary}</a>
            <button className={'mp-btn ' + (reason ? 'is-red' : 'is-off')} disabled={!reason}>
              {page.confirm}
            </button>
          </div>
        </div>
      );
  }
}

export function MemberCancel({
  page,
  offers,
  interactive = true,
  forcedOffer,
  focusModule,
}: {
  page: PageCfg;
  offers: Offer[];
  interactive?: boolean;
  forcedOffer?: Offer | null;
  focusModule?: string | null;
}) {
  const [reason, setReason] = useState<string | null>(null);
  const [shown, setShown] = useState<Offer | null>(null);
  const scroller = useRef<HTMLDivElement>(null);

  // members get the reasons in random order, with "Other" kept last; the CMS preview shows the editor's order
  const seed = useMemo(() => Math.random(), [page.reasons.length]);
  const reasons = useMemo(() => {
    if (!interactive || !page.shuffle) return page.reasons;
    const other = page.reasons.filter((r) => r.id === 'rsn_other');
    const rest = page.reasons.filter((r) => r.id !== 'rsn_other');
    const key = (id: string) => Math.sin(seed * 9999 + id.length * 7 + id.charCodeAt(4) * 13);
    return [...rest.sort((a, b) => key(a.id) - key(b.id)), ...other];
  }, [page.reasons, page.shuffle, interactive, seed]);

  // an offer set to "member lands on the page" opens right away
  useEffect(() => {
    if (!interactive) return;
    const start = params.get('reason');
    if (start) return choose(start);
    const land = pickOffer(offers, page, 'land');
    if (land) setShown(land);
  }, [interactive]);

  useEffect(() => {
    const box = scroller.current;
    if (!box) return;
    const el = focusModule ? box.querySelector<HTMLElement>(`[data-mod="${focusModule}"]`) : null;
    const top = el ? Math.max(0, el.offsetTop - 120) : 0;
    box.scrollTo({ top, behavior: 'smooth' });
  }, [focusModule]);

  const choose = (id: string) => {
    setReason(id);
    if (!interactive) return;
    const o = pickOffer(offers, page, id);
    if (o) setShown(o);
  };

  const modal = interactive ? shown : forcedOffer;

  return (
    <div className="mp">
      <div className="mp-scroll" ref={scroller}>
        <nav className="mp-nav">
          <Logo className="mp-logo" />
        </nav>
        <section className="mp-section">
          <div className="mp-wrap">
            {page.modules
              .filter((m) => m.visible)
              .map((m) => (
                <div key={m.id} className={'mp-mod is-' + m.type} data-mod={m.id}>
                  <Mod m={m} page={page} reasons={reasons} reason={reason} setReason={choose} />
                </div>
              ))}
          </div>
        </section>
      </div>
      {modal && <SaveOfferModal key={modal.id} offer={modal} animate={interactive && !params.has('still')} onClose={() => setShown(null)} />}
    </div>
  );
}
