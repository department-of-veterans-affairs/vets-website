import React from 'react';
import { renderHook } from '@testing-library/react-hooks';
import { expect } from 'chai';
import sinon from 'sinon';
import { Provider } from 'react-redux';

import { useClaimDetails } from '../../hooks/useClaimDetails';
import * as actions from '../../redux/actions';

describe('useClaimDetail', () => {
  let store;
  let getClaimDetailsStub;
  let getAppointmentDataByDateTimeStub;
  let clearAppointmentDataStub;

  const mockClaimId = '12345';

  const createMockStore = (initialState = {}) => {
    const defaultState = {
      travelPay: {
        claimDetails: {
          isLoading: false,
          data: {},
          error: null,
        },
        appointment: {
          isLoading: false,
          data: null,
          error: null,
        },
      },
      featureToggles: {
        loading: false,
        /* eslint-disable camelcase */
        travel_pay_enable_complex_claims: false,
        /* eslint-enable camelcase */
      },
    };

    return {
      getState: () => ({ ...defaultState, ...initialState }),
      subscribe: () => {},
      dispatch: sinon.spy(),
    };
  };

  const renderUseClaimDetails = (claimId, options = {}) => {
    const {
      claimExists = false,
      claimData = null,
      isClaimLoading = false,
      claimError = null,
      appointmentData = null,
      isAppointmentLoading = false,
      appointmentError = null,
      complexClaimsEnabled = true,
      appointmentDateTime = null,
    } = options;

    const claimDetailsData =
      claimExists || claimData
        ? {
            [claimId]: claimData || {
              claimId,
              appointment: appointmentDateTime ? { appointmentDateTime } : {},
            },
          }
        : {};

    store = createMockStore({
      travelPay: {
        claimDetails: {
          isLoading: isClaimLoading,
          data: claimDetailsData,
          error: claimError,
        },
        appointment: {
          isLoading: isAppointmentLoading,
          data: appointmentData,
          error: appointmentError,
        },
      },
      featureToggles: {
        loading: false,
        /* eslint-disable camelcase */
        travel_pay_enable_complex_claims: complexClaimsEnabled,
        /* eslint-enable camelcase */
      },
    });

    const wrapper = ({ children }) => (
      <Provider store={store}>{children}</Provider>
    );

    return renderHook(() => useClaimDetails(claimId), { wrapper });
  };

  beforeEach(() => {
    store = createMockStore();
    getClaimDetailsStub = sinon.stub(actions, 'getClaimDetails').returns({
      type: 'GET_CLAIM_DETAILS',
    });
    getAppointmentDataByDateTimeStub = sinon
      .stub(actions, 'getAppointmentDataByDateTime')
      .returns({
        type: 'GET_APPOINTMENT_DATA',
      });
    clearAppointmentDataStub = sinon
      .stub(actions, 'clearAppointmentData')
      .returns({
        type: 'CLEAR_APPOINTMENT_DATA',
      });
  });

  afterEach(() => {
    getClaimDetailsStub.restore();
    getAppointmentDataByDateTimeStub.restore();
    clearAppointmentDataStub.restore();
  });

  describe('initialization', () => {
    it('should clear appointment data on mount', () => {
      renderUseClaimDetails(mockClaimId);

      expect(store.dispatch.called).to.be.true;
      expect(clearAppointmentDataStub.called).to.be.true;
    });
  });

  describe('fetching claim details', () => {
    it('should fetch claim details when claimId is provided and data does not exist', () => {
      renderUseClaimDetails(mockClaimId);

      expect(store.dispatch.called).to.be.true;
      expect(getClaimDetailsStub.calledWith(mockClaimId)).to.be.true;
    });

    it('should not fetch claim details when data already exists', () => {
      renderUseClaimDetails(mockClaimId, { claimExists: true });

      expect(getClaimDetailsStub.called).to.be.false;
    });
  });

  describe('fetching appointment data', () => {
    it('should fetch appointment data when complex claims enabled and appointmentDateTime exists', () => {
      const appointmentDateTime = '2024-01-15T10:00:00.000-06:00';
      renderUseClaimDetails(mockClaimId, {
        claimExists: true,
        appointmentDateTime,
      });

      expect(getAppointmentDataByDateTimeStub.calledWith(appointmentDateTime))
        .to.be.true;
    });

    it('should not fetch appointment data when complex claims are disabled', () => {
      const appointmentDateTime = '2024-01-15T10:00:00.000-06:00';
      renderUseClaimDetails(mockClaimId, {
        claimExists: true,
        appointmentDateTime,
        complexClaimsEnabled: false,
      });

      expect(getAppointmentDataByDateTimeStub.called).to.be.false;
    });

    it('should not fetch appointment data when appointmentDateTime is missing', () => {
      renderUseClaimDetails(mockClaimId, { claimExists: true });

      expect(getAppointmentDataByDateTimeStub.called).to.be.false;
    });

    it('should not fetch appointment data when appointment data already exists', () => {
      const appointmentDateTime = '2024-01-15T10:00:00.000-06:00';
      renderUseClaimDetails(mockClaimId, {
        claimExists: true,
        appointmentDateTime,
        appointmentData: {
          id: 'appt123',
          localStartTime: appointmentDateTime,
        },
      });

      expect(getAppointmentDataByDateTimeStub.called).to.be.false;
    });

    it('should not fetch appointment data when there is an appointment error', () => {
      const appointmentDateTime = '2024-01-15T10:00:00.000-06:00';
      renderUseClaimDetails(mockClaimId, {
        claimExists: true,
        appointmentDateTime,
        appointmentError: 'Failed to fetch appointment',
      });

      expect(getAppointmentDataByDateTimeStub.called).to.be.false;
    });
  });

  describe('return values', () => {
    it('should return the expected shape', () => {
      const { result } = renderUseClaimDetails(mockClaimId);

      expect(result.current).to.have.property('claimData');
      expect(result.current).to.have.property('appointmentData');
      expect(result.current).to.have.property('isLoading');
      expect(result.current).to.have.property('error');
    });

    it('should return loading state as true when claim details are loading', () => {
      const { result } = renderUseClaimDetails(mockClaimId, {
        isClaimLoading: true,
      });

      expect(result.current.isLoading).to.be.true;
    });
  });

  describe('switching between claims', () => {
    it('should fetch appointment data for the new claim when claimId changes', () => {
      const firstClaimId = '12345';
      const secondClaimId = '67890';
      const firstAppointmentDateTime = '2024-01-15T10:00:00.000-06:00';
      const secondAppointmentDateTime = '2024-01-20T14:30:00.000-06:00';

      // Render with first claim
      renderUseClaimDetails(firstClaimId, {
        claimData: {
          claimId: firstClaimId,
          appointment: {
            appointmentDateTime: firstAppointmentDateTime,
          },
        },
      });

      expect(
        getAppointmentDataByDateTimeStub.calledWith(firstAppointmentDateTime),
      ).to.be.true;

      getAppointmentDataByDateTimeStub.resetHistory();

      // Render with second claim - simulates navigating to a different claim
      renderUseClaimDetails(secondClaimId, {
        claimData: {
          claimId: secondClaimId,
          appointment: {
            appointmentDateTime: secondAppointmentDateTime,
          },
        },
        appointmentData: null, // This will have been cleared when the component re-mounts
      });

      // Verify second appointment was fetched
      expect(
        getAppointmentDataByDateTimeStub.calledWith(secondAppointmentDateTime),
      ).to.be.true;
    });
  });
});
