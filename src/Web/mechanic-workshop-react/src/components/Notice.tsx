interface NoticeProps {
  message: string
  onDismiss: () => void
}

export default function Notice({ message, onDismiss }: NoticeProps) {
  return (
    <div role="status" className="notice">
      <span>{message}</span>
      <button type="button" onClick={onDismiss} aria-label="Dismiss message">
        ×
      </button>
    </div>
  )
}
