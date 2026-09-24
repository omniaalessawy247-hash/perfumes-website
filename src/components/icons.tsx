import type { SVGProps } from 'react'

type IconProps = SVGProps<SVGSVGElement> & { size?: number }

const base = (size: number): SVGProps<SVGSVGElement> => ({
  viewBox: '0 0 24 24',
  width: size,
  height: size,
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.6,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  'aria-hidden': true,
})

export const IconUser = ({ size = 18, ...p }: IconProps) => (
  <svg {...base(size)} {...p}>
    <circle cx="12" cy="8" r="3.6" />
    <path d="M4.5 20c1.4-3.6 4.4-5.4 7.5-5.4s6.1 1.8 7.5 5.4" />
  </svg>
)

export const IconPhone = ({ size = 18, ...p }: IconProps) => (
  <svg {...base(size)} {...p}>
    <path d="M5 4h3.2l1.4 4.2-2 1.6a11.6 11.6 0 0 0 5.6 5.6l1.6-2 4.2 1.4V18a2 2 0 0 1-2.1 2A16 16 0 0 1 3 5.1 2 2 0 0 1 5 4Z" />
  </svg>
)

export const IconPin = ({ size = 18, ...p }: IconProps) => (
  <svg {...base(size)} {...p}>
    <path d="M12 21s-6.8-6-6.8-11a6.8 6.8 0 1 1 13.6 0c0 5-6.8 11-6.8 11Z" />
    <circle cx="12" cy="10" r="2.3" />
  </svg>
)

export const IconHome = ({ size = 18, ...p }: IconProps) => (
  <svg {...base(size)} {...p}>
    <path d="M4 11.5 12 4l8 7.5" />
    <path d="M6 10v9h12v-9" />
  </svg>
)

export const IconReceipt = ({ size = 18, ...p }: IconProps) => (
  <svg {...base(size)} {...p}>
    <path d="M6 3h12v18l-2.5-1.6L13 21l-1-1.6L11 21l-2.5-1.6L6 21Z" />
    <path d="M9 8h6M9 12h6" />
  </svg>
)

export const IconSearch = ({ size = 18, ...p }: IconProps) => (
  <svg {...base(size)} {...p}>
    <circle cx="10.5" cy="10.5" r="6.5" />
    <path d="m20 20-4.4-4.4" />
  </svg>
)

export const IconPackage = ({ size = 18, ...p }: IconProps) => (
  <svg {...base(size)} {...p}>
    <path d="m3.5 7.5 8.5-4 8.5 4-8.5 4-8.5-4Z" />
    <path d="M3.5 7.5v9l8.5 4 8.5-4v-9" />
    <path d="M12 11.5V20.5" />
  </svg>
)

export const IconCheck = ({ size = 18, ...p }: IconProps) => (
  <svg {...base(size)} {...p}>
    <circle cx="12" cy="12" r="9" />
    <path d="m8 12.3 2.6 2.6L16.2 9" />
  </svg>
)

export const IconTruck = ({ size = 18, ...p }: IconProps) => (
  <svg {...base(size)} {...p}>
    <path d="M2.5 6.5h11v9h-11Z" />
    <path d="M13.5 10h4l3 3v2.5h-7Z" />
    <circle cx="6.5" cy="18" r="1.7" />
    <circle cx="16.8" cy="18" r="1.7" />
  </svg>
)

export const IconCash = ({ size = 18, ...p }: IconProps) => (
  <svg {...base(size)} {...p}>
    <rect x="2.5" y="6" width="19" height="12" rx="2" />
    <circle cx="12" cy="12" r="2.8" />
    <path d="M5.5 8.5v0M18.5 15.5v0" />
  </svg>
)

export const IconCard = ({ size = 18, ...p }: IconProps) => (
  <svg {...base(size)} {...p}>
    <rect x="2.5" y="5.5" width="19" height="13" rx="2.2" />
    <path d="M2.5 10h19" />
    <path d="M6 14.5h4" />
  </svg>
)

export const IconLock = ({ size = 18, ...p }: IconProps) => (
  <svg {...base(size)} {...p}>
    <rect x="5" y="10.5" width="14" height="9.5" rx="2" />
    <path d="M8 10.5V7.8a4 4 0 0 1 8 0v2.7" />
  </svg>
)

export const IconBag = ({ size = 18, ...p }: IconProps) => (
  <svg {...base(size)} {...p}>
    <path d="M6 8h12l1 13H5Z" />
    <path d="M9 8V6.5a3 3 0 0 1 6 0V8" />
  </svg>
)

export const IconAlert = ({ size = 18, ...p }: IconProps) => (
  <svg {...base(size)} {...p}>
    <path d="M12 3.5 21.5 20h-19Z" />
    <path d="M12 9.5v4.4M12 17v0" />
  </svg>
)
