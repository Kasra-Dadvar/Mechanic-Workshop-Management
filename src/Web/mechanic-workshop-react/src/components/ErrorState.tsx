interface ErrorStateProps {
  title: string
  message: string
  onRetry?: () => void
}

export default function ErrorState({ title, message, onRetry }: ErrorStateProps) {
  return (
    <div role="alert" className="error-state">
      <strong>{title}</strong>
      <p>{message}</p>
      {onRetry && (
        <button type="button" onClick={onRetry}>
          Retry
        </button>
      )}
    </div>
  )
}
