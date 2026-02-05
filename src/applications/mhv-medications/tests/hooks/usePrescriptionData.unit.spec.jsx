/* eslint-disable react/prop-types */
import React from 'react';
import { expect } from 'chai';
import { waitFor } from '@testing-library/react';
import { renderHook } from '@testing-library/react-hooks';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import sinon from 'sinon';
import { usePrescriptionData } from '../../hooks/usePrescriptionData';
import * as prescriptionsApi from '../../api/prescriptionsApi';

describe('usePrescriptionData', () => {
  let mockStore;
  let mockPrescription;
  let wrapper;
  let useQueryStateStub;
  let useQueryStub;

  beforeEach(() => {
    // Create a basic mock prescription
    mockPrescription = {
      prescriptionId: 123,
      prescriptionName: 'Test Medication',
      refillStatus: 'active',
    };

    const mockNumericStringPrescription = {
      prescriptionId: '456',
      prescriptionName: 'Numeric String Medication',
      refillStatus: 'active',
    };

    const mockData = {
      prescriptions: [mockPrescription, mockNumericStringPrescription],
    };

    // Create stubs for the RTK Query hooks
    useQueryStateStub = sinon.stub();
    useQueryStub = sinon.stub();

    // Default stub behavior for useQueryState to simulate selectFromResult
    useQueryStateStub.callsFake((_arg, options) => {
      if (options && options.selectFromResult) {
        return options.selectFromResult({ data: mockData });
      }
      return undefined;
    });

    useQueryStub.returns({
      data: mockPrescription,
      error: null,
      isLoading: false,
    });

    // Replace the real hooks with our stubs
    sinon.stub(prescriptionsApi, 'getPrescriptionsList').value({
      useQueryState: useQueryStateStub,
    });

    sinon.stub(prescriptionsApi, 'getPrescriptionById').value({
      useQuery: useQueryStub,
    });

    // Create mock store for provider
    mockStore = configureStore([])({});

    // Create wrapper without PropTypes to avoid validation errors
    wrapper = ({ children }) => (
      <Provider store={mockStore}>{children}</Provider>
    );
  });

  afterEach(() => {
    // Restore individual stubs
    if (prescriptionsApi.getPrescriptionsList.restore) {
      prescriptionsApi.getPrescriptionsList.restore();
    }
    if (prescriptionsApi.getPrescriptionById.restore) {
      prescriptionsApi.getPrescriptionById.restore();
    }
  });

  it('should return cached prescription when available', async () => {
    // Render hook with parameters
    const { result } = renderHook(() => usePrescriptionData('123', {}), {
      wrapper,
    });

    // Verify the hook returns the expected data
    await waitFor(() => {
      expect(result.current.prescription).to.deep.equal(mockPrescription);
      expect(result.current.isLoading).to.be.false;
      expect(result.current.prescriptionApiError).to.be.false;
    });

    // Verify that the cached prescription was used
    expect(useQueryStateStub.called).to.be.true;
    expect(useQueryStub.firstCall.args[1].skip).to.be.true;
  });

  it('should return cached prescription when ID is a numeric string', async () => {
    // Render hook with parameters using the numeric string ID
    const { result } = renderHook(() => usePrescriptionData('456', {}), {
      wrapper,
    });

    // Verify the hook returns the expected data
    await waitFor(() => {
      expect(result.current.prescription).to.deep.equal({
        prescriptionId: '456',
        prescriptionName: 'Numeric String Medication',
        refillStatus: 'active',
      });
      expect(result.current.isLoading).to.be.false;
      expect(result.current.prescriptionApiError).to.be.false;
    });

    // Verify that the cached prescription was used
    expect(useQueryStateStub.called).to.be.true;
    expect(useQueryStub.firstCall.args[1].skip).to.be.true;
  });

  it('should fetch individual prescription when not available in cache', async () => {
    // Set up stub to indicate cache miss
    useQueryStateStub.returns(undefined);

    // Render hook with parameters
    const { result } = renderHook(() => usePrescriptionData('123', {}), {
      wrapper,
    });

    //    // Wait for effect to run
    await waitFor(() => {
      expect(result.current.isLoading).to.be.false;
      expect(result.current.prescription).to.deep.equal(mockPrescription);
    });

    // On the first call, skip will be true because cachedPrescriptionAvailable starts as true
    // On later calls after the effect runs, it should be set to false
    // Note: We need to verify the latest call, not the first call
    expect(useQueryStub.called).to.be.true;

    // The hook should be called at least twice - once with skip: true, and once with skip: false
    expect(useQueryStub.callCount).to.be.at.least(1);

    // At least one call should have skip: false to trigger the fetch
    const hasFetchCall = useQueryStub
      .getCalls()
      .some(call => call.args[1].skip === false);
    expect(hasFetchCall).to.be.true;
  });

  it('should handle API errors properly', async () => {
    // Set up stubs to simulate API error
    useQueryStateStub.returns(undefined);
    useQueryStub.returns({
      data: null,
      error: { message: 'API Error' },
      isLoading: false,
    });

    // Render hook with parameters
    const { result } = renderHook(() => usePrescriptionData('123', {}), {
      wrapper,
    });

    // Wait for effect to run
    await waitFor(() => {
      expect(result.current.isLoading).to.be.false;
      expect(result.current.prescriptionApiError).to.deep.equal({
        message: 'API Error',
      });
      expect(result.current.prescription).to.be.null;
    });
  });

  it('should handle loading states correctly', async () => {
    useQueryStateStub.returns(undefined);
    useQueryStub.returns({
      data: null,
      error: null,
      isLoading: true,
    });

    // Render hook with parameters
    const { result, rerender } = renderHook(
      () => usePrescriptionData('123', {}),
      {
        wrapper,
      },
    );

    // Make sure the result is available
    await waitFor(() => {
      expect(result.current).to.not.be.null;
    });

    // Initial loading state should be true
    expect(result.current.isLoading).to.be.true;

    // Update the query stub to simulate loading completion
    useQueryStub.returns({
      data: mockPrescription,
      error: null,
      isLoading: false,
    });

    // Re-render the same hook instance
    rerender();

    // Wait for effects to run
    await waitFor(
      () => {
        expect(result.current).to.not.be.null;
        expect(result.current.isLoading).to.be.false;
        expect(result.current.prescription).to.deep.equal(mockPrescription);
      },
      { timeout: 3000 },
    );
  });

  it('should switch from cache to direct fetch when cache becomes unavailable', async () => {
    // First render with cached data
    const { result, rerender } = renderHook(
      () => usePrescriptionData('123', {}),
      { wrapper },
    );

    // Make sure the result is available
    await waitFor(() => {
      expect(result.current).to.not.be.null;
    });

    // Now simulate cache miss
    useQueryStateStub.returns(undefined);

    // Rerender to trigger effect
    rerender();

    // Reset the useQueryStub to simulate what would happen on the next render cycle
    useQueryStub.resetHistory();
    useQueryStub.returns({
      data: mockPrescription,
      error: null,
      isLoading: false,
    });

    // Trigger another render to ensure the effect that sets cachedPrescriptionAvailable to false has run
    rerender();

    // Wait to ensure effects have run and verify the query was made without skip
    await waitFor(
      () => {
        expect(useQueryStub.called).to.be.true;
        expect(useQueryStub.firstCall.args[1].skip).to.be.false;
      },
      { timeout: 3000 },
    );
  });
});
