import { useState } from 'react';
import { faChevronDown, faEye, faEyeSlash, faLock, faPlus, faXmark } from '@fortawesome/free-solid-svg-icons';
import { Fa } from './Icon';
import { Btn, Field, Row, Segmented, Select, Switch, TextArea, TextInput, TokenInput } from './Fields';
import { Sortable, move } from './Sortable';
import { TITLES, type Item, type Module, type ModuleType, type PageCfg, type Visual } from '../data';
import { pickOffer, usePage, usePlanOffers, useStore } from '../store';

const NAMES: Record<ModuleType, string> = {
  headline: 'Headline',
  intro: 'Intro',
  keep: 'Keep button',
  carousel: 'Carousel',
  text: 'Text',
  reasons: 'Cancellation reasons',
  confirm: 'Confirmation',
};

// the cancel flow can't work without these two
const LOCKED: ModuleType[] = ['reasons', 'confirm'];

let uid = 0;
const newId = (p: string) => `${p}${Date.now().toString(36)}${uid++}`;

function summary(m: Module, page: PageCfg) {
  switch (m.type) {
    case 'headline':
      return page.headline;
    case 'intro': {
      const side = (v: Visual) => (v.kind === 'image' ? 'Image' : `${v.title || 'List'} (${v.items.length})`);
      return `${side(page.left)}  ·  ${side(page.right)}`;
    }
    case 'keep':
      return page.keep.label;
    case 'carousel':
      return `${m.title} · ${m.titles?.length ?? 0} titles`;
    case 'text':
      return m.title ?? '';
    case 'reasons':
      return `${page.reasons.length} reasons · ${page.reasons.filter((r) => r.offer).length} can show a save offer`;
    case 'confirm':
      return `${page.secondary}  ·  ${page.confirm}`;
  }
}

function ItemList({ items, onChange, addLabel }: { items: Item[]; onChange: (items: Item[]) => void; addLabel: string }) {
  return (
    <div className="c-items">
      <Sortable
        items={items}
        gap={8}
        onReorder={(a, b) => onChange(move(items, a, b))}
        render={(it, i, handle) => (
          <div className="c-item">
            {handle}
            <input
              className="c-input"
              value={it.text}
              onChange={(e) => onChange(items.map((x, j) => (j === i ? { ...x, text: e.target.value } : x)))}
            />
            <button type="button" className="c-x" aria-label="Remove" onClick={() => onChange(items.filter((_, j) => j !== i))}>
              <Fa icon={faXmark} size={16} />
            </button>
          </div>
        )}
      />
      <button type="button" className="c-add" onClick={() => onChange([...items, { id: newId('i'), text: 'New item' }])}>
        <Fa icon={faPlus} size={14} /> {addLabel}
      </button>
    </div>
  );
}

function VisualEditor({ label, v, onChange }: { label: string; v: Visual; onChange: (v: Visual) => void }) {
  return (
    <div className="c-visual">
      <div className="c-visual-head">
        <span className="c-label">{label}</span>
        <Segmented
          value={v.kind}
          onChange={(kind) => onChange({ ...v, kind })}
          options={[
            { value: 'image', label: 'Image' },
            { value: 'text', label: 'Text' },
          ]}
        />
      </div>
      {v.kind === 'image' ? (
        <div className="c-visual-img">
          {v.image ? <img src={v.image} alt="" /> : <span className="c-visual-empty">No image yet</span>}
          <Btn>Replace image</Btn>
        </div>
      ) : (
        <>
          <Field label="Title">
            <TextInput value={v.title} onChange={(title) => onChange({ ...v, title })} />
          </Field>
          <ItemList items={v.items} onChange={(items) => onChange({ ...v, items })} addLabel="Add item" />
        </>
      )}
    </div>
  );
}

