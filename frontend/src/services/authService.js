import { request } from './api.js';

export function login(email, password) {
  localStorage.removeItem('token');
  return request('/auth/login', { method: 'POST', body: { email, password } });
}

export function register(data) {
  return request('/auth/register', { method: 'POST', body: data });
}
