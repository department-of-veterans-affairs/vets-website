import { expect } from 'chai';
import sinon from 'sinon';
import { fetchMapBoxBBoxCoordinates } from '../../../actions/fetchMapBoxBBoxCoordinates';
import { mockMapBoxClient } from '../../mocks/mapBoxClient';
import { replaceStrValues } from '../../../utils/helpers';
import content from '../../../locales/en/content.json';

describe('CG fetchMapBoxBBoxCoordinates action', () => {
  const coordinates = [-82.452606, 27.964157, -80.452606, 29.964157];
  const successResponse = {
    send: sinon
      .stub()
      .resolves({ body: { features: [{ bbox: coordinates }] } }),
  };
  const mockClient = mockMapBoxClient();
  const clientStub = sinon
    .stub(mockClient, 'forwardGeocode')
    .returns(successResponse);

  context('when the query is omitted', () => {
    it('should return an error object', async () => {
      const response = await fetchMapBoxBBoxCoordinates('');
      expect(response).to.be.a('object');
      expect(response.errorMessage).to.eq(
        content['error--facility-search-cancelled'],
      );
    });
  });

  context('when the response succeeds', () => {
    it('should return an array of boundary coordinates when client is passed', async () => {
      const response = await fetchMapBoxBBoxCoordinates('Tampa', mockClient);
      expect(response).to.deep.eq(coordinates);
    });

    it('should return a `not found` response when coordinates do not match any location', async () => {
      clientStub.returns({
        send: sinon.stub().resolves({ body: { features: [{}] } }),
      });

      const response = await fetchMapBoxBBoxCoordinates('Dave', mockClient);
      expect(response).to.be.a('object');
      expect(response.errorMessage).to.eq(content['error--no-results-found']);
    });
  });

  context('when the response fails', () => {
    it('should render the error message string when error origin is not `mapbox.com`', async () => {
      const error = 'Some bad error occurred.';
      clientStub.returns({
        send: sinon.stub().rejects(error),
      });

      const response = await fetchMapBoxBBoxCoordinates('33618', mockClient);
      const errorMessage = replaceStrValues(
        content['error--facility-search-failed'],
        error,
      );
      expect(response).to.be.a('object');
      expect(response.errorMessage).to.eq(errorMessage);
    });

    it('should render the error body string when error origin is not `mapbox.com`', async () => {
      const error = 'Some bad error occurred.';
      clientStub.returns({
        send: sinon.stub().rejects({
          request: { origin: 'https://api.mapbox.com' },
          body: { message: error },
        }),
      });

      const response = await fetchMapBoxBBoxCoordinates('33618', mockClient);
      const errorMessage = replaceStrValues(
        content['error--facility-search-failed'],
        error,
      );
      expect(response).to.be.a('object');
      expect(response.errorMessage).to.eq(errorMessage);
    });
  });
});
