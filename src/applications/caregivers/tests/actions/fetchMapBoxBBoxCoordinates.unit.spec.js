import { expect } from 'chai';
import { fetchMapBoxBBoxCoordinates } from '../../actions/fetchMapBoxBBoxCoordinates';
import { mockMapBoxClient } from '../mocks/mapBoxClient';

describe('fetchMapBoxBBoxCoordinates', () => {
  context('when no query is provided', () => {
    it('should return an error object', async () => {
      const mapBoxResponse = await fetchMapBoxBBoxCoordinates(
        '',
        mockMapBoxClient(-82.452606, 27.964157, -80.452606, 29.964157),
      );

      expect(mapBoxResponse).to.be.a('object');
      expect(mapBoxResponse.errorMessage).to.eq(
        'Empty search string. Search cancelled.',
      );
    });
  });

  context('when the response is successful', () => {
    it('should return an array of boundary coordinates', () => {
      return fetchMapBoxBBoxCoordinates(
        'Tampa',
        mockMapBoxClient(-82.452606, 27.964157, -80.452606, 29.964157),
      ).then(data => {
        expect(data).to.deep.eq([-82.452606, 27.964157, -80.452606, 29.964157]);
      });
    });
  });

  context('when the response is not successful', () => {
    it('should return an error object', async () => {
      return fetchMapBoxBBoxCoordinates('33618', mockMapBoxClient()).catch(
        error => {
          expect(error).to.be.a('object');
          expect(error.errorMessage).to.eq(
            'Something went wrong. Some bad error occurred.',
          );
        },
      );
    });
  });
});
