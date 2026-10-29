import { faChevronDown } from '@fortawesome/free-solid-svg-icons';
import { Fa } from './Icon';
import { Btn, Field, Row, Segmented, Select, Switch, TextArea, TextInput, TokenInput } from './Fields';
import { COHORTS, COUPONS, MEMBER, PLANS, planName, type Offer } from '../data';
import { OfferBanner } from '../member/MemberCancel';
import { usePage, useStore } from '../store';

export function StatusLine({ status, published, scheduled }: { status: Offer['status']; published?: Offer['published']; scheduled?: string }) {
  if (status === 'live')
    return (
      <p className="c-status">
        <span className="c-live">Live</span>
        <span className="c-live-dot">•</span>
        Published on {published?.on} By {published?.by}
      </p>
    );
  if (status === 'scheduled')
    return (
      <p className="c-status">
        <span className="c-sched">Scheduled</span>
        <span className="c-dot">•</span>
        Goes live {scheduled}
      </p>
    );
  return (
    <p className="c-status">
      <span className="c-draft">Draft</span>
    </p>
  );
}

export function CardFoot({ status, modified }: { status: Offer['status']; modified: Offer['modified'] }) {
  return (
    <div className="c-foot">
      <p>
        Last modified {modified.on} by {modified.by}
      </p>
      <div className="c-foot-btns">
        {status === 'live' && <Btn kind="plain">Unpublish</Btn>}
        {status === 'draft' && <Btn kind="plain">Delete</Btn>}
        {status === 'scheduled' ? <Btn kind="light">Unschedule</Btn> : <Btn kind="light">Schedule</Btn>}
        <Btn>{status === 'live' ? 'Publish changes' : 'Publish now'}</Btn>
      </div>
    </div>
  );
}

