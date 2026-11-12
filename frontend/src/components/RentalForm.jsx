import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import * as rentalService from '../services/rentalService.js';
import { calculateDays, formatMoney } from '../utils/format.js';

export default function RentalForm({ vehicle }) {
  const navigate = useNavigate();
  const [startDate, setStartDate] = useState('');
  const [expectedReturnDate, setExpectedReturnDate] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const validRange = startDate && expectedReturnDate && expectedReturnDate > startDate;
  const days = validRange ? calculateDays(startDate, expectedReturnDate) : 0;

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await rentalService.create({ vehicleId: vehicle.id, startDate, expectedReturnDate });
      navigate('/rentals');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <form className="card" onSubmit={handleSubmit}>
      <h2>Alugar este veículo</h2>
      {vehicle.status !== 'DISPONIVEL' && (
        <div className="alert warning">Este veículo não está disponível no momento.</div>
      )}
      {error && <div className="alert error">{error}</div>}
      <div className="form-row">
        <label>Retirada
          <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} required />
        </label>
        <label>Previsão de devolução
          <input type="date" value={expectedReturnDate} onChange={(e) => setExpectedReturnDate(e.target.value)} required />
        </label>
      </div>
      {validRange && (
        <p className="muted">
          Estimativa: {days} {days === 1 ? 'dia' : 'dias'} · {formatMoney(days * vehicle.dailyRate)}
        </p>
      )}
      <button className="btn" disabled={loading}>{loading ? 'Enviando...' : 'Confirmar locação'}</button>
    </form>
  );
}
