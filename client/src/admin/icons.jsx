// Line icons for the inbox, drawn at 24px and sized with font-size (1em).
const paths = {
  search: 'M11 4a7 7 0 1 0 0 14 7 7 0 0 0 0-14Zm9 16-4.35-4.35',
  mail: 'M4 6h16v12H4zM4 7l8 6 8-6',
  phone:
    'M6.6 3.5h2.6l1.3 4-2 1.3a11 11 0 0 0 6.7 6.7l1.3-2 4 1.3v2.6a2 2 0 0 1-2.2 2A16.5 16.5 0 0 1 4.6 5.7a2 2 0 0 1 2-2.2Z',
  whatsapp:
    'M4 20l1.2-4.1A8 8 0 1 1 8.3 19L4 20Zm5.2-11.9c.3-.6.5-.6.8-.6h.6c.2 0 .4 0 .6.5l.8 1.9c.1.3 0 .5-.1.7l-.5.6c-.1.2-.2.3 0 .6a6.8 6.8 0 0 0 3 2.6c.3.1.5.1.6 0l.7-.9c.2-.2.4-.2.6-.1l1.8.9c.3.1.4.3.4.4 0 .6-.3 1.4-1 1.8-.7.5-1.6.5-2.6.1a10.4 10.4 0 0 1-5-4.3c-.7-1.1-.8-2.2-.1-3.3Z',
  copy: 'M9 9h10v11H9zM5 15V4h10',
  trash: 'M4 7h16M10 11v6m4-6v6M6 7l1 13h10l1-13M9 7V4h6v3',
  refresh: 'M20 11a8 8 0 1 0-2.3 5.7M20 4v7h-7',
  logout: 'M15 4h4v16h-4M10 8l-4 4 4 4M6 12h10',
  eye: 'M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12Zm9.5-3a3 3 0 1 0 0 6 3 3 0 0 0 0-6Z',
  eyeOff: 'M3 3l18 18M10.6 6A9.7 9.7 0 0 1 12 5.5c6 0 9.5 6.5 9.5 6.5a17 17 0 0 1-3.1 3.8M6.2 7.6C3.9 9.2 2.5 12 2.5 12S6 18.5 12 18.5a9.5 9.5 0 0 0 4.6-1.2M9.9 9.9a3 3 0 0 0 4.2 4.2',
  back: 'M19 12H5m6-6-6 6 6 6',
  key: 'M11 12a4 4 0 1 1-8 0 4 4 0 0 1 8 0Zm0 0h10m-3 0v3.5M14.5 12v2.5',
  lock: 'M5.5 10.5h13v10h-13zM8.5 10.5V7.5a3.5 3.5 0 0 1 7 0v3M12 14.5v2.5',
  check: 'M5 12.5l4.5 4.5L19 7.5',
  close: 'M6 6l12 12M18 6 6 18',
  inbox: 'M3 13h5l1.5 3h5L16 13h5M5.5 5h13L21 13v6H3v-6z',
  alert: 'M12 4 2.5 20h19L12 4Zm0 6v4m0 3h.01',
}

export default function Icon({ name, className = '' }) {
  return (
    <svg
      className={`ico ${className}`}
      viewBox="0 0 24 24"
      width="1em"
      height="1em"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d={paths[name]} />
    </svg>
  )
}
