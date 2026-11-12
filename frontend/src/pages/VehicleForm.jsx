import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import * as vehicleService from '../services/vehicleService.js';

const emptyForm = {
  brand: '',
  model: '',
  year: new Date().getFullYear(),
  plate: '',
  color: '',
  dailyRate: '',
  status: 'DISPONIVEL'
};

export default function VehicleForm() {
  const { id } = useParams();
  const editing = Boolean(id);
  const navigate = useNavigate();
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!editing) return;
    vehicleService
      .get(id)
      .then((vehicle) =>
        setForm({
          brand: vehicle.brand,
          model: vehicle.model,
          year: vehicle.year,
          plate: vehicle.plate,
          color: vehicle.color,
          dailyRate: vehicle.dailyRate,
          status: vehicle.status
        })
      )
      .catch((err) => setError(err.message));
  }, [id, editing]);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);
    const payload = { ...form, year: Number(form.year), dailyRate: Number(form.dailyRate) };
    if (!editing) {
      delete payload.status;
    }
    try {
      if (editing) {
        await vehicleService.update(id, payload);
        navigate(`/vehicles/${id}`);
      } else {
        await vehicleService.create(payload);
        navigate('/vehicles');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <h1>{editing ? 'Editar veículo' : 'Novo veículo'}</h1>
      <form className="card" onSubmit={handleSubmit}>
        {error && <div className="alert error">{error}</div>}
        <div className="form-row">
          <label>Marca
            <input name="brand" value={form.brand} onChange={handleChange} required />
          </label>
          <label>Modelo
            <input name="model" value={form.model} onChange={handleChange} required />
          </label>
        </div>
        <div className="form-row">
          <label>Ano
            <input name="year" type="number" value={form.year} onChange={handleChange} required />
          </label>
          <label>Placa
            <input name="plate" value={form.plate} onChange={handleChange} placeholder="ABC1D23" required />
          </label>
        </div>
        <div className="form-row">
          <label>Cor
            <input name="color" value={form.color} onChange={handleChange} required />
          </label>
          <label>Valor da diária (R$)
            <input name="dailyRate" type="number" step="0.01" min="0" value={form.dailyRate} onChange={handleChange} required />
          </label>
        </div>
        {editing && (
          <label>Status
            <select name="status" value={form.status} onChange={handleChange} disabled={form.status === 'ALUGADO'}>
              <option value="DISPONIVEL">Disponível</option>
              <option value="MANUTENCAO">Manutenção</option>
              <option value="ALUGADO" disabled>Alugado</option>
            </select>
          </label>
        )}
        <div className="actions">
          <button className="btn" disabled={loading}>{loading ? 'Salvando...' : 'Salvar'}</button>
          <button type="button" className="btn btn-outline" onClick={() => navigate(-1)}>Cancelar</button>
        </div>
      </form>
    </>
  );
}
