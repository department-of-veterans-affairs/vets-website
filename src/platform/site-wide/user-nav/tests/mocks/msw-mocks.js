// Re-export rest from mocha-setup for consistency
import { rest } from 'platform/testing/unit/mocha-setup';

export const headKeepAliveSuccess = rest.head(
  'https://int.eauth.va.gov/keepalive',
  (req, res, ctx) => res(ctx.status(200)),
);
