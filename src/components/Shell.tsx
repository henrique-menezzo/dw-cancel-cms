import type { ReactNode } from 'react';
import { faChevronDown, faChevronLeft, faChevronRight, faHouse, faScrewdriverWrench } from '@fortawesome/free-solid-svg-icons';
import { faStar } from '@fortawesome/free-regular-svg-icons';
import { Fa, Logo, faBillboard } from './Icon';
import { useStore } from '../store';

export function Shell({ children }: { children: ReactNode }) {
  const go = useStore((s) => s.go);
  return (
    <div className="c-app">
      <nav className="c-top">
        <a className="c-top-logo" href="#/lifecycle-management" onClick={() => go('hub')} aria-label="DailyWire CMS">
          <Logo />
        </a>
        <div className="c-user">
          <span className="c-avatar">H</span>
          <span>Henrique Menezzo</span>
          <Fa icon={faChevronDown} size={20} className="c-user-chev" />
        </div>
      </nav>
      <aside className="c-side">
        <div className="c-side-list">
          <a className="c-side-row">
            <Fa icon={faHouse} size={20} className="c-side-ico" />
            <span>Home</span>
          </a>
          <hr />
          <a className="c-side-row">
            <Fa icon={faStar} size={20} className="c-side-ico is-star" />
            <span>Favorites</span>
            <Fa icon={faChevronRight} size={12} className="c-side-chev" />
          </a>
          <hr />
          <button className="c-side-row is-open">
            <Fa icon={faBillboard} size={20} className="c-side-ico" />
            <span>Ads and Lifecycle</span>
            <Fa icon={faChevronDown} size={12} className="c-side-chev" />
          </button>
          <a className="c-side-sub" href="#/lifecycle-management" onClick={() => go('hub')}>
            Lifecycle Management
          </a>
          <hr />
          <a className="c-side-row">
            <Fa icon={faScrewdriverWrench} size={20} className="c-side-ico" />
            <span>CMS Config</span>
            <Fa icon={faChevronRight} size={12} className="c-side-chev" />
          </a>
        </div>
        <button className="c-side-collapse">
          <Fa icon={faChevronLeft} size={16} />
          <span>Collapse</span>
        </button>
      </aside>
      <main className="c-main">{children}</main>
    </div>
  );
}
