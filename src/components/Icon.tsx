import type { IconDefinition } from '@fortawesome/fontawesome-common-types';
import logoRaw from '../assets/logo.svg?raw';

export function Fa({ icon, size = 16, className }: { icon: IconDefinition; size?: number; className?: string }) {
  const [w, h, , , path] = icon.icon;
  const paths = Array.isArray(path) ? path : [path];
  return (
    <svg className={className} width={size} height={size} viewBox={`0 0 ${w} ${h}`} fill="currentColor" aria-hidden>
      {paths.map((d, i) => (
        <path key={i} d={d} />
      ))}
    </svg>
  );
}

// fa-billboard is Font Awesome Pro; path copied from the CMS sidebar
export const faBillboard = {
  prefix: 'fas',
  iconName: 'billboard',
  icon: [
    576,
    512,
    [],
    '',
    'M384 32c8.8 0 16 7.2 16 16l0 16 80 0c35.3 0 64 28.7 64 64l0 256 16 0c8.8 0 16 7.2 16 16s-7.2 16-16 16l-256 0 0 80c0 8.8-7.2 16-16 16s-16-7.2-16-16l0-80-256 0c-8.8 0-16-7.2-16-16s7.2-16 16-16l16 0 0-256c0-35.3 28.7-64 64-64l80 0 0-16c0-8.8 7.2-16 16-16s16 7.2 16 16l0 16 160 0 0-16c0-8.8 7.2-16 16-16zM288 384l224 0 0-256c0-17.7-14.3-32-32-32l-80 0 0 48 32 0c8.8 0 16 7.2 16 16s-7.2 16-16 16l-96 0c-8.8 0-16-7.2-16-16s7.2-16 16-16l32 0 0-48-160 0 0 48 32 0c8.8 0 16 7.2 16 16s-7.2 16-16 16l-96 0c-8.8 0-16-7.2-16-16s7.2-16 16-16l32 0 0-48-80 0c-17.7 0-32 14.3-32 32l0 256 224 0z',
  ],
} as unknown as IconDefinition;

// New icon for the cancellation flow: the member heads out the door and the arrow turns back in.
// Drawn on Font Awesome's 512 grid with a stroke close to FA Solid's weight.
export function CancelFlowIcon({ size = 30 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 512 512" fill="none" stroke="currentColor" strokeWidth={60} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M184 66H118a54 54 0 0 0-54 54v272a54 54 0 0 0 54 54h66" />
      <path d="M212 176h132a80 80 0 0 1 0 160H226" />
      <path d="M292 272l-66 64 66 64" />
    </svg>
  );
}

export function Logo({ className }: { className?: string }) {
  const svg = logoRaw.replace(/fill="#FAFAFA"/gi, 'fill="currentColor"').replace(/width="160" height="15"/, 'width="100%" height="100%"');
  return <span className={className} dangerouslySetInnerHTML={{ __html: svg }} />;
}
