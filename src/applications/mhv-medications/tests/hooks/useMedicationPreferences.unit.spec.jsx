import { expect } from 'chai';
import React from 'react';
import ReactDOM from 'react-dom';
import { act } from 'react-dom/test-utils';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import useMedicationPreferences from '../../hooks/useMedicationPreferences';
import {
  rxListSortingOptions,
  ALL_MEDICATIONS_FILTER_KEY,
  ACTIVE_FILTER_KEY,
  filterOptions,
} from '../../util/constants';

// Helper function to test hooks
function testHook(callback) {
  const container = document.createElement('div');
  let result = {};

  function TestComponent() {
    result = callback();
    return null;
  }

  act(() => {
    ReactDOM.render(<TestComponent />, container);
  });

  return { result };
}

describe('useMedicationPreferences', () => {
  const mockStore = configureStore([]);
  let store;
  let originalRender;

  beforeEach(() => {
    // Create a test div to render into
    document.body.innerHTML = '<div id="root"></div>';
    originalRender = ReactDOM.render;

    // Monkey patch ReactDOM.render to wrap with Provider
    ReactDOM.render = (element, container) => {
      return originalRender(
        <Provider store={store}>{element}</Provider>,
        container,
      );
    };
  });

  afterEach(() => {
    // Restore original render
    ReactDOM.render = originalRender;
    // Clean up DOM
    document.body.innerHTML = '';
  });

  it('should return default preferences when state has default values', () => {
    // Create mock store with default preferences
    store = mockStore({
      rx: {
        preferences: {
          sortOption: 'alphabeticallyByStatus',
          filterOption: ALL_MEDICATIONS_FILTER_KEY,
          pageNumber: 1,
        },
      },
      featureToggles: {
        // eslint-disable-next-line camelcase
        mhv_medications_display_grouping: false,
      },
    });

    // Test the hook
    const { result } = testHook(() => useMedicationPreferences());
    const [queryParams] = result;

    // Check that the query params match expected values
    expect(queryParams.page).to.equal(1);
    expect(queryParams.perPage).to.equal(20); // grouping flag is false, so perPage should be 20
    expect(queryParams.sortEndpoint).to.equal(
      rxListSortingOptions.alphabeticallyByStatus.API_ENDPOINT,
    );
    expect(queryParams.filterOption).to.equal(
      filterOptions[ALL_MEDICATIONS_FILTER_KEY].url,
    );
  });

  it('should adjust perPage to 10 when grouping flag is true', () => {
    // Create mock store with grouping flag enabled
    store = mockStore({
      rx: {
        preferences: {
          sortOption: 'alphabeticallyByStatus',
          filterOption: ALL_MEDICATIONS_FILTER_KEY,
          pageNumber: 1,
        },
      },
      featureToggles: {
        // eslint-disable-next-line camelcase
        mhv_medications_display_grouping: true,
      },
    });

    // Test the hook
    const { result } = testHook(() => useMedicationPreferences());
    const [queryParams] = result;

    // Check that perPage is 10 when grouping is enabled
    expect(queryParams.perPage).to.equal(10);
  });

  it('should use last filled first sorting when selected', () => {
    // Create mock store with last filled first sorting option
    store = mockStore({
      rx: {
        preferences: {
          sortOption: 'lastFilledFirst',
          filterOption: ALL_MEDICATIONS_FILTER_KEY,
          pageNumber: 1,
        },
      },
      featureToggles: {
        // eslint-disable-next-line camelcase
        mhv_medications_display_grouping: false,
      },
    });

    // Test the hook
    const { result } = testHook(() => useMedicationPreferences());
    const [queryParams] = result;

    // Check that the sort endpoint matches last filled first option
    expect(queryParams.sortEndpoint).to.equal(
      rxListSortingOptions.lastFilledFirst.API_ENDPOINT,
    );
  });

  it('should use alphabetical order sorting when selected', () => {
    // Create mock store with alphabetical order sorting option
    store = mockStore({
      rx: {
        preferences: {
          sortOption: 'alphabeticalOrder',
          filterOption: ALL_MEDICATIONS_FILTER_KEY,
          pageNumber: 1,
        },
      },
      featureToggles: {
        // eslint-disable-next-line camelcase
        mhv_medications_display_grouping: false,
      },
    });

    // Test the hook
    const { result } = testHook(() => useMedicationPreferences());
    const [queryParams] = result;

    // Check that the sort endpoint matches alphabetical order option
    expect(queryParams.sortEndpoint).to.equal(
      rxListSortingOptions.alphabeticalOrder.API_ENDPOINT,
    );
  });

  it('should apply active filter when selected', () => {
    // Create mock store with active filter option
    store = mockStore({
      rx: {
        preferences: {
          sortOption: 'alphabeticallyByStatus',
          filterOption: ACTIVE_FILTER_KEY,
          pageNumber: 1,
        },
      },
      featureToggles: {
        // eslint-disable-next-line camelcase
        mhv_medications_display_grouping: false,
      },
    });

    // Test the hook
    const { result } = testHook(() => useMedicationPreferences());
    const [queryParams] = result;

    // Check that the filter option matches active filter
    expect(queryParams.filterOption).to.equal(
      filterOptions[ACTIVE_FILTER_KEY].url,
    );
  });

  it('should handle page number changes', () => {
    // Create mock store with page 2
    store = mockStore({
      rx: {
        preferences: {
          sortOption: 'alphabeticallyByStatus',
          filterOption: ALL_MEDICATIONS_FILTER_KEY,
          pageNumber: 2,
        },
      },
      featureToggles: {
        // eslint-disable-next-line camelcase
        mhv_medications_display_grouping: false,
      },
    });

    // Test the hook
    const { result } = testHook(() => useMedicationPreferences());
    const [queryParams] = result;

    // Check that page number is 2
    expect(queryParams.page).to.equal(2);
  });

  it('should handle undefined sort option by using default', () => {
    // Create mock store with undefined sort option
    store = mockStore({
      rx: {
        preferences: {
          sortOption: undefined,
          filterOption: ALL_MEDICATIONS_FILTER_KEY,
          pageNumber: 1,
        },
      },
      featureToggles: {
        // eslint-disable-next-line camelcase
        mhv_medications_display_grouping: false,
      },
    });

    // Test the hook
    const { result } = testHook(() => useMedicationPreferences());
    const [queryParams] = result;

    // Should fall back to default sort option
    expect(queryParams.sortEndpoint).to.equal(
      rxListSortingOptions.alphabeticallyByStatus.API_ENDPOINT,
    );
  });

  it('should handle undefined filter option', () => {
    // Create mock store with undefined filter option
    store = mockStore({
      rx: {
        preferences: {
          sortOption: 'alphabeticallyByStatus',
          filterOption: undefined,
          pageNumber: 1,
        },
      },
      featureToggles: {
        // eslint-disable-next-line camelcase
        mhv_medications_display_grouping: false,
      },
    });

    // Test the hook
    const { result } = testHook(() => useMedicationPreferences());
    const [queryParams] = result;

    // Should have empty string for filter option
    expect(queryParams.filterOption).to.equal('');
  });

  it('should default page to 1 if pageNumber is undefined', () => {
    // Create mock store with undefined page number
    store = mockStore({
      rx: {
        preferences: {
          sortOption: 'alphabeticallyByStatus',
          filterOption: ALL_MEDICATIONS_FILTER_KEY,
          pageNumber: undefined,
        },
      },
      featureToggles: {
        // eslint-disable-next-line camelcase
        mhv_medications_display_grouping: false,
      },
    });

    // Test the hook
    const { result } = testHook(() => useMedicationPreferences());
    const [queryParams] = result;

    // Should default to page 1
    expect(queryParams.page).to.equal(1);
  });
});
