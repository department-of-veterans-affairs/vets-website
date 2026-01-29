import React from 'react';
import PropTypes from 'prop-types';
import { expect } from 'chai';
import { waitFor, act, cleanup } from '@testing-library/react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import * as sinon from 'sinon';
import { MemoryRouter } from 'react-router-dom-v5-compat';
import { renderHook } from '../../testing-utils/renderHook';
import * as prescriptionsApiModule from '../../../api/prescriptionsApi';
import { useFetchPrescriptionsList } from '../../../hooks/MedicationsList/useFetchPrescriptionsList';
import {
  rxListSortingOptions,
  filterOptions,
  filterOptionsV2,
  ALL_MEDICATIONS_FILTER_KEY,
  ACTIVE_FILTER_KEY,
} from '../../../util/constants';

/**
 * Creates a test wrapper with Redux Provider and MemoryRouter
 * @param {Object} mockStore the mock Redux store
 * @param {number} page The page number to include as the initialEntries 'page' query parameter
 * @returns {React.Component} A React component wrapping children with Provider and MemoryRouter
 */
function createTestWrapper(mockStore, page = 1) {
  const Wrapper = ({ children }) => (
    <Provider store={mockStore}>
      <MemoryRouter initialEntries={[page !== null ? `/?page=${page}` : '']}>
        {children}
      </MemoryRouter>
    </Provider>
  );

  Wrapper.propTypes = {
    children: PropTypes.node.isRequired,
  };

  return Wrapper;
}

const baseState = {
  rx: {
    preferences: {
      pageNumber: 1,
      sortOption: 'alphabeticallyByStatus',
      filterOption: ALL_MEDICATIONS_FILTER_KEY,
    },
  },
  featureToggles: {
    loading: false,
    mhv_medications_cerner_pilot: false, // eslint-disable-line camelcase
    mhv_medications_v2_status_mapping: false, // eslint-disable-line camelcase
  },
};

/**
 * Creates a mock Redux store with default state
 * @param {Object} overrides - State overrides (deep merged with base state)
 * @returns {Object} Mock Redux store
 */
const createMockStore = (overrides = {}) => {
  const state = {
    ...baseState,
    ...overrides,
    rx: {
      ...baseState.rx,
      ...overrides.rx,
      preferences: {
        ...baseState.rx.preferences,
        ...overrides.rx?.preferences,
      },
    },
    featureToggles: {
      ...baseState.featureToggles,
      ...overrides.featureToggles,
    },
  };

  return configureStore([])(state);
};

const mockPrescriptionsData = {
  prescriptions: [
    { id: 1, prescriptionName: 'Test Med 1' },
    { id: 2, prescriptionName: 'Test Med 2' },
  ],
  pagination: { currentPage: 1, totalPages: 5, totalEntries: 10 },
  meta: {},
};

const getMockQueryResponse = (overrides = {}) => ({
  data: mockPrescriptionsData,
  error: undefined,
  isLoading: false,
  isFetching: false,
  ...overrides,
});

