import { expect } from 'chai';
import sinon from 'sinon-v20';
import { mockFetch } from 'platform/testing/unit/helpers';
import {
  CLEAR_SEARCH_RESULTS,
  CLEAR_SEARCH_TEXT,
  SEARCH_FAILED,
  SEARCH_QUERY_UPDATED,
  SEARCH_STARTED,
} from '../../actions/actionTypes';
import {
  clearSearchResults,
  clearSearchText,
  searchWithBounds,
  updateSearchQuery,
} from '../../actions/search';
import { LocationType } from '../../constants';
import * as helpers from '../../utils/mapHelpers';
import * as locations from '../../actions/locations';

describe('actions: search', () => {
  const dispatchSpy = sinon.spy();

  afterEach(() => {
    sinon.restore();
    dispatchSpy.resetHistory();
  });

  describe('clearSearchResults', () => {
    it('should return the correct action object', () => {
      const action = clearSearchResults();

      expect(action).to.eql({
        type: CLEAR_SEARCH_RESULTS,
      });
    });
  });

  describe('clearSearchText', () => {
    beforeEach(() => {
      mockFetch();
    });

    it('should return the correct action object', () => {
      return clearSearchText()(dispatchSpy).then(() => {
        expect(dispatchSpy.firstCall.args[0].type).to.deep.equal(
          CLEAR_SEARCH_TEXT,
        );
      });
    });
  });

  describe('searchWithBounds', () => {
    describe('when the address is not one of the designated addresses', () => {
      let locationsStub;

      beforeEach(() => {
        sinon
          .stub(helpers, 'reverseGeocodeBox')
          .returns(Promise.resolve({ address: '1234 Main Street' }));

        locationsStub = sinon
          .stub(locations, 'fetchLocations')
          .returns(Promise.resolve());
      });

      it('should return the correct action objects', () => {
        searchWithBounds({
          bounds: [-98.878222, 29.2380888, -98.118222, 29.998088799999998],
          facilityType: LocationType.HEALTH,
          serviceType: 'health',
          page: 1,
          center: null,
          radius: null,
        })(dispatchSpy);

        expect(dispatchSpy.firstCall.args[0]).to.deep.equal({
          type: SEARCH_STARTED,
          payload: {
            currentPage: 1,
            searchBoundsInProgress: true,
          },
        });

        expect(locationsStub.calledOnce).to.be.true;
      });
    });

    describe('when the address is CC_PROVIDER and the address is not returned', () => {
      beforeEach(() => {
        sinon.stub(helpers, 'reverseGeocodeBox').returns(Promise.resolve(null));
      });

      it('should return the correct action objects', async () => {
        await searchWithBounds({
          bounds: [-98.878222, 29.2380888, -98.118222, 29.998088799999998],
          facilityType: LocationType.CC_PROVIDER,
          serviceType: 'health',
          page: 1,
          center: null,
          radius: null,
        })(dispatchSpy);

        expect(dispatchSpy.firstCall.args[0]).to.deep.equal({
          type: SEARCH_STARTED,
          payload: {
            currentPage: 1,
            searchBoundsInProgress: true,
          },
        });

        expect(dispatchSpy.secondCall.args[0]).to.deep.equal({
          type: SEARCH_FAILED,
          error:
            'Reverse geocoding failed. See previous errors or network log.',
        });
      });
    });

    describe('when the address is CC_PROVIDER and the address is returned', () => {
      let locationsStub;

      beforeEach(() => {
        sinon
          .stub(helpers, 'reverseGeocodeBox')
          .returns(Promise.resolve({ address: '1234 Main Street' }));

        locationsStub = sinon
          .stub(locations, 'fetchLocations')
          .returns(Promise.resolve());
      });

      it('should return the correct action objects', async () => {
        await searchWithBounds({
          bounds: [-98.878222, 29.2380888, -98.118222, 29.998088799999998],
          facilityType: LocationType.CC_PROVIDER,
          serviceType: 'health',
          page: 1,
          center: null,
          radius: null,
        })(dispatchSpy);

        expect(dispatchSpy.firstCall.args[0]).to.deep.equal({
          type: SEARCH_STARTED,
          payload: {
            currentPage: 1,
            searchBoundsInProgress: true,
          },
        });

        expect(locationsStub.calledOnce).to.be.true;
      });
    });
  });

  describe('updateSearchQuery', () => {
    beforeEach(() => {
      mockFetch();
    });

    it('should fail if no query searchString', () => {
      const query = {
        searchString: 'test',
      };

      const action = updateSearchQuery(query);

      expect(action).to.eql({
        type: SEARCH_QUERY_UPDATED,
        payload: {
          searchString: 'test',
        },
      });
    });
  });
});
