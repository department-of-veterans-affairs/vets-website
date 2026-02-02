import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';
import { renderWithStoreAndRouter } from '@department-of-veterans-affairs/platform-testing/react-testing-library-helpers';
import { $ } from 'platform/forms-system/src/js/utilities/ui';
import { waitFor } from '@testing-library/react';
import * as featureToggle from 'platform/utilities/feature-toggles/useFeatureToggle';
import { MemoryRouter, Routes, Route } from 'react-router-dom-v5-compat';
import TravelClaimDetailsContent from './TravelClaimDetailsContent';
import * as actions from '../redux/actions';
import reducer from '../redux/reducer';

describe('TravelClaimDetailsContent', () => {
  let getClaimDetailsStub;
  let getAppointmentDataByDateTimeStub;

  const getInitialState = ({
    claimId = '123',
    appointmentId = 'appt-123',
    claimDataOverride = {},
    appointmentDataOverride = {},
    complexClaimsEnabled = true,
  } = {}) => ({
    featureToggles: {
      // eslint-disable-next-line camelcase
      travel_pay_enable_complex_claims: complexClaimsEnabled,
    },
    travelPay: {
      claimDetails: {
        data: {
          [claimId]: {
            id: claimId,
            claimNumber: `TC${claimId}`,
            appointment: { appointmentDateTime: '2025-12-15T10:00:00Z' },
            ...claimDataOverride,
          },
        },
        error: null,
      },
      appointment: {
        data: {
          travelPayClaim: { claim: { id: appointmentId } },
          ...appointmentDataOverride,
        },
        isLoading: false,
        error: null,
      },
    },
  });

  const CLAIM_123 = {
    '123': {
      id: '123',
      claimNumber: 'TC123',
      claimStatus: 'Claim submitted',
      appointmentDate: '2025-12-15T10:00:00Z',
      facilityName: 'Test Facility',
      createdOn: '2025-12-15T10:00:00Z',
      modifiedOn: '2025-12-15T10:00:00Z',
      appointment: {
        appointmentDateTime: '2025-12-15T10:00:00Z',
      },
    },
  };

  beforeEach(() => {
    sinon.stub(featureToggle, 'useFeatureToggle').returns({
      useToggleValue: () => true,
      TOGGLE_NAMES: {
        travelPayEnableComplexClaims: 'travel_pay_enable_complex_claims',
      },
    });

    getClaimDetailsStub = sinon.stub(actions, 'getClaimDetails');
    getAppointmentDataByDateTimeStub = sinon.stub(
      actions,
      'getAppointmentDataByDateTime',
    );
  });

  afterEach(() => {
    featureToggle.useFeatureToggle.restore();
    getClaimDetailsStub.restore();
    getAppointmentDataByDateTimeStub.restore();
  });

  describe('error handling', () => {
    it('should display error alert when claim details error exists', () => {
      const initialState = getInitialState({
        claimDataOverride: {}, // no claim data
      });

      // Override the claimDetails.error to simulate a fetch failure
      initialState.travelPay.claimDetails.error = {
        message: 'Failed to fetch claim details',
      };

      // Also clear the appointment data
      initialState.travelPay.appointment.data = null;

      const screen = renderWithStoreAndRouter(<TravelClaimDetailsContent />, {
        initialState,
        path: '/claim/123',
        reducers: reducer,
      });

      expect(screen.getByText('Something went wrong on our end')).to.exist;
      expect(screen.getByText(/status in this tool right now/i)).to.exist;
      expect(
        $(
          'va-link[href="/health-care/get-reimbursed-for-travel-pay/"][text="Find out how to file for travel reimbursement"]',
        ),
      ).to.exist;
    });

    it('should render ClaimDetailsContent when claim data exists', () => {
      const initialState = getInitialState({
        claimId: '123',
        claimDataOverride: {
          ...CLAIM_123,
        },
      });

      // Ensure appointment data is available
      initialState.travelPay.appointment.data = { id: 'appt-123' };

      const screen = renderWithStoreAndRouter(<TravelClaimDetailsContent />, {
        initialState,
        path: '/claim/123',
        reducers: reducer,
      });

      expect(screen.getByText(/eligible for reimbursement/i)).to.exist;
      expect(
        $(
          'va-link[href="/resources/how-to-set-up-direct-deposit-for-va-travel-pay-reimbursement/"][text="Learn how to set up direct deposit for travel pay"]',
        ),
      ).to.exist;
      expect(screen.queryByText('Something went wrong on our end')).to.not
        .exist;
    });
  });

  describe('useEffect for fetching claim and appointment data', () => {
    it('should render without claim data initially and not error', () => {
      const initialState = getInitialState({
        claimId: null, // no claim yet
        appointmentId: 'appt-123',
      });

      // Clear out claimDetails data and error to simulate initial load
      initialState.travelPay.claimDetails.data = {};
      initialState.travelPay.claimDetails.error = null;

      // Ensure appointment is empty to simulate no data initially
      initialState.travelPay.appointment.data = null;

      const screen = renderWithStoreAndRouter(<TravelClaimDetailsContent />, {
        initialState,
        path: '/claim/:id',
        initialEntries: ['/claim/123'],
        reducers: reducer,
      });

      // Component should render the static content even without claim data
      expect(screen.getByText(/eligible for reimbursement/i)).to.exist;
    });

    it('should not dispatch actions when claim data already exists', () => {
      const initialState = getInitialState({
        claimId: '123',
        appointmentId: 'appt-123',
      });

      // Add existing claim data to simulate already-loaded claim
      initialState.travelPay.claimDetails.data = CLAIM_123;
      initialState.travelPay.claimDetails.error = null;

      // Ensure appointment is empty to match scenario
      initialState.travelPay.appointment.data = null;

      renderWithStoreAndRouter(<TravelClaimDetailsContent />, {
        initialState,
        path: '/claim/:id',
        initialEntries: ['/claim/123'],
        reducers: reducer,
      });

      expect(getClaimDetailsStub.called).to.be.false;
    });

    it('should render appointment data when available', () => {
      const initialState = getInitialState({
        claimId: '123',
        appointmentId: 'appt-123',
      });

      // Populate claimDetails with existing claim and appointment
      initialState.travelPay.claimDetails.data = CLAIM_123;

      // Ensure appointment store data is available
      initialState.travelPay.appointment.data = {
        id: 'appt-123',
      };
      initialState.travelPay.appointment.isLoading = false;
      initialState.travelPay.appointment.error = null;

      const screen = renderWithStoreAndRouter(<TravelClaimDetailsContent />, {
        initialState,
        path: '/claim/:id',
        initialEntries: ['/claim/123'],
        reducers: reducer,
      });

      // Component renders successfully with appointment data
      expect(screen.getByText(/eligible for reimbursement/i)).to.exist;
    });

    it('should not dispatch getAppointmentDataByDateTime when appointmentError exists', () => {
      const initialState = getInitialState({
        claimId: '123',
        appointmentId: null,
      });

      // Use the constant for claim details
      initialState.travelPay.claimDetails.data = CLAIM_123;

      // Simulate an appointment error
      initialState.travelPay.appointment.data = null;
      initialState.travelPay.appointment.isLoading = false;
      initialState.travelPay.appointment.error = { message: 'Error' };

      renderWithStoreAndRouter(<TravelClaimDetailsContent />, {
        initialState,
        path: '/claim/123',
        reducers: reducer,
      });

      expect(getAppointmentDataByDateTimeStub.called).to.be.false;
    });

    it('should not dispatch getAppointmentDataByDateTime when appointmentData already exists', () => {
      const initialState = getInitialState({
        claimId: '123',
        appointmentId: 'appt-123', // appointment data already exists
      });

      // Use the constant for claim details
      initialState.travelPay.claimDetails.data = CLAIM_123;

      renderWithStoreAndRouter(<TravelClaimDetailsContent />, {
        initialState,
        path: '/claim/123',
        reducers: reducer,
      });

      expect(getAppointmentDataByDateTimeStub.called).to.be.false;
    });

    it('should not dispatch getAppointmentDataByDateTime when complexClaimsEnabled feature flag is false', () => {
      const initialState = getInitialState({
        claimId: '123',
        appointmentId: null, // no appointment data yet
      });

      // Override feature toggle
      // eslint-disable-next-line camelcase
      initialState.featureToggles.travel_pay_enable_complex_claims = false;

      // Use the constant for claim details
      initialState.travelPay.claimDetails.data = CLAIM_123;

      renderWithStoreAndRouter(<TravelClaimDetailsContent />, {
        initialState,
        path: '/claim/123',
        reducers: reducer,
      });

      expect(getAppointmentDataByDateTimeStub.called).to.be.false;
      getAppointmentDataByDateTimeStub.restore();
    });
    // need to figure out how to get these to work
    it.skip('does not dispatch getAppointmentDataByDateTime when appointmentData belongs to the same claim', async () => {
      const initialState = getInitialState({
        claimId: '123',
        appointmentId: 'appt-123', // existing appointment data belongs to same claim
      });

      // Override feature toggle to true
      // eslint-disable-next-line camelcase
      initialState.featureToggles.travel_pay_enable_complex_claims = true;

      // Use constant for claim details
      initialState.travelPay.claimDetails.data = CLAIM_123;

      // Existing appointment data belongs to same claim
      initialState.travelPay.appointment.data = {
        travelPayClaim: { claim: { id: '123' } },
      };

      renderWithStoreAndRouter(
        <MemoryRouter initialEntries={['/claim/123']}>
          <Routes>
            <Route path="/claim/:id" element={<TravelClaimDetailsContent />} />
          </Routes>
        </MemoryRouter>,
        { initialState, reducers: reducer },
      );
      waitFor(() => {
        expect(getAppointmentDataByDateTimeStub.called).to.be.false;
      });
      getAppointmentDataByDateTimeStub.restore();
    });
    // need to figure out how to get these to work

    it.skip('dispatches getAppointmentDataByDateTime when appointmentData belongs to a different claim', async () => {
      const initialState = getInitialState({
        claimId: '123',
        appointmentId: 'appt-999', // appointment belongs to a different claim
      });

      // Enable complex claims
      // eslint-disable-next-line camelcase
      initialState.featureToggles.travel_pay_enable_complex_claims = true;

      // Set claim details for claim 123
      initialState.travelPay.claimDetails.data = CLAIM_123;

      // Appointment data belongs to a different claim
      initialState.travelPay.appointment.data = {
        travelPayClaim: { claim: { id: '999' } },
      };

      renderWithStoreAndRouter(<TravelClaimDetailsContent />, {
        initialState,
        path: '/claim/:id',
        initialEntries: ['/claim/123'],
        reducers: reducer,
      });

      await waitFor(() => {
        expect(getAppointmentDataByDateTimeStub.calledOnce).to.be.true;
        expect(
          getAppointmentDataByDateTimeStub.calledWith('2025-12-15T10:00:00Z'),
        ).to.be.true;
      });
    });
  });

  describe('help text and additional content', () => {
    it('should always display help text and direct deposit information', () => {
      const initialState = getInitialState({
        claimId: '123',
        appointmentId: 'appt-123',
      });

      // Set claim details using the shared constant
      initialState.travelPay.claimDetails.data = CLAIM_123;

      const screen = renderWithStoreAndRouter(<TravelClaimDetailsContent />, {
        initialState,
        path: '/claim/123',
        reducers: reducer,
      });

      expect(screen.getByText(/eligible for reimbursement/i)).to.exist;
      expect(
        $(
          'va-link[href="/resources/how-to-set-up-direct-deposit-for-va-travel-pay-reimbursement/"][text="Learn how to set up direct deposit for travel pay"]',
        ),
      ).to.exist;
    });

    it('should display contact information in error alert', () => {
      const initialState = getInitialState({
        claimId: null,
        appointmentId: 'appt-123',
      });

      // Override claimDetails to simulate an error
      initialState.travelPay.claimDetails = {
        data: {},
        error: { message: 'Error' },
      };

      const screen = renderWithStoreAndRouter(<TravelClaimDetailsContent />, {
        initialState,
        path: '/claim/123',
        reducers: reducer,
      });

      expect(
        screen.getAllByText(/You can call the BTSSS call center/i).length,
      ).to.be.greaterThan(0);
      expect(
        $(
          'va-link[href="/health-care/get-reimbursed-for-travel-pay/"][text="Find out how to file for travel reimbursement"]',
        ),
      ).to.exist;
    });
  });
});
