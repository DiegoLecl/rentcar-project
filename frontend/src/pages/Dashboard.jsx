import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import * as dashboardService from '../services/dashboardService.js';
import { useAuth } from '../context/AuthContext.jsx';

function StatCard({ label, value }) {
  return (
    <div className="card stat">
      <span className="muted">{label}</span>
      <strong>{value}</strong>
    </div>
  );
}

export default function Dashboard() {
  const { user, isAdmin } = useAuth();
  const [stats, setStats] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    dashboardService.stats().then(setStats).catch((err) => setError(err.message));
  }, []);

  return (
    <>
      <h1>Olá, {user.name}</h1>
      {error && <div className="alert error">{error}</div>}
      {stats && (
        <>
          <h2>Frota</h2>
          <div className="grid">
            <StatCard label="Total de veículos" value={stats.vehicles.total} />
            <StatCard label="Disponíveis" value={stats.vehicles.disponivel} />
            <StatCard label="Alugados" value={stats.vehicles.alugado} />
            <StatCard label="Em manutenção" value={stats.vehicles.manutencao} />
          </div>
          <h2>{isAdmin ? 'Todas as locações' : 'Minhas locações'}</h2>
          <div className="grid">
            <StatCard label="Total" value={stats.rentals.total} />
            <StatCard label="Ativas" value={stats.rentals.ativas} />
            <StatCard label="Finalizadas" value={stats.rentals.finalizadas} />
          </div>
        </>
      )}
      <div className="actions">
        <Link className="btn" to="/vehicles">Ver veículos</Link>
        <Link className="btn btn-outline" to="/rentals">Ver locações</Link>
      </div>
    </>
  );
}
