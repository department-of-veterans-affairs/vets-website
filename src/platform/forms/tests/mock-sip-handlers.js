import { http, HttpResponse } from 'msw';
import { setupServer } from 'msw/node';

const defaultHandlers = [
  http.get('*', () => HttpResponse.json({})),
  http.post('*', () => HttpResponse.json({})),
  http.patch('*', () => HttpResponse.json({})),
  http.put('*', () => HttpResponse.json({})),
  http.delete('*', () => HttpResponse.json({})),
];

export const server = setupServer(...defaultHandlers);
