import { expect } from 'chai';
import {
  createGetHandler,
  jsonResponse,
  networkError,
  setupServer,
} from 'platform/testing/unit/msw-adapter';
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
    isNetworkError = false,
  } = {}) => {
    if (isNetworkError) {
      server.use(
        createGetHandler(
          `https://dev-api.va.gov/representation_management/v0/power_of_attorney`,
          () => networkError('Network error'),
        ),
      );
    } else {
      server.use(
        createGetHandler(
          `https://dev-api.va.gov/representation_management/v0/power_of_attorney`,
          () => {
            return jsonResponse(json, { status });
          },
        ),
      );
    }
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
    createResponse({ isNetworkError: true });

    try {
      await RepresentativeStatusApi.getRepresentativeStatus();
    } catch (error) {
      expect(error.message).to.contain(mockError.message);
    }
  });
});
