import { expect } from 'chai';
import sinon from 'sinon-v20';
import { fetchMapBoxGeocoding } from '../../../actions/fetchMapBoxGeocoding';
import { mockMapBoxClient } from '../../mocks/mapBoxClient';
import content from '../../../locales/en/content.json';

// declare error message content
const ERROR_MSG_NO_RESULTS = content['error--no-results-found'];
const ERROR_MSG_CANCELLED = content['error--facility-search-cancelled'];
const ERROR_MSG_FAILED = content['error--facility-search-failed'];

describe('CG fetchMapBoxGeocoding action', () => {
  const features = [{ fakeResponse: 'yep' }];
  const mockClient = mockMapBoxClient();
  const query = '33618';
  let clientStub;

  beforeEach(() => {
    clientStub = sinon.stub(mockClient, 'forwardGeocode').returns({
      send: sinon.stub().resolves({ body: { features } }),
    });
  });

  afterEach(() => {
    sinon.restore();
  });

  context('when the query is omitted', () => {
    it('should return an error object', async () => {
      const response = await fetchMapBoxGeocoding('');
      expect(response.errorMessage).to.eq(ERROR_MSG_CANCELLED);
    });
  });

  context('when the response succeeds', () => {
    it('should return an array of boundary coordinates when client is passed', async () => {
      const response = await fetchMapBoxGeocoding(query, mockClient);
      expect(response).to.deep.eq(features[0]);
    });

    it('should return a `not found` response when coordinates do not match any location', async () => {
      clientStub.returns({
        send: sinon.stub().resolves({ body: { features: undefined } }),
      });

      const response = await fetchMapBoxGeocoding(query, mockClient);
      expect(response.errorMessage).to.eq(ERROR_MSG_NO_RESULTS);
    });
  });

  context('when the response fails', () => {
    const errorMessage = 'Some bad error occurred.';
    let mockLogger;

    beforeEach(() => {
      mockLogger = { error: sinon.spy() };

      Object.defineProperty(window, 'DD_LOGS', {
        value: { logger: mockLogger },
        configurable: true,
      });
    });

    it('should log error to Datadog', async () => {
      const loggerMessage = 'Error fetching Mapbox coordinates';
      const error = {
        request: { origin: 'https://api.mapbox.com' },
        body: { message: errorMessage },
      };

      clientStub.returns({ send: sinon.stub().rejects(error) });

      await fetchMapBoxGeocoding(query, mockClient);
      sinon.assert.calledOnceWithExactly(
        mockLogger.error,
        loggerMessage,
        {},
        error,
      );
    });

    it('should render error message on error', async () => {
      clientStub.returns({
        send: sinon.stub().rejects(errorMessage),
      });

      const response = await fetchMapBoxGeocoding(query, mockClient);
      expect(response.errorMessage).to.eq(ERROR_MSG_FAILED);
    });
  });
});
