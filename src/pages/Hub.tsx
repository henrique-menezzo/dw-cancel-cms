import type { ReactNode } from 'react';
import { faArrowLeft, faArrowUpRightDots, faChevronRight, faRotateLeft, faTags } from '@fortawesome/free-solid-svg-icons';
import { CancelFlowIcon, Fa } from '../components/Icon';
import { useStore } from '../store';

type Tile = { icon: ReactNode; title: string; desc: string; to?: 'cancellation' };

const TILES: Tile[] = [
  {
    icon: <Fa icon={faTags} size={30} />,
    title: 'Renewal Offer Management',
    desc: 'Create and manage personalized offers, promo codes, and incentives to drive membership renewals.',
  },
  {
    icon: <Fa icon={faRotateLeft} size={30} />,
    title: 'Reactivation Offer Management',
    desc: 'Create and manage personalized offers, promo codes, and incentives to reactivate canceled members.',
  },
  {
    icon: <Fa icon={faArrowUpRightDots} size={30} />,
    title: 'Upgrade Offer Management',
    desc: 'Move members to a higher membership tier with gift-driven upgrade offers.',
  },
  {
    icon: <CancelFlowIcon size={30} />,
    title: 'Cancellation Flow Management',
    desc: 'Edit the cancellation page and the save offers members see before they cancel.',
    to: 'cancellation',
  },
  {
    icon: <Fa icon={faRotateLeft} size={30} />,
    title: 'Configure WisePops.',
    desc: 'Turn wisepops script on or off.',
  },
];

export function Hub() {
  const go = useStore((s) => s.go);
  return (
    <div className="c-hub">
      <header className="c-hub-head">
        <button className="c-round-btn" aria-label="Back">
          <Fa icon={faArrowLeft} size={30} />
        </button>
        <h1>Lifecycle Management</h1>
      </header>
      <section className="c-hub-card">
        <h2>Lifecycle Management</h2>
        <p>Manage all offers across the user’s lifecycle journey, including renewals, reactivations, upgrades, and more.</p>
        <div className="c-tiles">
          {TILES.map((t) => (
            <a
              key={t.title}
              className={'c-tile' + (t.to ? ' is-live' : '')}
              href={t.to ? '#/lifecycle-management/cancellation' : undefined}
              onClick={(e) => {
                if (!t.to) return;
                e.preventDefault();
                go(t.to);
              }}
            >
              <span className="c-tile-ico">{t.icon}</span>
              <h3>{t.title}</h3>
              <div className="c-tile-foot">
                <p>{t.desc}</p>
                <Fa icon={faChevronRight} size={15} className="c-tile-chev" />
              </div>
            </a>
          ))}
        </div>
      </section>
    </div>
  );
}