function ReasonsEditor({ page }: { page: PageCfg }) {
  const edit = useStore((s) => s.editPage);
  const offers = usePlanOffers();
  return (
    <>
      <Field label="Prompt">
        <TextArea value={page.prompt} onChange={(prompt) => edit({ prompt })} rows={2} />
      </Field>
      <div className="c-reason-cols" aria-hidden>
        <span>Reason</span>
        <span>Save offer</span>
      </div>
      <Sortable
        items={page.reasons}
        gap={8}
        onReorder={(a, b) => edit({ reasons: move(page.reasons, a, b) })}
        render={(r, i, handle) => {
          const linked = pickOffer(offers, page, r.id);
          const anyOffer = offers.some((o) => o.trigger === 'reason' && o.reasonId === r.id);
          const status = !r.offer
            ? 'No save offer'
            : linked
              ? `Shows ${linked.name}`
              : anyOffer
                ? 'No live offer yet, so nothing shows'
                : 'No offer for this reason, so nothing shows';
          return (
            <div className="c-reason">
              {handle}
              <div className="c-reason-main">
                <input
                  className="c-input"
                  value={r.label}
                  onChange={(e) => edit({ reasons: page.reasons.map((x, j) => (j === i ? { ...x, label: e.target.value } : x)) })}
                />
                <span className="c-reason-meta">
                  <code>{r.id}</code>
                  <span className={linked && r.offer ? 'is-linked' : ''}>{status}</span>
                </span>
              </div>
              <Switch
                on={r.offer}
                onChange={(offer) => edit({ reasons: page.reasons.map((x, j) => (j === i ? { ...x, offer } : x)) })}
                label={`Save offer for “${r.label}”`}
                hideLabel
              />
              <button
                type="button"
                className="c-x"
                aria-label="Remove reason"
                onClick={() => edit({ reasons: page.reasons.filter((_, j) => j !== i) })}
              >
                <Fa icon={faXmark} size={16} />
              </button>
            </div>
          );
        }}
      />
      <button
        type="button"
        className="c-add"
        onClick={() => edit({ reasons: [...page.reasons, { id: newId('rsn_'), label: 'New reason', offer: false }] })}
      >
        <Fa icon={faPlus} size={14} /> Add reason
      </button>
      <p className="c-note">Each reason keeps its ID when you rename it, so reporting stays consistent.</p>
    </>
  );
}

function ModuleBody({ m, page }: { m: Module; page: PageCfg }) {
  const edit = useStore((s) => s.editPage);
  const editModule = (patch: Partial<Module>) => edit({ modules: page.modules.map((x) => (x.id === m.id ? { ...x, ...patch } : x)) });
  switch (m.type) {
    case 'headline':
      return (
        <Field label="Headline">
          <TokenInput value={page.headline} onChange={(headline) => edit({ headline })} />
        </Field>
      );
    case 'intro':
      return (
        <>
          <VisualEditor label="Left side" v={page.left} onChange={(left) => edit({ left })} />
          <VisualEditor label="Right side" v={page.right} onChange={(right) => edit({ right })} />
        </>
      );
    case 'keep':
      return (
        <Row>
          <Field label="Label">
            <TextInput value={page.keep.label} onChange={(label) => edit({ keep: { ...page.keep, label } })} />
          </Field>
          <Field label="Destination">
            <Select
              value={page.keep.destination}
              onChange={(destination) => edit({ keep: { ...page.keep, destination } })}
              options={[
                { value: '/account/membership', label: 'Account › Membership' },
                { value: '/', label: 'Home' },
                { value: '/watch', label: 'Watch' },
              ]}
            />
          </Field>
        </Row>
      );
    case 'carousel':
      return (
        <>
          <Field label="Title">
            <TextInput value={m.title ?? ''} onChange={(title) => editModule({ title })} />
          </Field>
          <div className="c-field">
            <span className="c-label">Titles</span>
            <div className="c-posters">
              {(m.titles ?? []).map((t) => (
                <span key={t} className="c-poster">
                  <img src={TITLES[t]} alt="" />
                  <button type="button" className="c-poster-x" aria-label="Remove title" onClick={() => editModule({ titles: m.titles!.filter((x) => x !== t) })}>
                    <Fa icon={faXmark} size={12} />
                  </button>
                </span>
              ))}
              <button type="button" className="c-poster is-add" aria-label="Add title">
                <Fa icon={faPlus} size={18} />
              </button>
            </div>
          </div>
        </>
      );
    case 'text':
      return (
        <>
          <Field label="Title">
            <TextInput value={m.title ?? ''} onChange={(title) => editModule({ title })} />
          </Field>
          <Field label="Body">
            <TextArea value={m.body ?? ''} onChange={(body) => editModule({ body })} />
          </Field>
        </>
      );
    case 'reasons':
      return <ReasonsEditor page={page} />;
    case 'confirm':
      return (
        <>
          <Field label="Warning">
            <TextArea value={page.warning} onChange={(warning) => edit({ warning })} rows={2} />
          </Field>
          <Row>
            <Field label="Secondary button">
              <TextInput value={page.secondary} onChange={(secondary) => edit({ secondary })} />
            </Field>
            <Field label="Confirm button">
              <TextInput value={page.confirm} onChange={(confirm) => edit({ confirm })} />
            </Field>
          </Row>
        </>
      );
  }
}

