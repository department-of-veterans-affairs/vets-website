import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';
import { renderWithStoreAndRouter } from '@department-of-veterans-affairs/platform-testing/react-testing-library-helpers';
import { $ } from 'platform/forms-system/src/js/utilities/ui';
import TravelClaimDetailsContent from './TravelClaimDetailsContent';
import * as actions from '../redux/actions';
import reducer from '../redux/reducer';

describe('TravelClaimDetailsContent', () => {
  let getClaimDetailsStub;
  let getAppointmentDataByDateTimeStub;

  beforeEach(() => {
    getClaimDetailsStub = sinon.stub(actions, 'getClaimDetails');
    getAppointmentDataByDateTimeStub = sinon.stub(
      actions,
      'getAppointmentDataByDateTime',
    );
  });

  afterEach(() => {
    getClaimDetailsStub.restore();
    getAppointmentDataByDateTimeStub.restore();
  });

  describe('error handling', () => {
    it('should display error alert when claim details error exists', () => {
      const initialState = {
        travelPay: {
          claimDetails: {
            data: {},
            error: {
              message: 'Failed to fetch claim details',
            },
          },
          appointment: {
            data: null,
            isLoading: false,
            error: null,
          },
        },
      };

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
      const initialState = {
        travelPay: {
          claimDetails: {
            data: {
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
            },
            error: null,
          },
          appointment: {
            data: { id: 'appt-123' },
            isLoading: false,
            error: null,
          },
        },
      };

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
      const initialState = {
        featureToggles: {},
        travelPay: {
          claimDetails: {
            data: {},
            error: null,
          },
          appointment: {
            data: null,
            isLoading: false,
            error: null,
          },
        },
      };

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
      const initialState = {
        featureToggles: {},
        travelPay: {
          claimDetails: {
            data: {
              '123': {
                id: '123',
                claimNumber: 'TC123',
                claimStatus: 'Claim submitted',
                appointmentDate: '2025-12-15T10:00:00Z',
                facilityName: 'Test Facility',
                createdOn: '2025-12-15T10:00:00Z',
                modifiedOn: '2025-12-15T10:00:00Z',
              },
            },
            error: null,
          },
          appointment: {
            data: null,
            isLoading: false,
            error: null,
          },
        },
      };

      renderWithStoreAndRouter(<TravelClaimDetailsContent />, {
        initialState,
        path: '/claim/:id',
        initialEntries: ['/claim/123'],
        reducers: reducer,
      });

      expect(getClaimDetailsStub.called).to.be.false;
    });

    it('should render appointment data when available', () => {
      const initialState = {
        featureToggles: {},
        travelPay: {
          claimDetails: {
            data: {
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
            },
            error: null,
          },
          appointment: {
            data: {
              id: '123',
            },
            isLoading: false,
            error: null,
          },
        },
      };

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
      const initialState = {
        travelPay: {
          claimDetails: {
            data: {
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
            },
            error: null,
          },
          appointment: {
            data: null,
            isLoading: false,
            error: {
              message: 'Error',
            },
          },
        },
      };

      renderWithStoreAndRouter(<TravelClaimDetailsContent />, {
        initialState,
        path: '/claim/123',
        reducers: reducer,
      });

      expect(getAppointmentDataByDateTimeStub.called).to.be.false;
    });

    it('should not dispatch getAppointmentDataByDateTime when appointmentData already exists', () => {
      const initialState = {
        travelPay: {
          claimDetails: {
            data: {
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
            },
            error: null,
          },
          appointment: {
            data: {
              id: 'appt-123',
            },
            isLoading: false,
            error: null,
          },
        },
      };

      renderWithStoreAndRouter(<TravelClaimDetailsContent />, {
        initialState,
        path: '/claim/123',
        reducers: reducer,
      });

      expect(getAppointmentDataByDateTimeStub.called).to.be.false;
    });

    it('should not dispatch getAppointmentDataByDateTime when complexClaimsEnabled feature flag is false', () => {
      const initialState = {
        featureToggles: {
          /* eslint-disable camelcase */
          travel_pay_enable_complex_claims: false,
          /* eslint-enable camelcase */
        },
        travelPay: {
          claimDetails: {
            data: {
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
            },
            error: null,
          },
          appointment: {
            data: null,
            isLoading: false,
            error: null,
          },
        },
      };

      renderWithStoreAndRouter(<TravelClaimDetailsContent />, {
        initialState,
        path: '/claim/123',
        reducers: reducer,
      });

      expect(getAppointmentDataByDateTimeStub.called).to.be.false;
    });
  });

  describe('help text and additional content', () => {
    it('should always display help text and direct deposit information', () => {
      const initialState = {
        travelPay: {
          claimDetails: {
            data: {
              '123': {
                id: '123',
                appointment: {
                  appointmentDateTime: '2025-12-15T10:00:00Z',
                },
              },
            },
            error: null,
          },
          appointment: {
            data: {
              id: 'appt-123',
            },
            isLoading: false,
            error: null,
          },
        },
      };

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
      const initialState = {
        travelPay: {
          claimDetails: {
            data: {},
            error: {
              message: 'Error',
            },
          },
          appointment: {
            data: null,
            isLoading: false,
            error: null,
          },
        },
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
