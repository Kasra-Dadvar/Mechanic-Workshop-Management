interface LoadingStateProps {
  message?: string
}

export default function LoadingState({ message = 'Loading…' }: LoadingStateProps) {
  return (
    <p role="status" className="muted">
      {message}
    </p>
  )
}
