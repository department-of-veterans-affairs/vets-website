import { http } from 'msw';
import { setupServer } from 'msw/node';

function getResponse() {
  return new Response(null, {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
    },
  });
}

const defaultHandlers = [
  http.get('*', () => getResponse()),
  http.post('*', () => getResponse()),
  http.patch('*', () => getResponse()),
  http.put('*', () => getResponse()),
  http.delete('*', () => getResponse()),
];

export const server = setupServer(...defaultHandlers);