describe('useFetchPrescriptionsList', () => {
  let sandbox;
  let useGetPrescriptionsListQueryStub;

  beforeEach(() => {
    sandbox = sinon.createSandbox();
  });

  afterEach(() => {
    cleanup();
    sandbox.restore();
  });

  it('allows updating query params via setQueryParams', async () => {
    useGetPrescriptionsListQueryStub = sandbox
      .stub(prescriptionsApiModule, 'useGetPrescriptionsListQuery')
      .returns(getMockQueryResponse());

    const mockStore = createMockStore();
    const wrapper = createTestWrapper(mockStore);

    const { result } = renderHook(() => useFetchPrescriptionsList(), {
      wrapper,
    });

    await waitFor(() => {
      expect(result.current.setQueryParams).to.be.a('function');
    });

    act(() => {
      result.current.setQueryParams(prev => ({
        ...prev,
        page: 5,
      }));
    });

    await waitFor(() => {
      const lastCall =
        useGetPrescriptionsListQueryStub.lastCall ||
        useGetPrescriptionsListQueryStub.firstCall;
      expect(lastCall.args[0].page).to.equal(5);
    });
  });

  it('updates query params when currentPage changes from URL', async () => {
    useGetPrescriptionsListQueryStub = sandbox
      .stub(prescriptionsApiModule, 'useGetPrescriptionsListQuery')
      .returns(getMockQueryResponse());

    const mockStore = createMockStore();
    const wrapper = createTestWrapper(mockStore);

    renderHook(() => useFetchPrescriptionsList(), { wrapper });

    await waitFor(() => {
      const queryParams = useGetPrescriptionsListQueryStub.firstCall.args[0];
      expect(queryParams.page).to.equal(1);
    });
  });

  it('handles undefined filter option in Redux state', async () => {
    useGetPrescriptionsListQueryStub = sandbox
      .stub(prescriptionsApiModule, 'useGetPrescriptionsListQuery')
      .returns(getMockQueryResponse());

    const mockStore = createMockStore({
      rx: { preferences: { filterOption: undefined } },
    });
    const wrapper = createTestWrapper(mockStore);

    renderHook(() => useFetchPrescriptionsList(), { wrapper });

    await waitFor(() => {
      const queryParams = useGetPrescriptionsListQueryStub.firstCall.args[0];
      expect(queryParams.filterOption).to.equal('');
    });
  });

  it('handles undefined sort option in Redux state', async () => {
    useGetPrescriptionsListQueryStub = sandbox
      .stub(prescriptionsApiModule, 'useGetPrescriptionsListQuery')
      .returns(getMockQueryResponse());

    const mockStore = createMockStore({
      rx: { preferences: { sortOption: undefined } },
    });
    const wrapper = createTestWrapper(mockStore);

    renderHook(() => useFetchPrescriptionsList(), { wrapper });

    await waitFor(() => {
      const queryParams = useGetPrescriptionsListQueryStub.firstCall.args[0];
      // Should fall back to default sort option
      expect(queryParams.sortEndpoint).to.be.a('string');
    });
  });

  it('handles null currentPage from URL pagination', async () => {
    useGetPrescriptionsListQueryStub = sandbox
      .stub(prescriptionsApiModule, 'useGetPrescriptionsListQuery')
      .returns(getMockQueryResponse());

    const mockStore = createMockStore({
      rx: { preferences: { pageNumber: null } },
    });
    const wrapper = createTestWrapper(mockStore, null);

    renderHook(() => useFetchPrescriptionsList(), { wrapper });

    await waitFor(() => {
      const queryParams = useGetPrescriptionsListQueryStub.firstCall.args[0];
      // Should default to page 1 when currentPage is null
      expect(queryParams.page).to.equal(1);
    });
  });

  describe('returns expected data structure', () => {
    it('returns prescriptions data, error, loading state, and controls', async () => {
      useGetPrescriptionsListQueryStub = sandbox
        .stub(prescriptionsApiModule, 'useGetPrescriptionsListQuery')
        .returns(getMockQueryResponse());

      const mockStore = createMockStore();
      const wrapper = createTestWrapper(mockStore);

      const { result } = renderHook(() => useFetchPrescriptionsList(), {
        wrapper,
      });

      await waitFor(() => {
        expect(result.current.prescriptionsData).to.deep.equal(
          mockPrescriptionsData,
        );
        expect(result.current.prescriptionsApiError).to.be.undefined;
        expect(result.current.isLoading).to.be.false;
        expect(result.current.handlePageChange).to.be.a('function');
        expect(result.current.setQueryParams).to.be.a('function');
      });
    });

    it('returns loading true when isLoading is true', async () => {
      useGetPrescriptionsListQueryStub = sandbox
        .stub(prescriptionsApiModule, 'useGetPrescriptionsListQuery')
        .returns(getMockQueryResponse({ data: undefined, isLoading: true }));

      const mockStore = createMockStore();
      const wrapper = createTestWrapper(mockStore);

      const { result } = renderHook(() => useFetchPrescriptionsList(), {
        wrapper,
      });

      await waitFor(() => {
        expect(result.current.isLoading).to.be.true;
      });
    });

    it('returns loading true when isFetching is true', async () => {
      useGetPrescriptionsListQueryStub = sandbox
        .stub(prescriptionsApiModule, 'useGetPrescriptionsListQuery')
        .returns(getMockQueryResponse({ isFetching: true }));

      const mockStore = createMockStore();
      const wrapper = createTestWrapper(mockStore);

      const { result } = renderHook(() => useFetchPrescriptionsList(), {
        wrapper,
      });

      await waitFor(() => {
        expect(result.current.isLoading).to.be.true;
      });
    });

    it('returns error when API call fails', async () => {
      const mockError = { status: 500, message: 'Server error' };
      useGetPrescriptionsListQueryStub = sandbox
        .stub(prescriptionsApiModule, 'useGetPrescriptionsListQuery')
        .returns(getMockQueryResponse({ data: undefined, error: mockError }));

      const mockStore = createMockStore();
      const wrapper = createTestWrapper(mockStore);

      const { result } = renderHook(() => useFetchPrescriptionsList(), {
        wrapper,
      });

      await waitFor(() => {
        expect(result.current.prescriptionsApiError).to.deep.equal(mockError);
      });
    });
  });

  describe('query parameters', () => {
    it('builds query params with default page, perPage, sort, and filter', async () => {
      useGetPrescriptionsListQueryStub = sandbox
        .stub(prescriptionsApiModule, 'useGetPrescriptionsListQuery')
        .returns(getMockQueryResponse());

      const mockStore = createMockStore();
      const wrapper = createTestWrapper(mockStore);

      renderHook(() => useFetchPrescriptionsList(), { wrapper });

      await waitFor(() => {
        expect(useGetPrescriptionsListQueryStub.called).to.be.true;
        const queryParams = useGetPrescriptionsListQueryStub.firstCall.args[0];
        expect(queryParams.page).to.equal(1);
        expect(queryParams.perPage).to.equal(10);
        expect(queryParams.sortEndpoint).to.equal(
          rxListSortingOptions.alphabeticallyByStatus.API_ENDPOINT,
        );
        expect(queryParams.filterOption).to.equal('');
      });
    });

    it('uses selected sort option from Redux state', async () => {
      useGetPrescriptionsListQueryStub = sandbox
        .stub(prescriptionsApiModule, 'useGetPrescriptionsListQuery')
        .returns(getMockQueryResponse());

      const mockStore = createMockStore({
        rx: { preferences: { sortOption: 'lastFilledFirst' } },
      });
      const wrapper = createTestWrapper(mockStore);

      renderHook(() => useFetchPrescriptionsList(), { wrapper });

      await waitFor(() => {
        const queryParams = useGetPrescriptionsListQueryStub.firstCall.args[0];
        expect(queryParams.sortEndpoint).to.equal(
          rxListSortingOptions.lastFilledFirst.API_ENDPOINT,
        );
      });
    });

    it('uses selected filter option from Redux state', async () => {
      useGetPrescriptionsListQueryStub = sandbox
        .stub(prescriptionsApiModule, 'useGetPrescriptionsListQuery')
        .returns(getMockQueryResponse());

      const mockStore = createMockStore({
        rx: { preferences: { filterOption: ACTIVE_FILTER_KEY } },
      });
      const wrapper = createTestWrapper(mockStore);

      renderHook(() => useFetchPrescriptionsList(), { wrapper });

      await waitFor(() => {
        const queryParams = useGetPrescriptionsListQueryStub.firstCall.args[0];
        expect(queryParams.filterOption).to.equal(
          filterOptions[ACTIVE_FILTER_KEY].url,
        );
      });
    });

    it('uses V2 filter options when both Cerner pilot and V2 status mapping flags are true', async () => {
      useGetPrescriptionsListQueryStub = sandbox
        .stub(prescriptionsApiModule, 'useGetPrescriptionsListQuery')
        .returns(getMockQueryResponse());

      const mockStore = createMockStore({
        rx: { preferences: { filterOption: ACTIVE_FILTER_KEY } },
        featureToggles: {
          mhv_medications_cerner_pilot: true, // eslint-disable-line camelcase
          mhv_medications_v2_status_mapping: true, // eslint-disable-line camelcase
        },
      });
      const wrapper = createTestWrapper(mockStore);

      renderHook(() => useFetchPrescriptionsList(), { wrapper });

      await waitFor(() => {
        const queryParams = useGetPrescriptionsListQueryStub.firstCall.args[0];
        expect(queryParams.filterOption).to.equal(
          filterOptionsV2[ACTIVE_FILTER_KEY].url,
        );
      });
    });

    it('syncs page from URL to query params', async () => {
      useGetPrescriptionsListQueryStub = sandbox
        .stub(prescriptionsApiModule, 'useGetPrescriptionsListQuery')
        .returns(getMockQueryResponse());

      const mockStore = createMockStore({
        rx: { preferences: { pageNumber: 3 } },
      });
      const wrapper = createTestWrapper(mockStore, 3);

      renderHook(() => useFetchPrescriptionsList(), { wrapper });

      await waitFor(() => {
        const queryParams = useGetPrescriptionsListQueryStub.firstCall.args[0];
        expect(queryParams.page).to.equal(3);
      });
    });
  });

  describe('feature flag handling', () => {
    it('uses V1 filter options when only Cerner pilot flag is true', async () => {
      useGetPrescriptionsListQueryStub = sandbox
        .stub(prescriptionsApiModule, 'useGetPrescriptionsListQuery')
        .returns(getMockQueryResponse());

      const mockStore = createMockStore({
        rx: { preferences: { filterOption: ACTIVE_FILTER_KEY } },
        featureToggles: {
          mhv_medications_cerner_pilot: true, // eslint-disable-line camelcase
        },
      });
      const wrapper = createTestWrapper(mockStore);

      renderHook(() => useFetchPrescriptionsList(), { wrapper });

      await waitFor(() => {
        const queryParams = useGetPrescriptionsListQueryStub.firstCall.args[0];
        expect(queryParams.filterOption).to.equal(
          filterOptions[ACTIVE_FILTER_KEY].url,
        );
      });
    });

    it('uses V1 filter options when only V2 status mapping flag is true', async () => {
      useGetPrescriptionsListQueryStub = sandbox
        .stub(prescriptionsApiModule, 'useGetPrescriptionsListQuery')
        .returns(getMockQueryResponse());

      const mockStore = createMockStore({
        rx: { preferences: { filterOption: ACTIVE_FILTER_KEY } },
        featureToggles: {
          mhv_medications_v2_status_mapping: true, // eslint-disable-line camelcase
        },
      });
      const wrapper = createTestWrapper(mockStore);

      renderHook(() => useFetchPrescriptionsList(), { wrapper });

      await waitFor(() => {
        const queryParams = useGetPrescriptionsListQueryStub.firstCall.args[0];
        expect(queryParams.filterOption).to.equal(
          filterOptions[ACTIVE_FILTER_KEY].url,
        );
      });
    });
  });
});
