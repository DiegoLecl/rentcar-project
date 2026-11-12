import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import * as vehicleService from '../services/vehicleService.js';
import StatusBadge from '../components/StatusBadge.jsx';
import RentalForm from '../components/RentalForm.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { formatMoney } from '../utils/format.js';

export default function VehicleDetails() {
  const { id } = useParams();
  const { isAdmin } = useAuth();
  const navigate = useNavigate();
  const [vehicle, setVehicle] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    vehicleService.get(id).then(setVehicle).catch((err) => setError(err.message));
  }, [id]);

  async function handleDelete() {
    if (!window.confirm('Excluir este veículo?')) return;
    try {
      await vehicleService.remove(id);
      navigate('/vehicles');
    } catch (err) {
      setError(err.message);
    }
  }

  if (error && !vehicle) return <div className="alert error">{error}</div>;
  if (!vehicle) return <p className="muted">Carregando...</p>;

  return (
    <>
      <div className="page-header">
        <h1>{vehicle.brand} {vehicle.model}</h1>
        <StatusBadge status={vehicle.status} />
      </div>
      {error && <div className="alert error">{error}</div>}
      <div className="card">
        <dl className="details">
          <div><dt>Ano</dt><dd>{vehicle.year}</dd></div>
          <div><dt>Placa</dt><dd>{vehicle.plate}</dd></div>
          <div><dt>Cor</dt><dd>{vehicle.color}</dd></div>
          <div><dt>Diária</dt><dd>{formatMoney(vehicle.dailyRate)}</dd></div>
        </dl>
        {isAdmin && (
          <div className="actions">
            <Link className="btn btn-outline" to={`/vehicles/${vehicle.id}/edit`}>Editar</Link>
            <button className="btn btn-danger" onClick={handleDelete}>Excluir</button>
          </div>
        )}
      </div>
      <RentalForm vehicle={vehicle} />
    </>
  );
}
