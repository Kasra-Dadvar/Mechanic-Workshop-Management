import { Link, Outlet } from 'react-router'

export default function AppLayout() {
  return (
    <>
      <header className="app-header">
        <Link to="/customers" className="app-title">
          Mechanic Workshop
        </Link>
        <nav aria-label="Main">
          <Link to="/customers">Customers</Link>
        </nav>
      </header>
      <main className="app-main">
        <Outlet />
      </main>
    </>
  )
}
