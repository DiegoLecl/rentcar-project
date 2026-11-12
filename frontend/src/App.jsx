import { Routes, Route, Navigate } from 'react-router-dom';
import PrivateRoute from './components/PrivateRoute.jsx';
import Layout from './components/Layout.jsx';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import Dashboard from './pages/Dashboard.jsx';
import Vehicles from './pages/Vehicles.jsx';
import VehicleForm from './pages/VehicleForm.jsx';
import VehicleDetails from './pages/VehicleDetails.jsx';
import Rentals from './pages/Rentals.jsx';

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route
        element={
          <PrivateRoute>
            <Layout />
          </PrivateRoute>
        }
      >
        <Route index element={<Dashboard />} />
        <Route path="vehicles" element={<Vehicles />} />
        <Route
          path="vehicles/new"
          element={
            <PrivateRoute adminOnly>
              <VehicleForm />
            </PrivateRoute>
          }
        />
        <Route
          path="vehicles/:id/edit"
          element={
            <PrivateRoute adminOnly>
              <VehicleForm />
            </PrivateRoute>
          }
        />
        <Route path="vehicles/:id" element={<VehicleDetails />} />
        <Route path="rentals" element={<Rentals />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
