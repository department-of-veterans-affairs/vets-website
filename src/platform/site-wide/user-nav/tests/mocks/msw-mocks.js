import { rest, http, HttpResponse } from 'msw';

const restOrHttp = rest || http;

export const headKeepAliveSuccess = restOrHttp.head(
  'https://int.eauth.va.gov/keepalive',
  () => new HttpResponse(null, { status: 200 }),
);
