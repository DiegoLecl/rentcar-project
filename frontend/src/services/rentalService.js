import { request } from './api.js';

export function list() {
  return request('/rentals');
}

export function create(data) {
  return request('/rentals', { method: 'POST', body: data });
}

export function giveBack(id) {
  return request(`/rentals/${id}/return`, { method: 'PATCH' });
}
