import React from 'react';
import PropTypes from 'prop-types';
import { expect } from 'chai';
import { waitFor, act, cleanup } from '@testing-library/react';
import { renderHook } from '@testing-library/react-hooks';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import * as sinon from 'sinon';
import { MemoryRouter } from 'react-router-dom-v5-compat';
import * as prescriptionsApiModule from '../../../api/prescriptionsApi';
import { useFetchMedicationHistory } from '../../../hooks/MedicationHistory/useFetchMedicationHistory';
import {
  rxListSortingOptions,
  rxListSortingOptionsV2,
  ALL_MEDICATIONS_FILTER_KEY,
  ACTIVE_FILTER_KEY,
} from '../../../util/constants';
import { getFilterUrl } from '../../../components/MedicationHistory/MedicationHistoryFilter';

const CERNER_PILOT_TOGGLE = 'mhv_medications_cerner_pilot';
const V2_STATUS_MAPPING_TOGGLE = 'mhv_medications_v2_status_mapping';
const MANAGEMENT_IMPROVEMENTS_TOGGLE =
  'mhv_medications_management_improvements';

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
      sortOption: 'alphabeticallyByStatus',
      filterOption: ALL_MEDICATIONS_FILTER_KEY,
    },
  },
  featureToggles: {
    loading: false,
    [CERNER_PILOT_TOGGLE]: false,
    [V2_STATUS_MAPPING_TOGGLE]: false,
    [MANAGEMENT_IMPROVEMENTS_TOGGLE]: false,
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
    {
      prescriptionId: 1,
      prescriptionName: 'ACETAMINOPHEN 325MG TAB',
      refillStatus: 'active',
    },
    {
      prescriptionId: 2,
      prescriptionName: 'LISINOPRIL 10MG TAB',
      refillStatus: 'active',
    },
  ],
  meta: {
    pagination: {
      currentPage: 1,
      perPage: 10,
      totalPages: 5,
      totalEntries: 50,
    },
  },
};

const getMockQueryResponse = (overrides = {}) => ({
  data: mockPrescriptionsData,
  error: undefined,
  isLoading: false,
  isFetching: false,
  ...overrides,
});

