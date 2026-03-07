import React from 'react';
import { expect } from 'chai';
import thunk from 'redux-thunk';
import configureMockStore from 'redux-mock-store';
import { Provider } from 'react-redux';
import { render } from '@testing-library/react';
import { mockApiRequest } from '@department-of-veterans-affairs/platform-testing/helpers';
import SearchControls from '../../components/search/SearchControls';

describe('SearchResults', () => {
  const mockStore = configureMockStore([thunk]);
  let store;

  beforeEach(() => {
    mockApiRequest([{ data: { attributes: { name: 'VSO Org' } } }]);
  });
  describe('VSO filter options feature flag enabled', () => {
    it('should display VSO filter box when VSO is selected', async () => {
      store = mockStore({
        featureToggles: {
          // eslint-disable-next-line camelcase
          find_a_representative_enabled: true,
        },
        searchQuery: {
          organizations: [],
        },
        currentQuery: { representativeType: 'veteran_service_officer' },
        errors: {
          isErrorGeocode: false,
        },
      });
      const { findByTestId } = render(
        <Provider store={store}>
          <SearchControls locationChanged={false} />
        </Provider>,
      );

      await findByTestId('vso-org-filter');
    });

    it('should not display VSO filter box when attorney is selected', () => {
      store = mockStore({
        featureToggles: {
          // eslint-disable-next-line camelcase
          find_a_representative_enabled: true,
        },
        searchQuery: {
          organizations: [],
        },
        currentQuery: { representativeType: 'attorney' },
        errors: {
          isErrorGeocode: false,
        },
      });
      const { queryByTestId } = render(
        <Provider store={store}>
          <SearchControls locationChanged={false} />
        </Provider>,
      );

      expect(queryByTestId('vso-org-filter')).to.be.null;
    });
  });
  describe('VSO filter options feature flag disabled', () => {
    it('should not display VSO filter box when VSO is selected', () => {
      store = mockStore({
        featureToggles: {
          // eslint-disable-next-line camelcase
          find_a_representative_enabled: false,
        },
        searchQuery: {
          organizations: [],
        },
        currentQuery: { representativeType: 'veteran_service_officer' },
        errors: {
          isErrorGeocode: false,
        },
      });
      const { queryByTestId } = render(
        <Provider store={store}>
          <SearchControls locationChanged={false} />
        </Provider>,
      );
      expect(queryByTestId('vso-org-filter')).to.be.null;
    });
    it('should not display VSO filter box when attorney is selected', () => {
      store = mockStore({
        featureToggles: {
          // eslint-disable-next-line camelcase
          find_a_representative_enabled: false,
        },
        searchQuery: {
          organizations: [],
        },
        currentQuery: { representativeType: 'attorney' },
        errors: {
          isErrorGeocode: false,
        },
      });
      const { queryByTestId } = render(
        <Provider store={store}>
          <SearchControls locationChanged={false} />
        </Provider>,
      );
      expect(queryByTestId('vso-org-filter')).to.be.null;
    });
  });
});
