import { expect } from 'chai';
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import RepresentativeStatusApi from '../api/RepresentativeStatusApi';

describe('RepresentativeStatusApi', () => {
  const server = setupServer();

  before(() => {
    server.listen();
  });

  after(() => {
    server.close();
  });

  const createResponse = ({
    status = 200,
    json = {},
    networkError = false,
  } = {}) => {
    if (networkError) {
      server.use(
        rest.get(
          `https://dev-api.va.gov/representation_management/v0/power_of_attorney`,
          (_, res) => res.networkError(),
        ),
      );
    }
    server.use(
      rest.get(
        `https://dev-api.va.gov/representation_management/v0/power_of_attorney`,
        (_, res, ctx) => res(ctx.status(status), ctx.json(json)),
      ),
    );
  };

  it('should fetch and return representative status successfully', async () => {
    createResponse({ json: { id: '074' } });

    const result = await RepresentativeStatusApi.getRepresentativeStatus();

    expect(result).to.contains({ id: '074' });
  });

  it('should throw an error if the response is not ok', async () => {
    createResponse({ status: 400, json: {} });

    try {
      await RepresentativeStatusApi.getRepresentativeStatus();
    } catch (error) {
      expect(error.message).to.equal('Bad Request');
    }
  });

  it('should handle errors', async () => {
    const mockError = new Error('Network error');
    createResponse({ networkError: true });

    try {
      await RepresentativeStatusApi.getRepresentativeStatus();
    } catch (error) {
      expect(error.message).to.equal(mockError.message);
    }
  });
});