describe('useFetchMedicationHistory', () => {
  let sandbox;
  let useGetPrescriptionsListQueryStub;

  beforeEach(() => {
    sandbox = sinon.createSandbox();
  });

  afterEach(() => {
    cleanup();
    sandbox.restore();
  });

  describe('returns expected data structure', () => {
    it('returns prescriptions data, error, loading state, and controls', async () => {
      useGetPrescriptionsListQueryStub = sandbox
        .stub(prescriptionsApiModule, 'useGetPrescriptionsListQuery')
        .returns(getMockQueryResponse());

      const mockStore = createMockStore();
      const wrapper = createTestWrapper(mockStore);

      const { result } = renderHook(() => useFetchMedicationHistory(), {
        wrapper,
      });

      await waitFor(() => {
        expect(result.current.prescriptions).to.deep.equal(
          mockPrescriptionsData.prescriptions,
        );
        expect(result.current.prescriptionsData).to.deep.equal(
          mockPrescriptionsData,
        );
        expect(result.current.prescriptionsApiError).to.be.undefined;
        expect(result.current.isLoading).to.be.false;
        expect(result.current.setQueryParams).to.be.a('function');
        expect(result.current.currentPage).to.equal(1);
      });
    });

    it('returns empty array when no prescriptions data', async () => {
      useGetPrescriptionsListQueryStub = sandbox
        .stub(prescriptionsApiModule, 'useGetPrescriptionsListQuery')
        .returns(getMockQueryResponse({ data: undefined }));

      const mockStore = createMockStore();
      const wrapper = createTestWrapper(mockStore);

      const { result } = renderHook(() => useFetchMedicationHistory(), {
        wrapper,
      });

      await waitFor(() => {
        expect(result.current.prescriptions).to.deep.equal([]);
      });
    });

    it('returns loading true when isLoading is true', async () => {
      useGetPrescriptionsListQueryStub = sandbox
        .stub(prescriptionsApiModule, 'useGetPrescriptionsListQuery')
        .returns(getMockQueryResponse({ data: undefined, isLoading: true }));

      const mockStore = createMockStore();
      const wrapper = createTestWrapper(mockStore);

      const { result } = renderHook(() => useFetchMedicationHistory(), {
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

      const { result } = renderHook(() => useFetchMedicationHistory(), {
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

      const { result } = renderHook(() => useFetchMedicationHistory(), {
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

      renderHook(() => useFetchMedicationHistory(), { wrapper });

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

    it('reads page from URL search params', async () => {
      useGetPrescriptionsListQueryStub = sandbox
        .stub(prescriptionsApiModule, 'useGetPrescriptionsListQuery')
        .returns(getMockQueryResponse());

      const mockStore = createMockStore();
      const wrapper = createTestWrapper(mockStore, 3);

      const { result } = renderHook(() => useFetchMedicationHistory(), {
        wrapper,
      });

      await waitFor(() => {
        const queryParams = useGetPrescriptionsListQueryStub.firstCall.args[0];
        expect(queryParams.page).to.equal(3);
        expect(result.current.currentPage).to.equal(3);
      });
    });

    it('accepts custom perPage parameter', async () => {
      useGetPrescriptionsListQueryStub = sandbox
        .stub(prescriptionsApiModule, 'useGetPrescriptionsListQuery')
        .returns(getMockQueryResponse());

      const mockStore = createMockStore();
      const wrapper = createTestWrapper(mockStore);

      renderHook(() => useFetchMedicationHistory(25), { wrapper });

      await waitFor(() => {
        const queryParams = useGetPrescriptionsListQueryStub.firstCall.args[0];
        expect(queryParams.perPage).to.equal(25);
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

      renderHook(() => useFetchMedicationHistory(), { wrapper });

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

      renderHook(() => useFetchMedicationHistory(), { wrapper });

      await waitFor(() => {
        const queryParams = useGetPrescriptionsListQueryStub.firstCall.args[0];
        expect(queryParams.filterOption).to.equal(
          getFilterUrl(ACTIVE_FILTER_KEY, false, false),
        );
      });
    });
  });

  describe('setQueryParams function', () => {
    it('allows updating query params via setQueryParams', async () => {
      useGetPrescriptionsListQueryStub = sandbox
        .stub(prescriptionsApiModule, 'useGetPrescriptionsListQuery')
        .returns(getMockQueryResponse());

      const mockStore = createMockStore();
      const wrapper = createTestWrapper(mockStore);

      const { result } = renderHook(() => useFetchMedicationHistory(), {
        wrapper,
      });

      await waitFor(() => {
        expect(result.current.setQueryParams).to.be.a('function');
      });

      await act(async () => {
        result.current.setQueryParams(prev => ({
          ...prev,
          page: 10,
          perPage: 20,
        }));
      });

      await waitFor(() => {
        expect(
          useGetPrescriptionsListQueryStub
            .getCalls()
            .some(
              call => call.args[0]?.page === 10 && call.args[0]?.perPage === 20,
            ),
        ).to.equal(true);
      });
    });
  });

  describe('edge cases', () => {
    it('handles undefined filter option in Redux state', async () => {
      useGetPrescriptionsListQueryStub = sandbox
        .stub(prescriptionsApiModule, 'useGetPrescriptionsListQuery')
        .returns(getMockQueryResponse());

      const mockStore = createMockStore({
        rx: { preferences: { filterOption: undefined } },
      });
      const wrapper = createTestWrapper(mockStore);

      renderHook(() => useFetchMedicationHistory(), { wrapper });

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

      renderHook(() => useFetchMedicationHistory(), { wrapper });

      await waitFor(() => {
        const queryParams = useGetPrescriptionsListQueryStub.firstCall.args[0];
        // Should fall back to default sort option
        expect(queryParams.sortEndpoint).to.be.a('string');
      });
    });
  });

  describe('feature flag handling', () => {
    it('uses V1 filter URLs when no feature flags are enabled', async () => {
      useGetPrescriptionsListQueryStub = sandbox
        .stub(prescriptionsApiModule, 'useGetPrescriptionsListQuery')
        .returns(getMockQueryResponse());

      const mockStore = createMockStore({
        rx: { preferences: { filterOption: ACTIVE_FILTER_KEY } },
      });
      const wrapper = createTestWrapper(mockStore);

      renderHook(() => useFetchMedicationHistory(), { wrapper });

      await waitFor(() => {
        const queryParams = useGetPrescriptionsListQueryStub.firstCall.args[0];
        expect(queryParams.filterOption).to.equal(
          getFilterUrl(ACTIVE_FILTER_KEY, false, false),
        );
      });
    });

    it('uses V2 filter URLs when both Cerner pilot and V2 status mapping flags are true', async () => {
      useGetPrescriptionsListQueryStub = sandbox
        .stub(prescriptionsApiModule, 'useGetPrescriptionsListQuery')
        .returns(getMockQueryResponse());

      const mockStore = createMockStore({
        rx: { preferences: { filterOption: ACTIVE_FILTER_KEY } },
        featureToggles: {
          [CERNER_PILOT_TOGGLE]: true,
          [V2_STATUS_MAPPING_TOGGLE]: true,
        },
      });
      const wrapper = createTestWrapper(mockStore);

      renderHook(() => useFetchMedicationHistory(), { wrapper });

      await waitFor(() => {
        const queryParams = useGetPrescriptionsListQueryStub.firstCall.args[0];
        expect(queryParams.filterOption).to.equal(
          getFilterUrl(ACTIVE_FILTER_KEY, true, true),
        );
      });
    });

    it('uses V1 filter URLs with V2 RENEWAL URL when only Cerner pilot flag is true', async () => {
      useGetPrescriptionsListQueryStub = sandbox
        .stub(prescriptionsApiModule, 'useGetPrescriptionsListQuery')
        .returns(getMockQueryResponse());

      const mockStore = createMockStore({
        rx: { preferences: { filterOption: 'RENEWAL' } },
        featureToggles: {
          [CERNER_PILOT_TOGGLE]: true,
        },
      });
      const wrapper = createTestWrapper(mockStore);

      renderHook(() => useFetchMedicationHistory(), { wrapper });

      await waitFor(() => {
        const queryParams = useGetPrescriptionsListQueryStub.firstCall.args[0];
        // RENEWAL with cerner_pilot only should use V2 URL
        expect(queryParams.filterOption).to.equal(
          getFilterUrl('RENEWAL', true, false),
        );
      });
    });

    it('uses V2 sort options when management improvements flag is enabled', async () => {
      useGetPrescriptionsListQueryStub = sandbox
        .stub(prescriptionsApiModule, 'useGetPrescriptionsListQuery')
        .returns(getMockQueryResponse());

      const mockStore = createMockStore({
        rx: {
          preferences: { sortOption: 'mostRecentlyFilled' },
        },
        featureToggles: {
          [MANAGEMENT_IMPROVEMENTS_TOGGLE]: true,
        },
      });
      const wrapper = createTestWrapper(mockStore);

      renderHook(() => useFetchMedicationHistory(), { wrapper });

      await waitFor(() => {
        const queryParams = useGetPrescriptionsListQueryStub.firstCall.args[0];
        expect(queryParams.sortEndpoint).to.equal(
          rxListSortingOptionsV2.mostRecentlyFilled.API_ENDPOINT,
        );
      });
    });

    it('falls back to first V2 sort option for unknown key when management improvements is enabled', async () => {
      useGetPrescriptionsListQueryStub = sandbox
        .stub(prescriptionsApiModule, 'useGetPrescriptionsListQuery')
        .returns(getMockQueryResponse());

      const mockStore = createMockStore({
        rx: {
          preferences: { sortOption: 'nonExistentKey' },
        },
        featureToggles: {
          [MANAGEMENT_IMPROVEMENTS_TOGGLE]: true,
        },
      });
      const wrapper = createTestWrapper(mockStore);

      renderHook(() => useFetchMedicationHistory(), { wrapper });

      await waitFor(() => {
        const queryParams = useGetPrescriptionsListQueryStub.firstCall.args[0];
        expect(queryParams.sortEndpoint).to.equal(
          rxListSortingOptionsV2.mostRecentlyFilled.API_ENDPOINT,
        );
      });
    });
  });
});
