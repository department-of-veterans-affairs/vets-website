import { rest, HttpResponse } from 'msw';

export const headKeepAliveSuccess = rest.head(
  'https://int.eauth.va.gov/keepalive',
  () => new HttpResponse(null, { status: 200 }),
);
