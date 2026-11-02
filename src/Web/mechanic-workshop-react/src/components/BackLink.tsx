import { Link } from 'react-router'

interface BackLinkProps {
  to: string
  label: string
}

export default function BackLink({ to, label }: BackLinkProps) {
  return (
    <Link to={to} className="back-link">
      <svg className="back-icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
        <path d="M19 12H5M11 6l-6 6 6 6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      {label}
    </Link>
  )
}
