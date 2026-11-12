import { Link } from 'react-router-dom';
import StatusBadge from './StatusBadge.jsx';
import { formatMoney } from '../utils/format.js';

export default function VehicleCard({ vehicle }) {
  return (
    <Link to={`/vehicles/${vehicle.id}`} className="card vehicle-card">
      <div className="vehicle-card-top">
        <h3>{vehicle.brand} {vehicle.model}</h3>
        <StatusBadge status={vehicle.status} />
      </div>
      <p className="muted">{vehicle.year} · {vehicle.color} · {vehicle.plate}</p>
      <p className="price">{formatMoney(vehicle.dailyRate)} <small>/ dia</small></p>
    </Link>
  );
}
