import { type ReactNode } from 'react';

export type IconName =
  | 'home'
  | 'laundry'
  | 'court'
  | 'tool'
  | 'file'
  | 'room'
  | 'notice'
  | 'bell'
  | 'user'
  | 'building'
  | 'chevron'
  | 'calendar'
  | 'clock'
  | 'check'
  | 'arrow'
  | 'plus'
  | 'alert'
  | 'refresh'
  | 'logout'
  | 'x';

export function Icon({ name, size = 20, className }: { name: IconName; size?: number; className?: string }) {
  const paths: Record<IconName, ReactNode> = {
    home: (
      <>
        <path d="m3 11 9-8 9 8" />
        <path d="M5 10v10h14V10M9 20v-6h6v6" />
      </>
    ),
    laundry: (
      <>
        <rect x="4" y="2.5" width="16" height="19" rx="2" />
        <path d="M4 8h16M8 5.5h.01M12 5.5h4" />
        <circle cx="12" cy="14.5" r="4" />
        <path d="M9.2 14.4c1.2-1 2.3.8 4 .1.8-.3 1.3-.1 1.7.2" />
      </>
    ),
    court: (
      <>
        <circle cx="12" cy="12" r="9" />
        <path d="M3.2 10h17.6M3.2 14h17.6M12 3c-2.3 2.5-3.5 5.5-3.5 9s1.2 6.5 3.5 9M12 3c2.3 2.5 3.5 5.5 3.5 9s-1.2 6.5-3.5 9" />
      </>
    ),
    tool: (
      <path d="M14.7 6.3a4 4 0 0 0-5-5L12 3.6 9.6 6 7.3 3.7a4 4 0 0 0 5 5L5.2 15.8a2 2 0 1 0 3 3l7-7a4 4 0 0 0 5-5L18 9l-3-2.7Z" />
    ),
    file: (
      <>
        <path d="M6 2h8l4 4v16H6z" />
        <path d="M14 2v5h5M9 12h6M9 16h6" />
      </>
    ),
    room: (
      <>
        <path d="M4 21V4a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v17M2 21h20" />
        <path d="M8 6h3v3H8zM13 6h3v3h-3zM8 12h3v3H8zM13 12h3v3h-3zM10 21v-3h4v3" />
      </>
    ),
    notice: (
      <>
        <path d="M4 5h16v13H7l-3 3z" />
        <path d="M8 9h8M8 13h5" />
      </>
    ),
    bell: (
      <>
        <path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9" />
        <path d="M10 21h4" />
      </>
    ),
    user: (
      <>
        <circle cx="12" cy="8" r="4" />
        <path d="M4 21a8 8 0 0 1 16 0" />
      </>
    ),
    building: (
      <>
        <path d="M3 21h18M5 21V5l7-3 7 3v16" />
        <path d="M9 8h2M9 12h2M9 16h2M14 8h2M14 12h2M14 16h2" />
      </>
    ),
    chevron: <path d="m9 18 6-6-6-6" />,
    calendar: (
      <>
        <rect x="3" y="5" width="18" height="16" rx="2" />
        <path d="M16 3v4M8 3v4M3 10h18" />
      </>
    ),
    clock: (
      <>
        <circle cx="12" cy="12" r="9" />
        <path d="M12 7v5l3 2" />
      </>
    ),
    check: <path d="m5 12 4 4L19 6" />,
    arrow: <path d="m15 18-6-6 6-6" />,
    plus: <path d="M12 5v14M5 12h14" />,
    alert: (
      <>
        <circle cx="12" cy="12" r="10" />
        <line x1="12" y1="8" x2="12" y2="12" />
        <line x1="12" y1="16" x2="12.01" y2="16" />
      </>
    ),
    refresh: (
      <>
        <path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
        <path d="M3 3v5h5" />
        <path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16" />
        <path d="M16 21h5v-5" />
      </>
    ),
    logout: (
      <>
        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
        <polyline points="16 17 21 12 16 7" />
        <line x1="21" y1="12" x2="9" y2="12" />
      </>
    ),
    x: (
      <>
        <line x1="18" y1="6" x2="6" y2="18" />
        <line x1="6" y1="6" x2="18" y2="18" />
      </>
    )
  };

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      {paths[name]}
    </svg>
  );
}
