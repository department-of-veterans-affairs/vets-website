import { expect } from 'chai';
import sinon from 'sinon';
import { fetchMapBoxGeocoding } from '../../../actions/fetchMapBoxGeocoding';
import { mockMapBoxClient } from '../../mocks/mapBoxClient';
import { replaceStrValues } from '../../../utils/helpers';
import content from '../../../locales/en/content.json';

describe('CG fetchMapBoxGeocoding action', () => {
  const features = [{ fakeResponse: 'yep' }];
  const successResponse = {
    send: sinon.stub().resolves({ body: { features } }),
  };
  const mockClient = mockMapBoxClient();
  let clientStub;

  beforeEach(() => {
    clientStub = sinon
      .stub(mockClient, 'forwardGeocode')
      .returns(successResponse);
  });

  afterEach(() => {
    clientStub.restore();
  });

  context('when the query is omitted', () => {
    it('should return an error object', async () => {
      const response = await fetchMapBoxGeocoding('');
      expect(response).to.be.a('object');
      expect(response.errorMessage).to.eq(
        content['error--facility-search-cancelled'],
      );
    });
  });

  context('when the response succeeds', () => {
    it('should return an array of boundary coordinates when client is passed', async () => {
      const response = await fetchMapBoxGeocoding('Tampa', mockClient);
      expect(response).to.deep.eq(features[0]);
    });

    it('should return a `not found` response when coordinates do not match any location', async () => {
      clientStub.returns({
        send: sinon.stub().resolves({ body: { features: undefined } }),
      });

      const response = await fetchMapBoxGeocoding('Dave', mockClient);
      expect(response).to.be.a('object');
      expect(response.errorMessage).to.eq(content['error--no-results-found']);
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

      await fetchMapBoxGeocoding('33618', mockClient);
      expect(mockLogger.error.calledWith(loggerMessage, {}, error)).to.be.true;
    });

    it('should render the error message string when error origin is not `mapbox.com`', async () => {
      clientStub.returns({
        send: sinon.stub().rejects(errorMessage),
      });

      const response = await fetchMapBoxGeocoding('33618', mockClient);
      const expectedMessage = replaceStrValues(
        content['error--facility-search-failed'],
        errorMessage,
      );
      expect(response).to.be.a('object');
      expect(response.errorMessage).to.eq(expectedMessage);
    });

    it('should render the error body string when error origin is not `mapbox.com`', async () => {
      clientStub.returns({
        send: sinon.stub().rejects({
          request: { origin: 'https://api.mapbox.com' },
          body: { message: errorMessage },
        }),
      });

      const response = await fetchMapBoxGeocoding('33618', mockClient);
      const expectedMessage = replaceStrValues(
        content['error--facility-search-failed'],
        errorMessage,
      );
      expect(response).to.be.a('object');
      expect(response.errorMessage).to.eq(expectedMessage);
    });
  });
});
