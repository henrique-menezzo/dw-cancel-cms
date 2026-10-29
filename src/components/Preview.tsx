import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { faArrowLeft, faDesktop, faMobileScreen, faUpRightAndDownLeftFromCenter } from '@fortawesome/free-solid-svg-icons';
import { Fa } from './Icon';
import { Segmented } from './Fields';
import { MEMBER, planName } from '../data';
import { MemberCancel } from '../member/MemberCancel';
import { params, usePage, usePlanOffers, useStore } from '../store';

const W = 1280;
const H = 1000;

// Small, always-on preview in the left column. It follows whatever the editor has open.
export function MiniPreview() {
  const page = usePage();
  const offers = usePlanOffers();
  const plan = useStore((s) => s.plan);
  const openModule = useStore((s) => s.openModule);
  const previewOffer = useStore((s) => s.previewOffer);
  const setPreviewOffer = useStore((s) => s.setPreviewOffer);
  const setFull = useStore((s) => s.setFullPreview);
  const box = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(0.4);

  useLayoutEffect(() => {
    const el = box.current!;
    const ro = new ResizeObserver(() => setScale(el.clientWidth / W));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const offer = offers.find((o) => o.id === previewOffer) ?? null;
  const firstOffer = offers.find((o) => o.status === 'live') ?? offers[0];

  return (
    <div className="c-panel c-preview">
      <div className="c-preview-head">
        <h3>Preview</h3>
        <Segmented
          value={offer ? 'offer' : 'page'}
          onChange={(v) => setPreviewOffer(v === 'page' ? null : (offer ?? firstOffer)?.id ?? null)}
          options={[
            { value: 'page', label: 'Page' },
            { value: 'offer', label: 'Offer' },
          ]}
        />
        <button type="button" className="c-chev-btn is-round" aria-label="Open full preview" onClick={() => setFull(true)}>
          <Fa icon={faUpRightAndDownLeftFromCenter} size={16} />
        </button>
      </div>
      <div
        className="c-preview-frame"
        ref={box}
        style={{ height: H * scale }}
        role="button"
        tabIndex={0}
        aria-label="Open full preview"
        onClick={() => setFull(true)}
        onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && setFull(true)}
      >
        <div className="c-preview-stage" style={{ width: W, height: H, transform: `scale(${scale})` }}>
          <MemberCancel page={page} offers={offers} interactive={false} forcedOffer={offer} focusModule={openModule} />
        </div>
      </div>
      <p className="c-preview-cap">
        As {MEMBER.firstName}, {planName(plan)} member since {MEMBER.since}
        {offer ? ` · ${offer.name}` : ''}
      </p>
    </div>
  );
}

export function FullPreview() {
  const page = usePage();
  const offers = usePlanOffers();
  const plan = useStore((s) => s.plan);
  const setFull = useStore((s) => s.setFullPreview);
  const [device, setDevice] = useState<'desktop' | 'mobile'>(params.get('device') === 'mobile' ? 'mobile' : 'desktop');
  // remount the member page so a fresh visit replays the landing offer
  const [visit, setVisit] = useState(0);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setFull(false);
    window.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, []);

  return (
    <div className="c-full">
      <div className="c-full-bar">
        <button type="button" className="c-full-back" onClick={() => setFull(false)}>
          <Fa icon={faArrowLeft} size={18} /> Back to editor
        </button>
        <p className="c-full-title">
          <b>Preview</b> · {planName(plan)} · as {MEMBER.firstName}
          <span>Pick a reason to see its save offer. Nothing here is published.</span>
        </p>
        <div className="c-full-tools">
          <button type="button" className="c-btn is-light" onClick={() => setVisit(visit + 1)}>
            Restart visit
          </button>
          <div className="c-seg is-icons">
            <button type="button" className={'c-seg-btn' + (device === 'desktop' ? ' is-on' : '')} onClick={() => setDevice('desktop')} aria-label="Desktop">
              <Fa icon={faDesktop} size={18} />
            </button>
            <button type="button" className={'c-seg-btn' + (device === 'mobile' ? ' is-on' : '')} onClick={() => setDevice('mobile')} aria-label="Mobile">
              <Fa icon={faMobileScreen} size={18} />
            </button>
          </div>
        </div>
      </div>
      <div className={'c-full-stage is-' + device}>
        <div className="c-full-frame">
          <MemberCancel key={visit + device} page={page} offers={offers} />
        </div>
      </div>
    </div>
  );
}