export function OfferCard({ offer, open, onToggle }: { offer: Offer; open: boolean; onToggle: () => void }) {
  const page = usePage();
  const edit = useStore((s) => s.editOffer);
  const set = (patch: Partial<Offer>) => edit(offer.id, patch);
  const reason = page.reasons.find((r) => r.id === offer.reasonId);
  const when =
    offer.trigger === 'land'
      ? 'Shows when a member lands on the cancellation page'
      : `Shows when a member picks “${reason?.label ?? 'a reason'}”`;

  return (
    <article className={'c-card c-offer' + (open ? ' is-open' : '')}>
      <header className="c-card-head">
        <div className="c-card-name">
          <input className="c-title-input" value={offer.name} onChange={(e) => set({ name: e.target.value })} aria-label="Campaign name" />
          <p className="c-card-sub">{when}</p>
        </div>
        <StatusLine status={offer.status} published={offer.published} scheduled={offer.scheduled} />
        <button type="button" className="c-chev-btn is-round" aria-label={open ? 'Collapse' : 'Expand'} onClick={onToggle}>
          <Fa icon={faChevronDown} size={18} />
        </button>
      </header>
      {open && (
        <>
          <div className="c-offer-body">
            <div className="c-offer-art">
              <div className="c-art-box">
                <OfferBanner offer={offer} />
              </div>
              {offer.visual === 'image' && <Btn>Replace image</Btn>}
            </div>
            <div className="c-offer-fields">
              <Row>
                <Field label="Show when">
                  <Select
                    value={offer.trigger}
                    onChange={(v) => set({ trigger: v as Offer['trigger'], reasonId: v === 'land' ? '' : offer.reasonId || page.reasons[0].id })}
                    options={[
                      { value: 'reason', label: 'A member picks a reason' },
                      { value: 'land', label: 'A member lands on the page' },
                    ]}
                  />
                </Field>
                <Field label="Reason">
                  <Select
                    value={offer.trigger === 'land' ? '' : offer.reasonId}
                    disabled={offer.trigger === 'land'}
                    onChange={(reasonId) => set({ reasonId })}
                    options={
                      offer.trigger === 'land'
                        ? [{ value: '', label: 'Any, before a reason' }]
                        : page.reasons.map((r) => ({ value: r.id, label: r.label }))
                    }
                  />
                </Field>
              </Row>
              <Row>
                <Field label="Offer type">
                  <Select
                    value={offer.kind}
                    onChange={(v) => set({ kind: v as Offer['kind'], target: v === 'renewal' ? offer.plan : 'all-access' })}
                    options={[
                      { value: 'renewal', label: 'Renewal discount' },
                      { value: 'upgrade', label: 'Upgrade' },
                    ]}
                  />
                </Field>
                <Field label={offer.kind === 'upgrade' ? 'Upgrade to' : 'Renews as'}>
                  <Select
                    value={offer.target}
                    disabled={offer.kind === 'renewal'}
                    onChange={(target) => set({ target })}
                    options={(offer.kind === 'renewal' ? [{ id: offer.plan, name: planName(offer.plan) }] : PLANS.filter((p) => p.id !== offer.plan)).map((p) => ({
                      value: p.id,
                      label: p.name,
                    }))}
                  />
                </Field>
              </Row>
              <Field label="Recurly coupon">
                <Select value={offer.coupon} onChange={(coupon) => set({ coupon })} options={COUPONS.map((c) => ({ value: c.code, label: c.label }))} />
              </Field>
              <Field label="Headline">
                <TokenInput value={offer.headline} onChange={(headline) => set({ headline })} />
              </Field>
              <div className="c-field">
                <span className="c-visual-head">
                  <span className="c-label">Banner</span>
                  <Segmented
                    value={offer.visual}
                    onChange={(visual) => set({ visual })}
                    options={[
                      { value: 'image', label: 'Image' },
                      { value: 'text', label: 'Text' },
                    ]}
                  />
                </span>
                {offer.visual === 'text' && (
                  <div className="c-banner-fields">
                    <Field label="Eyebrow">
                      <TextInput value={offer.eyebrow} onChange={(eyebrow) => set({ eyebrow })} />
                    </Field>
                    <div className="c-row is-3">
                      {offer.bannerLines.map((l, i) => (
                        <Field key={i} label={i === 1 ? 'Line 2 · large' : `Line ${i + 1}`}>
                          <TextInput value={l} onChange={(v) => set({ bannerLines: offer.bannerLines.map((x, j) => (j === i ? v : x)) })} />
                        </Field>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              <Field label="Body">
                <TextArea value={offer.body} onChange={(body) => set({ body })} />
              </Field>
              <Row>
                <Field label="Plan label">
                  <TextInput value={offer.planLabel} onChange={(planLabel) => set({ planLabel })} />
                </Field>
                <Field label="Savings label">
                  <TextInput value={offer.savingsLabel} onChange={(savingsLabel) => set({ savingsLabel })} />
                </Field>
              </Row>
              <div className="c-field">
                <span className="c-label">Price</span>
                <div className="c-readonly">
                  <span className="c-readonly-price">
                    <s>{offer.was}</s>
                    <b>{offer.now}</b>
                  </span>
                  <span className="c-readonly-terms">{offer.terms.replace('{renewal_date}', MEMBER.renewal)}</span>
                </div>
                <span className="c-hint">Calculated on the backend from the coupon. The terms line is fixed.</span>
              </div>
              <Field label="Button text">
                <TextInput value={offer.cta} onChange={(cta) => set({ cta })} />
              </Field>
              <div className="c-switches">
                <Switch on={offer.tenure} onChange={(tenure) => set({ tenure })} label="Tenure badge" detail={`“Member since ${MEMBER.since}”`} />
                <Switch on={offer.content} onChange={(content) => set({ content })} label="Unwatched titles" detail="Four titles from the member’s library" />
              </div>
              <Row>
                <Field label="Cohort">
                  <Select value={offer.cohort} onChange={(cohort) => set({ cohort })} options={COHORTS.map((c) => ({ value: c, label: c }))} />
                </Field>
                <Field label="Rank">
                  <TextInput value={String(offer.rank)} onChange={(v) => set({ rank: Number(v.replace(/\D/g, '')) || 1 })} />
                </Field>
              </Row>
            </div>
          </div>
          <CardFoot status={offer.status} modified={offer.modified} />
        </>
      )}
    </article>
  );
}
