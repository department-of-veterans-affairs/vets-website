import { rest } from 'msw';
import { setupServer } from 'msw/node';
import { expect } from 'chai';
import { acceptPOARequest, declinePOARequest } from '../../actions/poaRequests';

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
        '/power_of_attorney_requests/:poaId/accept',
        (req, res, ctx) => {
          return res(ctx.json({ status: 'success' }));
        },
      ),
    );

    const response = await acceptPOARequest('12345');
    expect(response).to.eq({ status: 'success' });
  });

  it('handles declinePOARequest successfully', async () => {
    server.use(
      rest.post(
        '/power_of_attorney_requests/:poaId/decline',
        (req, res, ctx) => {
          return res(ctx.json({ status: 'success' }));
        },
      ),
    );

    const response = await declinePOARequest('12345');
    expect(response).to.eq({ status: 'success' });
  });

  it('returns an error status when the server responds with an error for accept', async () => {
    server.use(
      rest.post(
        '/power_of_attorney_requests/:poaId/accept',
        (req, res, ctx) => {
          return res(ctx.status(500));
        },
      ),
    );

    const response = await acceptPOARequest('12345');
    expect(response).to.eq({
      status: 'error',
      error: 'Server responded with status: 500',
    });
  });

  it('returns an error status when the server responds with an error for decline', async () => {
    server.use(
      rest.post(
        '/power_of_attorney_requests/:poaId/decline',
        (req, res, ctx) => {
          return res(ctx.status(500));
        },
      ),
    );

    const response = await declinePOARequest('12345');
    expect(response).to.eq({
      status: 'error',
      error: 'Server responded with status: 500',
    });
  });

  it('handles network errors gracefully for accept', async () => {
    server.use(
      rest.post('/power_of_attorney_requests/:poaId/accept', (req, res) => {
        return res.networkError('Failed to connect');
      }),
    );

    const response = await acceptPOARequest('12345');
    expect(response).to.eq({
      status: 'error',
      error: 'An unexpected error occurred.',
    });
  });

  it('handles network errors gracefully for decline', async () => {
    server.use(
      rest.post('/power_of_attorney_requests/:poaId/decline', (req, res) => {
        return res.networkError('Failed to connect');
      }),
    );

    const response = await declinePOARequest('12345');
    expect(response).to.eq({
      status: 'error',
      error: 'An unexpected error occurred.',
    });
  });
});
