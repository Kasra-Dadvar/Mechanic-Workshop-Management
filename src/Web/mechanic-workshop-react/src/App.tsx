import { Navigate, Route, Routes } from 'react-router'
import AppLayout from './components/AppLayout'
import CustomerCreatePage from './pages/customers/CustomerCreatePage'
import CustomerDetailsPage from './pages/customers/CustomerDetailsPage'
import CustomerEditPage from './pages/customers/CustomerEditPage'
import CustomerListPage from './pages/customers/CustomerListPage'
import NotFoundPage from './pages/NotFoundPage'

export default function App() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route index element={<Navigate to="/customers" replace />} />
        <Route path="customers" element={<CustomerListPage />} />
        <Route path="customers/new" element={<CustomerCreatePage />} />
        <Route path="customers/:customerId" element={<CustomerDetailsPage />} />
        <Route path="customers/:customerId/edit" element={<CustomerEditPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  )
}
