import type { ReactNode, SVGProps } from 'react'

type IconProps = SVGProps<SVGSVGElement> & { size?: number }

// 24px grid, 1.6 stroke: matches components/icons.tsx
const make =
  (paths: ReactNode) =>
  ({ size = 18, ...props }: IconProps) => (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="none"
      stroke="currentColor"
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      {paths}
    </svg>
  )

export const IconOrders = make(
  <>
    <path d="M6 3h12v18l-2.5-1.6L13 21l-1-1.6L11 21l-2.5-1.6L6 21Z" />
    <path d="M9 8h6M9 12h6" />
  </>,
)

export const IconWallet = make(
  <>
    <path d="M3.5 7.5A2.5 2.5 0 0 1 6 5h11.5v3" />
    <path d="M3.5 7.5V18A2 2 0 0 0 5.5 20h14a1 1 0 0 0 1-1V9a1 1 0 0 0-1-1H6a2.5 2.5 0 0 1-2.5-.5Z" />
    <circle cx="16.5" cy="14" r="1.2" />
  </>,
)

export const IconClock = make(
  <>
    <circle cx="12" cy="12" r="9" />
    <path d="M12 7v5l3 2" />
  </>,
)

export const IconCheckCircle = make(
  <>
    <circle cx="12" cy="12" r="9" />
    <path d="m8 12.3 2.6 2.6L16.2 9" />
  </>,
)

export const IconTruck = make(
  <>
    <path d="M2.5 6.5h11v9h-11Z" />
    <path d="M13.5 10h4l3 3v2.5h-7Z" />
    <circle cx="6.5" cy="18" r="1.7" />
    <circle cx="16.8" cy="18" r="1.7" />
  </>,
)

export const IconXCircle = make(
  <>
    <circle cx="12" cy="12" r="9" />
    <path d="m9 9 6 6M15 9l-6 6" />
  </>,
)

export const IconTrend = make(
  <>
    <path d="M4 4v15.5h16" />
    <path d="m7.5 14.5 3.5-4 3 2.5L19 7.5" />
  </>,
)

export const IconSearch = make(
  <>
    <circle cx="10.5" cy="10.5" r="6.5" />
    <path d="m20 20-4.4-4.4" />
  </>,
)

export const IconRefresh = make(
  <>
    <path d="M20 11a8 8 0 1 0-2.3 5.7" />
    <path d="M20 4v7h-7" />
  </>,
)

export const IconDownload = make(
  <>
    <path d="M12 4v11" />
    <path d="m7.5 11 4.5 4.5 4.5-4.5" />
    <path d="M5 19.5h14" />
  </>,
)

export const IconLogout = make(
  <>
    <path d="M9 4H6a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h3" />
    <path d="m16 8 4 4-4 4" />
    <path d="M20 12H9" />
  </>,
)

export const IconExternal = make(
  <>
    <path d="M14 4h6v6" />
    <path d="M20 4 11 13" />
    <path d="M18 14v4a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4" />
  </>,
)

export const IconPhone = make(
  <path d="M5 4h3.2l1.4 4.2-2 1.6a11.6 11.6 0 0 0 5.6 5.6l1.6-2 4.2 1.4V18a2 2 0 0 1-2.1 2A16 16 0 0 1 3 5.1 2 2 0 0 1 5 4Z" />,
)

export const IconWhatsApp = make(
  <>
    <path d="M4 20l1.3-4.2A8 8 0 1 1 8.4 18.8L4 20Z" />
    <path d="M9.3 8.9c.2 2.1 2.5 4.4 4.6 4.6l1.2-1.2-1.7-1-.9.6a3 3 0 0 1-1.6-1.6l.6-.9-1-1.7Z" />
  </>,
)

export const IconMail = make(
  <>
    <rect x="3" y="5" width="18" height="14" rx="2.2" />
    <path d="m3.5 7 8.5 6 8.5-6" />
  </>,
)

export const IconLock = make(
  <>
    <rect x="5" y="10.5" width="14" height="9.5" rx="2" />
    <path d="M8 10.5V7.8a4 4 0 0 1 8 0v2.7" />
  </>,
)

export const IconEye = make(
  <>
    <path d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12Z" />
    <circle cx="12" cy="12" r="2.8" />
  </>,
)

export const IconEyeOff = make(
  <>
    <path d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12Z" />
    <circle cx="12" cy="12" r="2.8" />
    <path d="m4 4 16 16" />
  </>,
)

export const IconClose = make(<path d="m6 6 12 12M18 6 6 18" />)
export const IconMenu = make(<path d="M4 7h16M4 12h16M4 17h16" />)
export const IconChevronLeft = make(<path d="m14.5 6-6 6 6 6" />)
export const IconChevronRight = make(<path d="m9.5 6 6 6-6 6" />)
export const IconChevronDown = make(<path d="m6 9.5 6 6 6-6" />)

export const IconStore = make(
  <>
    <path d="M4 9.5 5.5 4h13L20 9.5" />
    <path d="M4 9.5a2.7 2.7 0 0 0 5.3 0 2.7 2.7 0 0 0 5.4 0 2.7 2.7 0 0 0 5.3 0" />
    <path d="M5.5 12.5V20h13v-7.5" />
  </>,
)

export const IconGift = make(
  <>
    <path d="M4 11h16v9H4Z" />
    <path d="M3 7.5h18V11H3Z" />
    <path d="M12 7.5V20" />
    <path d="M12 7.5C10 7.5 8 6.7 8 5.2 8 4 9 3.5 10 3.5c1.6 0 2 2 2 4Z" />
    <path d="M12 7.5c2 0 4-.8 4-2.3 0-1.2-1-1.7-2-1.7-1.6 0-2 2-2 4Z" />
  </>,
)

export const IconPen = make(<path d="m4 20 1-4L16.5 4.5a2 2 0 0 1 3 3L8 19l-4 1Z" />)

export const IconCopy = make(
  <>
    <rect x="8" y="8" width="12" height="12" rx="2" />
    <path d="M16 8V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h2" />
  </>,
)

export const IconPin = make(
  <>
    <path d="M12 21s-6.8-6-6.8-11a6.8 6.8 0 1 1 13.6 0c0 5-6.8 11-6.8 11Z" />
    <circle cx="12" cy="10" r="2.3" />
  </>,
)

export const IconUser = make(
  <>
    <circle cx="12" cy="8" r="3.6" />
    <path d="M4.5 20c1.4-3.6 4.4-5.4 7.5-5.4s6.1 1.8 7.5 5.4" />
  </>,
)

export const IconInbox = make(
  <>
    <path d="m4 13 2.5-7h11L20 13" />
    <path d="M4 13v5a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-5h-5l-1 2h-4l-1-2Z" />
  </>,
)

export const IconAlert = make(
  <>
    <path d="M12 3.5 21.5 20h-19Z" />
    <path d="M12 9.5v4.4M12 17v0" />
  </>,
)

export const IconArrowLeft = make(<path d="M19 12H5m6-6-6 6 6 6" />)

export const IconShield = make(
  <>
    <path d="M12 3.5 5 6v5.5c0 4.4 2.9 7.6 7 9 4.1-1.4 7-4.6 7-9V6Z" />
    <path d="m9 12 2.2 2.2L15.2 10" />
  </>,
)
