import React from 'react';
import { expect } from 'chai';
import { renderWithStoreAndRouter } from '@department-of-veterans-affairs/platform-testing/react-testing-library-helpers';
import { $ } from 'platform/forms-system/src/js/utilities/ui';
import TravelClaimDetailsContent from '../../components/TravelClaimDetailsContent';
import reducer from '../../redux/reducer';

describe('TravelClaimDetailsContent', () => {
  describe('error handling', () => {
    it('should display error alert when hasError prop is true', () => {
      const screen = renderWithStoreAndRouter(
        <TravelClaimDetailsContent hasError claimDetails={null} />,
        {
          initialState: {},
          path: '/claim/123',
          reducers: reducer,
        },
      );

      expect(screen.getByText('Something went wrong on our end')).to.exist;
      expect(screen.getByText(/status in this tool right now/i)).to.exist;
      expect(
        $(
          'va-link[href="/health-care/get-reimbursed-for-travel-pay/"][text="Find out how to file for travel reimbursement"]',
        ),
      ).to.exist;
    });

    it('should render ClaimDetailsContent when claim data prop is provided', () => {
      const claimDetails = {
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
      };

      const screen = renderWithStoreAndRouter(
        <TravelClaimDetailsContent
          claimDetails={claimDetails}
          hasError={false}
        />,
        {
          initialState: {},
          path: '/claim/123',
          reducers: reducer,
        },
      );

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

  describe('rendering without claim data', () => {
    it('should render content even when claimDetails prop is null', () => {
      const screen = renderWithStoreAndRouter(
        <TravelClaimDetailsContent claimDetails={null} hasError={false} />,
        {
          initialState: {},
          path: '/claim/123',
          reducers: reducer,
        },
      );

      // Component should render the static content even without claim data
      expect(screen.getByText(/eligible for reimbursement/i)).to.exist;
    });
  });

  describe('help text and additional content', () => {
    it('should always display help text and direct deposit information', () => {
      const claimDetails = {
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
      };

      const screen = renderWithStoreAndRouter(
        <TravelClaimDetailsContent
          claimDetails={claimDetails}
          hasError={false}
        />,
        {
          initialState: {},
          path: '/claim/123',
          reducers: reducer,
        },
      );

      expect(screen.getByText(/eligible for reimbursement/i)).to.exist;
      expect(
        $(
          'va-link[href="/resources/how-to-set-up-direct-deposit-for-va-travel-pay-reimbursement/"][text="Learn how to set up direct deposit for travel pay"]',
        ),
      ).to.exist;
    });

    it('should display contact information in error alert', () => {
      const screen = renderWithStoreAndRouter(
        <TravelClaimDetailsContent hasError claimDetails={null} />,
        {
          initialState: {},
          path: '/claim/123',
          reducers: reducer,
        },
      );

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
