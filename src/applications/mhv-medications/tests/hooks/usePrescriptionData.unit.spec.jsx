import { expect } from 'chai';
import sinon from 'sinon';
import React from 'react';
import ReactDOM from 'react-dom';
import { act } from 'react-dom/test-utils';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import * as useMedicationPreferences from '../../hooks/useMedicationPreferences';
import * as usePrescriptionData from '../../hooks/usePrescriptionData';
import {
  stubPrescriptionsApiCache,
  stubPrescriptionIdApi,
} from '../testing-utils';

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

describe('usePrescriptionData', () => {
  const mockStore = configureStore([]);
  let store;
  let sandbox;
  let originalRender;

  beforeEach(() => {
    // Create a sinon sandbox for isolation
    sandbox = sinon.createSandbox();

    // Create mock store
    store = mockStore({
      rx: {
        preferences: {
          sortOption: 'alphabeticalOrder',
          filterOption: 'ALL_MEDICATIONS',
          pageNumber: 1,
        },
      },
      featureToggles: {
        mhvMedicationsDisplayGrouping: true,
      },
    });

    // Mock the useMedicationPreferences hook
    sandbox.stub(useMedicationPreferences, 'default').returns([
      {
        page: 1,
        perPage: 20,
        sortEndpoint: '&sort[]=prescription_name&sort[]=dispensed_date',
        filterOption: '',
      },
    ]);

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
    // Restore all mocks
    sandbox.restore();
    // Restore original render
    ReactDOM.render = originalRender;
    // Clean up DOM
    document.body.innerHTML = '';
  });

  it('should return prescription data from cache when available', () => {
    stubPrescriptionsApiCache({ sandbox });

    // No need to stub prescription by ID since it shouldn't be called
    stubPrescriptionIdApi({
      sandbox,
    });

    // Test the hook
    const { result } = testHook(() => usePrescriptionData.default(21871320));

    // Check that the data is from cache
    expect(result.prescription.prescriptionId).to.equal(21871320);
    expect(result.prescription.prescriptionName).to.equal(
      'ABACAVIR SO4 600MG/LAMIVUDINE 300MG TAB',
    );
    expect(result.error).to.be.undefined;
    expect(result.isLoading).to.be.false;
  });

  it('should fetch data from API when not available in cache', () => {
    // Mock empty cache using stub utils
    stubPrescriptionsApiCache({
      sandbox,
      data: {
        prescriptions: [],
      },
    });

    // Mock API response using stub utils
    const apiPrescription = {
      id: 123,
      prescriptionName: 'Test Med from API',
      refillStatus: 'active',
    };

    stubPrescriptionIdApi({
      sandbox,
      data: apiPrescription,
      isLoading: false,
    });

    // Test the hook
    const { result } = testHook(() => usePrescriptionData.default(123));

    // Check that the data is from API
    expect(result.prescription).to.deep.equal(apiPrescription);
    expect(result.error).to.be.undefined;
    expect(result.isLoading).to.be.false;
  });

  it('should handle API errors correctly', () => {
    // Mock empty cache
    stubPrescriptionsApiCache({
      sandbox,
      data: {
        prescriptions: [],
      },
    });

    // Mock API error
    const errorResponse = { status: 500, data: 'Server error' };
    stubPrescriptionIdApi({
      sandbox,
      data: null,
      error: errorResponse,
      isLoading: false,
    });

    // Test the hook
    const { result } = testHook(() => usePrescriptionData.default('123'));

    // Check error handling
    expect(result.prescription).to.be.null;
    expect(result.error).to.deep.equal(errorResponse);
    expect(result.isLoading).to.be.false;
  });

  it('should handle loading state correctly', () => {
    // Mock empty cache
    stubPrescriptionsApiCache({
      sandbox,
      data: {
        prescriptions: [],
      },
    });

    // Mock loading state
    stubPrescriptionIdApi({
      sandbox,
      data: null,
      error: null,
      isLoading: true,
    });

    // Test the hook
    const { result } = testHook(() => usePrescriptionData.default('123'));

    // Check loading state
    expect(result.prescription).to.be.null;
    expect(result.error).to.be.null;
    expect(result.isLoading).to.be.true;
  });
});
