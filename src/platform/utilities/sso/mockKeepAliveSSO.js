export default function keepAlive() {
  const headers = new Headers();

  headers.set('session-alive', 'true');
  headers.set('session-timeout', 900);
  headers.set(
    'Access-Control-Expose-Headers',
    'session-alive, session-timeout',
  );

  const response = new Response(new Blob(), {
    status: 200,
    statusText: 'OK',
    headers,
  });

  return Promise.resolve(response);
}
