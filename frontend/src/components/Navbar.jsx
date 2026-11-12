import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

export default function Navbar() {
  const { user, isAdmin, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate('/login');
  }

  return (
    <header className="navbar">
      <div className="navbar-inner">
        <span className="brand">RentCar</span>
        <nav className="nav-links">
          <NavLink to="/" end>Dashboard</NavLink>
          <NavLink to="/vehicles">Veículos</NavLink>
          <NavLink to="/rentals">Locações</NavLink>
          {isAdmin && <NavLink to="/vehicles/new">Novo veículo</NavLink>}
        </nav>
        <div className="nav-user">
          <span>{user.name} ({user.role})</span>
          <button className="btn btn-small btn-outline" onClick={handleLogout}>Sair</button>
        </div>
      </div>
    </header>
  );
}
