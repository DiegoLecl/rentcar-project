import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    if (form.password !== form.confirm) {
      setError('As senhas não conferem');
      return;
    }
    setLoading(true);
    try {
      await register({ name: form.name, email: form.email, password: form.password });
      navigate('/login', { state: { registered: true } });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-page">
      <form className="card auth-card" onSubmit={handleSubmit}>
        <h1>Criar conta</h1>
        <p className="muted">Cadastre-se como cliente</p>
        {error && <div className="alert error">{error}</div>}
        <label>Nome
          <input name="name" value={form.name} onChange={handleChange} required />
        </label>
        <label>E-mail
          <input name="email" type="email" value={form.email} onChange={handleChange} required />
        </label>
        <label>Senha (mínimo 6 caracteres)
          <input name="password" type="password" value={form.password} onChange={handleChange} required />
        </label>
        <label>Confirmar senha
          <input name="confirm" type="password" value={form.confirm} onChange={handleChange} required />
        </label>
        <button className="btn" disabled={loading}>{loading ? 'Cadastrando...' : 'Cadastrar'}</button>
        <p className="muted center">Já tem conta? <Link to="/login">Entrar</Link></p>
      </form>
    </div>
  );
}