export function PageEditor() {
  const page = usePage();
  const edit = useStore((s) => s.editPage);
  const open = useStore((s) => s.openModule);
  const setOpen = useStore((s) => s.setOpenModule);
  const [adding, setAdding] = useState(false);

  const add = (type: 'carousel' | 'text') => {
    const m: Module =
      type === 'carousel'
        ? { id: newId('m_'), type, visible: true, title: 'Keep watching', titles: ['the-arroyo', 'what-is-a-woman', 'sons-of-liberty', 'the-gospels'] }
        : { id: newId('m_'), type, visible: true, title: 'A note from the team', body: 'We read every answer below.' };
    // new modules land right above the reasons
    const at = page.modules.findIndex((x) => x.type === 'reasons');
    const modules = page.modules.slice();
    modules.splice(at < 0 ? modules.length : at, 0, m);
    edit({ modules });
    setOpen(m.id);
    setAdding(false);
  };

  return (
    <div className="c-modules">
      <Sortable
        items={page.modules}
        gap={10}
        onReorder={(a, b) => edit({ modules: move(page.modules, a, b) })}
        render={(m, i, handle) => {
          const isOpen = open === m.id;
          const locked = LOCKED.includes(m.type);
          return (
            <div className={'c-mod' + (isOpen ? ' is-open' : '') + (m.visible ? '' : ' is-hidden')}>
              <div className="c-mod-head">
                {handle}
                <button type="button" className="c-mod-title" onClick={() => setOpen(isOpen ? null : m.id)}>
                  <span className="c-mod-name">{NAMES[m.type]}</span>
                  <span className="c-mod-sum">{summary(m, page)}</span>
                </button>
                {locked ? (
                  <span className="c-mod-vis is-locked" title="Required on every cancellation page">
                    <Fa icon={faLock} size={14} /> Required
                  </span>
                ) : (
                  <button
                    type="button"
                    className="c-mod-vis"
                    onClick={() => edit({ modules: page.modules.map((x, j) => (j === i ? { ...x, visible: !x.visible } : x)) })}
                  >
                    <Fa icon={m.visible ? faEye : faEyeSlash} size={16} /> {m.visible ? 'Shown' : 'Hidden'}
                  </button>
                )}
                <button type="button" className="c-chev-btn" aria-label={isOpen ? 'Collapse' : 'Expand'} onClick={() => setOpen(isOpen ? null : m.id)}>
                  <Fa icon={faChevronDown} size={16} />
                </button>
              </div>
              {isOpen && (
                <div className="c-mod-body">
                  <ModuleBody m={m} page={page} />
                </div>
              )}
            </div>
          );
        }}
      />
      <div className="c-add-mod">
        <button type="button" className="c-add" onClick={() => setAdding(!adding)}>
          <Fa icon={faPlus} size={14} /> Add module
        </button>
        {adding && (
          <div className="c-menu">
            <button type="button" onClick={() => add('carousel')}>
              <b>Carousel</b>
              <span>A row of titles from the library</span>
            </button>
            <button type="button" onClick={() => add('text')}>
              <b>Text</b>
              <span>A title and a short paragraph</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
