import { useEffect, useState } from 'react';
import * as rentalService from '../services/rentalService.js';
import StatusBadge from '../components/StatusBadge.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { formatDate, formatDateTime, formatMoney } from '../utils/format.js';

export default function Rentals() {
  const { isAdmin } = useAuth();
  const [rentals, setRentals] = useState([]);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);

  async function load() {
    try {
      setRentals(await rentalService.list());
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function handleReturn(id) {
    if (!window.confirm('Registrar a devolução deste veículo?')) return;
    setError('');
    setMessage('');
    try {
      await rentalService.giveBack(id);
      setMessage('Devolução registrada. O veículo está disponível novamente.');
      await load();
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <>
      <h1>{isAdmin ? 'Todas as locações' : 'Minhas locações'}</h1>
      {message && <div className="alert success">{message}</div>}
      {error && <div className="alert error">{error}</div>}
      {loading ? (
        <p className="muted">Carregando...</p>
      ) : rentals.length === 0 ? (
        <p className="muted">Nenhuma locação registrada.</p>
      ) : (
        <div className="table-wrap card">
          <table>
            <thead>
              <tr>
                <th>#</th>
                <th>Veículo</th>
                {isAdmin && <th>Cliente</th>}
                <th>Retirada</th>
                <th>Previsão</th>
                <th>Devolução</th>
                <th>Total</th>
                <th>Status</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {rentals.map((rental) => (
                <tr key={rental.id}>
                  <td>{rental.id}</td>
                  <td>{rental.vehicle.brand} {rental.vehicle.model} ({rental.vehicle.plate})</td>
                  {isAdmin && <td>{rental.user.name}</td>}
                  <td>{formatDate(rental.startDate)}</td>
                  <td>{formatDate(rental.expectedReturnDate)}</td>
                  <td>{formatDateTime(rental.returnedAt)}</td>
                  <td>{formatMoney(rental.totalPrice)}</td>
                  <td><StatusBadge status={rental.status} /></td>
                  <td>
                    {rental.status === 'ATIVA' && (
                      <button className="btn btn-small" onClick={() => handleReturn(rental.id)}>
                        Registrar devolução
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}
