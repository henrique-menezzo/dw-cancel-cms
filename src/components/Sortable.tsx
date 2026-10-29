import { useRef, useState, type PointerEvent as RPointerEvent, type ReactNode } from 'react';
import { faGripVertical } from '@fortawesome/free-solid-svg-icons';
import { Fa } from './Icon';

type Drag = { from: number; to: number; dy: number; h: number };

export function move<T>(list: T[], from: number, to: number) {
  const next = list.slice();
  const [it] = next.splice(from, 1);
  next.splice(to, 0, it);
  return next;
}

// Drag-to-reorder list. Rows slide out of the way while the grabbed one follows the pointer.
export function Sortable<T extends { id: string }>({
  items,
  onReorder,
  render,
  gap = 8,
  className,
}: {
  items: T[];
  onReorder: (from: number, to: number) => void;
  render: (item: T, index: number, handle: ReactNode) => ReactNode;
  gap?: number;
  className?: string;
}) {
  const list = useRef<HTMLDivElement>(null);
  const [drag, setDrag] = useState<Drag | null>(null);
  const last = useRef<Drag | null>(null);

  const start = (e: RPointerEvent, index: number) => {
    if (e.button !== 0) return;
    e.preventDefault();
    const rows = Array.from(list.current!.children) as HTMLElement[];
    const rects = rows.map((r) => r.getBoundingClientRect());
    const startY = e.clientY;
    const h = rects[index].height + gap;
    const onMove = (ev: PointerEvent) => {
      const dy = ev.clientY - startY;
      const center = rects[index].top + rects[index].height / 2 + dy;
      let to = index;
      rects.forEach((r, i) => {
        const mid = r.top + r.height / 2;
        if (i < index && center < mid) to = Math.min(to, i);
        if (i > index && center > mid) to = Math.max(to, i);
      });
      last.current = { from: index, to, dy, h };
      setDrag(last.current);
    };
    const onUp = () => {
      window.removeEventListener('pointermove', onMove);
      const d = last.current;
      last.current = null;
      setDrag(null);
      if (d && d.to !== d.from) onReorder(d.from, d.to);
    };
    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerup', onUp, { once: true });
  };

  return (
    <div ref={list} className={'c-sort ' + (className ?? '')} style={{ gap }} data-dragging={drag ? '' : undefined}>
      {items.map((item, i) => {
        let ty = 0;
        if (drag) {
          if (i === drag.from) ty = drag.dy;
          else if (drag.from < drag.to && i > drag.from && i <= drag.to) ty = -drag.h;
          else if (drag.from > drag.to && i >= drag.to && i < drag.from) ty = drag.h;
        }
        const handle = (
          <span className="c-grip" onPointerDown={(e) => start(e, i)} aria-label="Drag to reorder">
            <Fa icon={faGripVertical} size={16} />
          </span>
        );
        return (
          <div
            key={item.id}
            className={'c-sort-row' + (drag?.from === i ? ' is-grabbed' : '')}
            style={ty ? { transform: `translateY(${ty}px)` } : undefined}
          >
            {render(item, i, handle)}
          </div>
        );
      })}
    </div>
  );
}
