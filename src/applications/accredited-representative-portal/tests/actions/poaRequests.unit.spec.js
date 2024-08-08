import { expect } from 'chai';
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import environment from '~/platform/utilities/environment';

import {
  acceptPOARequest,
  declinePOARequest,
  getPOARequestsByCodes,
} from '../../actions/poaRequests';
import mockPOARequestsResponse from '../../mocks/mockPOARequestsResponse.json';

const API_PREFIX = `${environment.API_URL}/accredited_representative_portal/v0`;
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
        `${API_PREFIX}/power_of_attorney_requests/:procId/accept`,
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
        `${API_PREFIX}/power_of_attorney_requests/:procId/decline`,
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
        `${API_PREFIX}/power_of_attorney_requests/:procId/accept`,
        (_, res, ctx) => {
          return res(ctx.status(500));
        },
      ),
    );

    try {
      await acceptPOARequest('12345');
    } catch (error) {
      expect(error.status).to.eq(500);
      expect(error.statusText).to.eq('Internal Server Error');
    }
  });

  it('returns an error status when the server responds with an error for decline', async () => {
    server.use(
      rest.post(
        `${API_PREFIX}/power_of_attorney_requests/:procId/decline`,
        (_, res, ctx) => {
          return res(ctx.status(500));
        },
      ),
    );

    try {
      await declinePOARequest('12345');
    } catch (error) {
      expect(error.status).to.eq(500);
      expect(error.statusText).to.eq('Internal Server Error');
    }
  });

  it('handles network errors gracefully for accept', async () => {
    server.use(
      rest.post(
        `${API_PREFIX}/power_of_attorney_requests/:procId/accept`,
        (_, res, ctx) => {
          return res(ctx.status(503));
        },
      ),
    );

    try {
      await acceptPOARequest('12345');
    } catch (error) {
      expect(error.status).to.eq(503);
      expect(error.statusText).to.eq('Service Unavailable');
    }
  });

  it('handles network errors gracefully for decline', async () => {
    server.use(
      rest.post(
        `${API_PREFIX}/power_of_attorney_requests/:procId/decline`,
        (_, res, ctx) => {
          return res(ctx.status(503));
        },
      ),
    );

    try {
      await declinePOARequest('12345');
    } catch (error) {
      expect(error.status).to.eq(503);
      expect(error.statusText).to.eq('Service Unavailable');
    }
  });
});

describe('POA Requests Retrieval', () => {
  it('retrieves POA requests successfully for multiple codes', async () => {
    const testPoaCodes = 'AB123,CD456';
    server.use(
      rest.get(`${API_PREFIX}/power_of_attorney_requests`, (req, res, ctx) => {
        const queryPoaCodes = req.url.searchParams.get('poa_codes');
        if (queryPoaCodes === testPoaCodes) {
          return res(ctx.json(mockPOARequestsResponse), ctx.status(200));
        }
        return res(ctx.status(404));
      }),
    );

    const response = await getPOARequestsByCodes(testPoaCodes);
    expect(response.data).to.eql(mockPOARequestsResponse.data);
    expect(response.meta.totalRecords).to.eq(
      mockPOARequestsResponse.meta.totalRecords,
    );
  });

  it('returns an error status when the server responds with an error', async () => {
    server.use(
      rest.get(`${API_PREFIX}/power_of_attorney_requests`, (_, res, ctx) => {
        return res(ctx.status(500));
      }),
    );

    try {
      await getPOARequestsByCodes('AB123');
    } catch (error) {
      expect(error.status).to.eq(500);
      expect(error.statusText).to.eq('Internal Server Error');
    }
  });

  it('handles network errors gracefully', async () => {
    server.use(
      rest.get(`${API_PREFIX}/power_of_attorney_requests`, (_, res, ctx) => {
        return res(ctx.status(503));
      }),
    );

    try {
      await getPOARequestsByCodes('AB123');
    } catch (error) {
      expect(error.status).to.eq(503);
      expect(error.statusText).to.eq('Service Unavailable');
    }
  });
});
