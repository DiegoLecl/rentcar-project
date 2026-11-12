import { request } from './api.js';

export function stats() {
  return request('/dashboard');
}
