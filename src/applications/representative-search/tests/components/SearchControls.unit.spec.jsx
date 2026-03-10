import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';
import thunk from 'redux-thunk';
import configureMockStore from 'redux-mock-store';
import { Provider } from 'react-redux';
import { mount } from 'enzyme';
import { mockApiRequest } from '@department-of-veterans-affairs/platform-testing/helpers';
import SearchControls from '../../components/search/SearchControls';

describe('SearchResults', () => {
  const mockStore = configureMockStore([thunk]);
  let store;

  const mockOnChange = sinon.stub();
  const mockOnSubmit = sinon.stub();
  const currentQuery = {
    representativeType: 'veteran_service_officer',
  };

  beforeEach(() => {
    store = mockStore({
      featureToggles: {
        // eslint-disable-next-line camelcase
        find_a_representative_enabled: true,
      },
      searchQuery: {
        organizations: [],
      },
    });
    mockApiRequest([{ data: { attributes: { name: 'VSO Org' } } }]);
  });
  describe('VSO filter options feature flag enabled', () => {
    it('should display VSO filter box when VSO is selected', () => {
      const wrapper = mount(
        <Provider store={store}>
          <SearchControls
            onChange={mockOnChange}
            onSubmit={mockOnSubmit}
            currentQuery={currentQuery}
            geocodeError={0}
            locationChanged={false}
          />
        </Provider>,
      );

      expect(wrapper.find('.organization-select')).to.have.lengthOf(1);
      wrapper.unmount();
    });

    it('should not display VSO filter box when attorney is selected', () => {
      const wrapper = mount(
        <Provider store={store}>
          <SearchControls
            onChange={mockOnChange}
            onSubmit={mockOnSubmit}
            currentQuery={{
              representativeType: 'attorney',
            }}
            geocodeError={0}
            locationChanged={false}
          />
        </Provider>,
      );

      expect(wrapper.find('.organization-select')).to.have.lengthOf(0);
      wrapper.unmount();
    });
  });
  describe('VSO filter options feature flag disabled', () => {
    beforeEach(() => {
      store = mockStore({
        featureToggles: {
          // eslint-disable-next-line camelcase
          find_a_representative_enabled: false,
        },
        searchQuery: {
          organizations: [],
        },
      });
    });
    it('should not display VSO filter box when VSO is selected', () => {
      const wrapper = mount(
        <Provider store={store}>
          <SearchControls
            onChange={mockOnChange}
            onSubmit={mockOnSubmit}
            currentQuery={currentQuery}
            geocodeError={0}
            locationChanged={false}
          />
        </Provider>,
      );

      expect(wrapper.find('.organization-select')).to.have.lengthOf(0);
      wrapper.unmount();
    });
    it('should not display VSO filter box when attorney is selected', () => {
      const wrapper = mount(
        <Provider store={store}>
          <SearchControls
            onChange={mockOnChange}
            onSubmit={mockOnSubmit}
            currentQuery={{
              representativeType: 'attorney',
            }}
            geocodeError={0}
            locationChanged={false}
          />
        </Provider>,
      );

      expect(wrapper.find('.organization-select')).to.have.lengthOf(0);
      wrapper.unmount();
    });
  });
});
