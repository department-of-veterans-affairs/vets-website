import { rest } from 'msw';
import { setupServer } from 'msw/node';
import { expect } from 'chai';
import { acceptPOARequest, declinePOARequest } from '../../actions/poaRequests';
import environment from '~/platform/utilities/environment';

const prefix = `${environment.API_URL}/v0/accredited_representative_portal`;
const server = setupServer();

beforeEach(() => server.listen());
afterEach(() => {
  server.resetHandlers();
  server.close();
});

describe('POA Request Handling', () => {
  it('handles acceptPOARequest successfully', async () => {
    server.use(
      rest.post(
        `${prefix}/v0/power_of_attorney_requests/:poaId/accept`,
        (_, res, ctx) => {
          return res(ctx.json({ status: 'success' }), ctx.status(200));
        },
      ),
    );

    const response = await acceptPOARequest('12345');
    expect(response).to.eql({ status: 'success' });
  });

  it('handles declinePOARequest successfully', async () => {
    server.use(
      rest.post(
        `${prefix}/v0/power_of_attorney_requests/:poaId/decline`,
        (_, res, ctx) => {
          return res(ctx.json({ status: 'success' }), ctx.status(200));
        },
      ),
    );

    const response = await declinePOARequest('12345');
    expect(response).to.eql({ status: 'success' });
  });

  it('returns an error status when the server responds with an error for accept', async () => {
    server.use(
      rest.post(
        `${prefix}/v0/power_of_attorney_requests/:poaId/accept`,
        (_, res, ctx) => {
          return res(ctx.status(500));
        },
      ),
    );

    const response = await acceptPOARequest('12345');
    expect(response.status).to.equal(500);
    expect(response.statusText).to.equal('Internal Server Error');
  });

  it('returns an error status when the server responds with an error for decline', async () => {
    server.use(
      rest.post(
        `${prefix}/v0/power_of_attorney_requests/:poaId/decline`,
        (_, res, ctx) => {
          return res(ctx.status(500));
        },
      ),
    );

    const response = await declinePOARequest('12345');
    expect(response.status).to.equal(500);
    expect(response.statusText).to.equal('Internal Server Error');
  });

  it('handles network errors gracefully for accept', async () => {
    server.use(
      rest.post(
        `${prefix}/v0/power_of_attorney_requests/:poaId/accept`,
        (_, res, ctx) => {
          return res(ctx.status(503));
        },
      ),
    );

    const response = await acceptPOARequest('12345');
    expect(response.status).to.equal(503);
    expect(response.statusText).to.equal('Service Unavailable');
  });

  it('handles network errors gracefully for decline', async () => {
    server.use(
      rest.post(
        `${prefix}/v0/power_of_attorney_requests/:poaId/decline`,
        (_, res, ctx) => {
          return res(ctx.status(503));
        },
      ),
    );

    const response = await declinePOARequest('12345');
    expect(response.status).to.equal(503);
    expect(response.statusText).to.equal('Service Unavailable');
  });
});
