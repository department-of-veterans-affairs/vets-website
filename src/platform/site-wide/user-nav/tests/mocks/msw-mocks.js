import { http, HttpResponse } from 'msw';

export const headKeepAliveSuccess = http.head(
  'https://int.eauth.va.gov/keepalive',
  () => new HttpResponse(null, { status: 200 }),
);
