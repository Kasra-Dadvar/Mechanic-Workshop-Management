import { Link } from 'react-router'
import PageHeader from '../components/PageHeader'

export default function NotFoundPage() {
  return (
    <>
      <PageHeader title="Page not found" />
      <p>
        <Link to="/customers">Go to customers</Link>
      </p>
    </>
  )
}
