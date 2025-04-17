import sinon from 'sinon';
import searchReducer, {
  uppercaseKeys,
  normalizedInstitutionFacets,
  derivePaging,
  buildSearchResults,
} from '../../reducers/search';

const { expect } = require('chai');

describe('SearchReducer', () => {
  describe('uppercasekeys function', () => {
    it('should return an object with keys in uppercase', () => {
      const obj = {
        name: 'John Doe',
        age: 25,
        country: 'USA',
      };

      const expected = {
        NAME: 'John Doe',
        AGE: 25,
        COUNTRY: 'USA',
      };

      const result = uppercaseKeys(obj);
      expect(result).to.deep.equal(expected);
    });

    it('should return an empty object if the input object is empty', () => {
      const obj = {};
      const expected = {};
      const result = uppercaseKeys(obj);
      expect(result).to.deep.equal(expected);
    });

    it('should not modify the original object', () => {
      const obj = {
        name: 'John Doe',
      };

      uppercaseKeys(obj);
      expect(obj).to.deep.equal({ name: 'John Doe' });
    });
  });

  describe('normalizedInstitutionFacets function', () => {
    it('should return facets with state keys in uppercase', () => {
      const facets = {
        state: {
          ny: 10,
          ca: 15,
        },
        provider: [],
      };

      const expected = {
        state: uppercaseKeys(facets.state),
        provider: [],
      };
      expect(normalizedInstitutionFacets(facets)).to.deep.equal(expected);
    });

    it('then should return facets with provider names in uppercase', () => {
      const nameOne = 'nameOne';
      const nameTwo = 'nameTwo';
      const facets = {
        state: {},
        provider: [
          { name: nameOne, count: 10 },
          { name: nameTwo, count: 15 },
        ],
      };

      const expected = {
        state: {},
        provider: [
          { name: nameOne.toUpperCase(), count: 10 },
          { name: nameTwo.toUpperCase(), count: 15 },
        ],
      };

      expect(normalizedInstitutionFacets(facets)).to.deep.equal(expected);
    });

    it('then should handle empty or missing provider array', () => {
      const facets = {
        state: {
          tx: 20,
        },
      };

      const expected = {
        state: uppercaseKeys(facets.state),
        provider: [],
      };

      expect(normalizedInstitutionFacets(facets)).to.deep.equal(expected);
    });

    it('then should handle other facets without modification', () => {
      const facets = {
        state: {
          fl: 30,
        },
        provider: [],
        category: ['A', 'B'],
      };

      const expected = {
        state: uppercaseKeys(facets.state),
        provider: [],
        category: ['A', 'B'],
      };

      expect(normalizedInstitutionFacets(facets)).to.deep.equal(expected);
    });
  });

  describe('derivePaging function', () => {
    it('it should get the currentPage number, totalPages number, perPage number from link', () => {
      const links = {
        self: 'https://some-url.com/data?page=1',
        last: 'https://some-url.com/data?page=50&per_page=10',
      };

      const selfPage = derivePaging(links);

      expect(selfPage.currentPage).to.equal(1);
      expect(selfPage.totalPages).to.equal(50);
      expect(selfPage.perPage).to.equal(10);
    });
  });

  describe('SearchReducer', () => {
    it('Should update current earch tab', () => {
      const initialState = {
        tab: 'name',
        error: 'error',
      };
      const action = {
        type: 'UPDATE_CURRENT_TAB',
        tab: 'new name',
        error: null,
      };

      const state = searchReducer(initialState, action);

      expect(state.tab).to.equal('new name');
      expect(state.error).to.be.null;
    });

    it('Should have SEARCH_STARTED', () => {
      const initialState = {
        query: {
          name: '',
          location: '',
          distance: '',
          latitude: null,
          longitude: null,
        },
        inProgress: false,
      };
      const myPayLoad = {
        query: {
          ...initialState.query,
          name: 'Jhon',
          location: 'New York',
          distance: '3,000 mile',
          latitude: '40.712776',
          longitude: '-74.005974',
        },
      };
      const action = {
        type: 'SEARCH_STARTED',
        payload: myPayLoad,
        inProgress: true,
      };

      const state = searchReducer(initialState, action);
      expect(state.inProgress).to.equal(true);
      expect(state.query.name).to.equal('');
      expect(state.query.location).to.equal('');
    });

    it('should through an Error when Search failed', () => {
      const initialState = {
        inProgress: true,
        error: null,
      };
      const action = {
        type: 'SEARCH_FAILED',
        inProgress: false,
        error: 'some error',
      };

      const state = searchReducer(initialState, action);

      expect(state.inProgress).to.equal(false);
      expect(state.error).not.to.be.null;
    });

    it('GEOCODE_STARTED', () => {
      const initialState = {
        query: { name: 'Mike' },
        geocodeInProgress: false,
      };
      const action = {
        type: 'GEOCODE_STARTED',
        payload: {
          location: 'California',
        },

        geocodeInProgress: true,
      };

      const state = searchReducer(initialState, action);

      expect(state.geocodeInProgress).to.equal(true);
      expect(state.query.location).to.equal('California');
      expect(state.query).to.deep.equal({
        name: 'Mike',
        location: 'California',
      });
    });

    it('GEOCODE_FAILED', () => {
      const initialState = {
        error: null,
        geocodeError: '',
        geolocationInProgress: null,
      };
      const action = {
        type: 'GEOCODE_FAILED',
        error: true,
        geocodeError: 'some error',
        geolocationInProgress: false,
      };

      const state = searchReducer(initialState, action);

      expect(state.geolocationInProgress).to.be.false;
    });

    it('GEOCODE_CLEAR_ERROR', () => {
      const initialState = {
        error: null,
        geocodeError: 1,
        geolocationInProgress: null,
      };
      const action = {
        type: 'GEOCODE_CLEAR_ERROR',
        error: false,
        geocodeError: 0,
        geolocationInProgress: false,
      };

      const state = searchReducer(initialState, action);

      expect(state.geolocationInProgress).to.be.false;
      expect(state.error).to.be.false;
    });

    it('GEOCODE_COMPLETE', () => {
      const initialState = {
        geolocationInProgress: true,
        query: {
          streetAddress: {
            searchString: '',
            position: {},
          },
        },
        error: null,
      };
      const action = {
        type: 'GEOCODE_COMPLETE',
        geolocationInProgress: false,
        payload: {
          searchString: '458 market st',
          position: {
            lat: 40.7128,
            lng: -74.006,
          },

          error: false,
        },
      };

      const state = searchReducer(initialState, action);
      expect(state.query.streetAddress.searchString).to.deep.equal(
        '458 market st',
      );
      expect(state.geolocationInProgress).to.equal(false);
    });

    it('GEOCODE_SUCCEEDED', () => {
      const initialState = {
        geocode: null,
        geocodeInProgress: true,
      };
      const action = {
        type: 'GEOCODE_SUCCEEDED',
        payload: {
          geocode: '000',
        },
        geocodeInProgress: false,
      };

      const state = searchReducer(initialState, action);

      expect(state.geocodeInProgress).to.equal(false);
      expect(state.geocode).to.deep.equal({ geocode: '000' });
    });

    it('GEOCODE_LOCATION_FAILED', () => {
      const initialState = {
        error: null,
        geocodeError: '',
        geolocationInProgress: true,
      };
      const action = {
        type: 'GEOCODE_LOCATION_FAILED',
        payload: {
          error: 'some error',
        },
        geocodeError: 'code error',
        geolocationInProgress: false,
      };

      const state = searchReducer(initialState, action);

      expect(state.geolocationInProgress).to.equal(false);
      expect(state.error).not.to.be.null;
    });

    it('GEOLOCATE_USER', () => {
      const initialState = {
        geolocationInProgress: false,
        query: {
          streetAddress: {
            searchString: '123 market st',
            position: {},
          },
        },
      };
      const action = {
        type: 'GEOLOCATE_USER',
        geolocationInProgress: true,
        query: {
          streetAddress: {
            searchString: '',
            position: {},
          },
        },
      };

      const state = searchReducer(initialState, action);

      expect(state.geolocationInProgress).to.equal(true);
      expect(state.query.streetAddress.searchString).to.equal('');
    });

    it('MAP_CHANGED', () => {
      const initialState = {
        query: {
          term: 'term one ',
          mapState: {
            zoom: 5,
            center: [10, 10],
          },
        },
      };
      const action = {
        type: 'MAP_CHANGED',
        payload: {
          zoom: 15,
          position: 'north',
        },
      };

      const state = searchReducer(initialState, action);
      expect(state.query.mapState.zoom).to.equal(15);
      expect(state.query.mapState.position).to.equal('north');
    });
  });
  describe('buildSearchResults', () => {
    const mockPayload = {
      data: [
        {
          id: 1,
          type: 'institutions',
          attributes: {
            facilityCode: '1',
            institutionName: 'Test University',
          },
        },
        {
          id: 2,
          type: 'institutions',
          attributes: {
            facilityCode: '2',
            institutionName: 'Another Test University',
          },
        },
      ],
      links: {
        self: 'http://api.example.com/institutions?page=1',
        last: 'http://api.example.com/institutions?page=10&per_page=10',
      },
      meta: {
        count: 2,
        facets: {
          category: {
            school: 2,
          },
          state: {
            ca: 1,
            ny: 1,
          },
          country: ['USA', 'Canada'],
          provider: [
            { name: 'provider1', count: 10 },
            { name: 'provider2', count: 5 },
          ],
        },
      },
    };
    let camelCaseKeysRecursiveStub;
    let normalizedInstitutionAttributesStub;
    let derivePagingStub;
    let normalizedInstitutionFacetsStub;

    beforeEach(() => {
      camelCaseKeysRecursiveStub = sinon.stub(uppercaseKeys, 'default');
      normalizedInstitutionAttributesStub = sinon.stub(
        normalizedInstitutionFacets,
        'default',
      );
      derivePagingStub = sinon.stub(derivePaging, 'default');
      normalizedInstitutionFacetsStub = sinon.stub(
        normalizedInstitutionFacets,
        'default',
      );
    });
    it('should return search results with correctly formatted data', () => {
      camelCaseKeysRecursiveStub.returns(mockPayload);
      normalizedInstitutionAttributesStub.callsFake(attrs => ({
        ...attrs,
        normalized: true,
      }));
      derivePagingStub.returns({ currentPage: 1, totalPages: 10, perPage: 10 });
      normalizedInstitutionFacetsStub.returns(mockPayload.meta.facets);

      const results = buildSearchResults(mockPayload);

      expect(results).to.have.keys([
        'results',
        'pagination',
        'facets',
        'count',
      ]);

      expect(results.results).to.be.an('array').that.is.not.empty;

      expect(results.pagination)
        .to.be.an('object')
        .that.has.all.keys(['currentPage', 'totalPages', 'perPage']);
      expect(results.pagination.currentPage).to.equal(1);

      expect(results.facets)
        .to.be.an('object')
        .that.has.all.keys(['category', 'state', 'country', 'provider']);
    });
  });
});
