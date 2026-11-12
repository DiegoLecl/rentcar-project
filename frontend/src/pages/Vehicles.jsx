import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import * as vehicleService from '../services/vehicleService.js';
import VehicleCard from '../components/VehicleCard.jsx';
import { useAuth } from '../context/AuthContext.jsx';

export default function Vehicles() {
  const { isAdmin } = useAuth();
  const [vehicles, setVehicles] = useState([]);
  const [status, setStatus] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    vehicleService
      .list(status)
      .then(setVehicles)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [status]);

  return (
    <>
      <div className="page-header">
        <h1>Veículos</h1>
        {isAdmin && <Link className="btn" to="/vehicles/new">Novo veículo</Link>}
      </div>
      <label className="filter">Filtrar por status
        <select value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="">Todos</option>
          <option value="DISPONIVEL">Disponível</option>
          <option value="ALUGADO">Alugado</option>
          <option value="MANUTENCAO">Manutenção</option>
        </select>
      </label>
      {error && <div className="alert error">{error}</div>}
      {loading ? (
        <p className="muted">Carregando...</p>
      ) : vehicles.length === 0 ? (
        <p className="muted">Nenhum veículo encontrado.</p>
      ) : (
        <div className="grid">
          {vehicles.map((vehicle) => <VehicleCard key={vehicle.id} vehicle={vehicle} />)}
        </div>
      )}
    </>
  );
}
