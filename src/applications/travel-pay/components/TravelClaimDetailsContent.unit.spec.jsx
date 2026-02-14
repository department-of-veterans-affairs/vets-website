import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';
import { $ } from 'platform/forms-system/src/js/utilities/ui';
import { waitFor, render } from '@testing-library/react';
import * as featureToggle from 'platform/utilities/feature-toggles/useFeatureToggle';
import { MemoryRouter, Routes, Route } from 'react-router-dom-v5-compat';
import { Provider } from 'react-redux';
import TravelClaimDetailsContent from './TravelClaimDetailsContent';
import * as ClaimDetailsContent from './ClaimDetailsContent';
import * as actions from '../redux/actions';

describe('TravelClaimDetailsContent', () => {
  let getClaimDetailsStub;
  let getAppointmentDataByDateTimeStub;
  let claimDetailsContentStub;

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

  const initialState = getInitialState({
    claimId: '123',
    appointmentId: 'appt-999', // for example
    complexClaimsEnabled: true,
  });

  const makeStore = (stateOverride = {}) => {
    const state = {
      ...initialState,
      ...stateOverride,
    };

    return {
      getState: () => state,
      subscribe: () => () => {},
      dispatch: sinon.spy(),
    };
  };

  let currentStore;

  const buildState = ({
    featureOverrides = {},
    claimDetailsOverrides = {},
    appointmentOverrides = {},
  } = {}) => ({
    ...initialState,
    featureToggles: {
      ...initialState.featureToggles,
      ...featureOverrides,
    },
    travelPay: {
      ...initialState.travelPay,
      claimDetails: {
        ...initialState.travelPay.claimDetails,
        ...claimDetailsOverrides,
      },
      appointment: {
        ...initialState.travelPay.appointment,
        ...appointmentOverrides,
      },
    },
  });

  const renderComponent = (stateOverrides = {}) => {
    currentStore = makeStore(buildState(stateOverrides));

    return render(
      <Provider store={currentStore}>
        <MemoryRouter initialEntries={['/claim/123']}>
          <Routes>
            <Route path="/claim/:id" element={<TravelClaimDetailsContent />} />
          </Routes>
        </MemoryRouter>
      </Provider>,
    );
  };

  beforeEach(() => {
    sinon.stub(featureToggle, 'useFeatureToggle').callsFake(() => {
      return {
        useToggleValue: toggleName =>
          currentStore.getState().featureToggles[toggleName] ?? false,
        TOGGLE_NAMES: {
          travelPayEnableComplexClaims: 'travel_pay_enable_complex_claims',
        },
      };
    });

    getClaimDetailsStub = sinon.stub(actions, 'getClaimDetails');
    getAppointmentDataByDateTimeStub = sinon.stub(
      actions,
      'getAppointmentDataByDateTime',
    );

    claimDetailsContentStub = sinon
      .stub(ClaimDetailsContent, 'default')
      .returns(
        <div data-testid="claim-details-stub">Claim Details Content</div>,
      );
  });

  afterEach(() => {
    featureToggle.useFeatureToggle.restore();
    getClaimDetailsStub.restore();
    getAppointmentDataByDateTimeStub.restore();
    claimDetailsContentStub.restore();
  });

  describe('error handling', () => {
    it('should display error alert when claim details error exists', () => {
      const screen = renderComponent({
        claimDetailsOverrides: {
          data: {},
          error: { message: 'Failed to fetch claim details' },
        },
        appointmentOverrides: {
          data: null,
        },
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
      const screen = renderComponent({
        claimDetailsOverrides: {
          data: CLAIM_123,
          error: null,
        },
        appointmentOverrides: {
          data: { id: 'appt-123' },
          isLoading: false,
        },
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
      const screen = renderComponent({
        claimDetailsOverrides: {
          data: {},
          error: null,
        },
        appointmentOverrides: {
          data: null,
          isLoading: false,
          error: null,
        },
      });

      // Component should render the static content even without claim data
      expect(screen.getByText(/eligible for reimbursement/i)).to.exist;
    });

    it('should not dispatch actions when claim data already exists', () => {
      renderComponent({
        claimDetailsOverrides: {
          data: CLAIM_123,
          error: null,
        },
        appointmentOverrides: {
          data: null,
        },
      });

      expect(getClaimDetailsStub.called).to.be.false;
    });

    it('should render appointment data when available', () => {
      const screen = renderComponent({
        claimDetailsOverrides: {
          data: CLAIM_123,
          error: null,
        },
        appointmentOverrides: {
          data: {
            id: 'appt-123',
            appointmentDateTime: '2025-12-15T10:00:00Z',
          },
          isLoading: false,
          error: null,
        },
      });

      // Component renders successfully with appointment data
      expect(screen.getByText(/eligible for reimbursement/i)).to.exist;
    });

    it('should not dispatch getAppointmentDataByDateTime when appointmentError exists', async () => {
      renderComponent({
        claimDetailsOverrides: {
          data: CLAIM_123,
        },
        appointmentOverrides: {
          data: null,
          error: { message: 'Error' },
        },
      });

      expect(getAppointmentDataByDateTimeStub.called).to.be.false;
    });

    it('should not dispatch getAppointmentDataByDateTime when appointmentData already exists', () => {
      renderComponent({
        claimDetailsOverrides: {
          data: CLAIM_123,
          error: null,
        },
        appointmentOverrides: {
          data: {
            travelPayClaim: { claim: { id: '123' } },
            appointmentDateTime: '2025-12-15T10:00:00Z',
          },
          isLoading: false,
          error: null,
        },
      });

      expect(getAppointmentDataByDateTimeStub.called).to.be.false;
    });

    it('does not dispatch getAppointmentDataByDateTime when appointmentData belongs to the same claim', async () => {
      renderComponent({
        claimDetailsOverrides: {
          data: CLAIM_123,
        },
        appointmentOverrides: {
          data: {
            travelPayClaim: { claim: { id: '123' } },
            appointmentDateTime: '2025-12-15T10:00:00Z',
          },
          error: null,
        },
      });

      // Await useEffect completion
      await waitFor(() => {
        expect(currentStore.dispatch.called).to.be.false;
        expect(getAppointmentDataByDateTimeStub.calledOnce).to.be.false;
      });
    });

    it('dispatches getAppointmentDataByDateTime when appointmentData belongs to a different claim', async () => {
      renderComponent({
        claimDetailsOverrides: {
          data: CLAIM_123,
        },
        appointmentOverrides: {
          data: {
            travelPayClaim: { claim: { id: '999' } },
            appointmentDateTime: '2025-12-15T10:00:00Z',
          },
          error: null,
        },
      });

      await waitFor(() => {
        expect(getAppointmentDataByDateTimeStub.calledOnce).to.be.true;
        expect(
          getAppointmentDataByDateTimeStub.calledWith('2025-12-15T10:00:00Z'),
        ).to.be.true;
      });
    });

    it('should not dispatch getAppointmentDataByDateTime when complexClaimsEnabled feature flag is false', async () => {
      renderComponent({
        featureOverrides: {
          // eslint-disable-next-line camelcase
          travel_pay_enable_complex_claims: false,
        },
        claimDetailsOverrides: {
          data: CLAIM_123,
          error: null,
        },
        appointmentOverrides: {
          data: null,
          isLoading: false,
          error: null,
        },
      });

      await waitFor(() => {
        expect(getAppointmentDataByDateTimeStub.calledOnce).to.be.false;
      });
    });
  });

  describe('help text and additional content', () => {
    it('should always display help text and direct deposit information', () => {
      const screen = renderComponent({
        claimDetailsOverrides: {
          data: CLAIM_123,
        },
        appointmentOverrides: {
          data: { id: 'appt-123' },
        },
      });

      expect(screen.getByText(/eligible for reimbursement/i)).to.exist;
      expect(
        $(
          'va-link[href="/resources/how-to-set-up-direct-deposit-for-va-travel-pay-reimbursement/"][text="Learn how to set up direct deposit for travel pay"]',
        ),
      ).to.exist;
    });

    it('should display contact information in error alert', () => {
      const screen = renderComponent({
        claimDetailsOverrides: {
          data: {},
          error: { message: 'Error' },
        },
        appointmentOverrides: {
          data: { id: 'appt-123' },
        },
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
