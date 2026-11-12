import { request } from './api.js';

export function list(status) {
  const query = status ? `?status=${status}` : '';
  return request(`/vehicles${query}`);
}

export function get(id) {
  return request(`/vehicles/${id}`);
}

export function create(data) {
  return request('/vehicles', { method: 'POST', body: data });
}

export function update(id, data) {
  return request(`/vehicles/${id}`, { method: 'PUT', body: data });
}

export function remove(id) {
  return request(`/vehicles/${id}`, { method: 'DELETE' });
}
