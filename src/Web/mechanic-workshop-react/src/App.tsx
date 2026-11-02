import { Navigate, Route, Routes } from 'react-router'
import AppLayout from './components/AppLayout'
import CustomerCreatePage from './pages/customers/CustomerCreatePage'
import CustomerDetailsPage from './pages/customers/CustomerDetailsPage'
import CustomerEditPage from './pages/customers/CustomerEditPage'
import CustomerListPage from './pages/customers/CustomerListPage'
import VehicleCreatePage from './pages/vehicles/VehicleCreatePage'
import VehicleDetailsPage from './pages/vehicles/VehicleDetailsPage'
import VehicleEditPage from './pages/vehicles/VehicleEditPage'
import ServiceCreatePage from './pages/services/ServiceCreatePage'
import ServiceDetailsPage from './pages/services/ServiceDetailsPage'
import ServiceEditPage from './pages/services/ServiceEditPage'
import ItemCreatePage from './pages/items/ItemCreatePage'
import ItemDetailsPage from './pages/items/ItemDetailsPage'
import ItemEditPage from './pages/items/ItemEditPage'
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
        <Route path="customers/:customerId/vehicles/new" element={<VehicleCreatePage />} />
        <Route path="vehicles/:vehicleId" element={<VehicleDetailsPage />} />
        <Route path="vehicles/:vehicleId/edit" element={<VehicleEditPage />} />
        <Route path="vehicles/:vehicleId/services/new" element={<ServiceCreatePage />} />
        <Route path="services/:serviceId" element={<ServiceDetailsPage />} />
        <Route path="services/:serviceId/edit" element={<ServiceEditPage />} />
        <Route path="services/:serviceId/items/new" element={<ItemCreatePage />} />
        <Route path="items/:itemId" element={<ItemDetailsPage />} />
        <Route path="items/:itemId/edit" element={<ItemEditPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  )
}
