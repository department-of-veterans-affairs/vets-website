import React from 'react';
import { expect } from 'chai';
// import { render } from '@testing-library/react';
import { renderWithStoreAndRouter } from '@department-of-veterans-affairs/platform-testing/react-testing-library-helpers';

import TravelClaimCard from '../../components/TravelClaimCard';

describe('TravelClaimCard', () => {
  const props = {
    id: '6cecf332-65af-4495-b18e-7fd28ccb546a',
    claimNumber: '39b7b38f-b7cf-4d19-91cf-fb5360c0b8b8',
    claimName: '3583ec0e-34e0-4cf5-99d6-78930c2be969',
    claimStatus: 'Saved',
    appointmentDateTime: '2023-09-21T17:11:43.034Z',
    appointmentName: 'Medical imaging',
    appointmentLocation: 'Tomah VA Medical Center',
    createdOn: '2023-09-22T17:11:43.034Z',
    modifiedOn: '2023-09-27T17:11:43.034Z',
    canViewClaimDetails: false,
  };

  it('should still render when an unknown status is given', () => {
    const screen = renderWithStoreAndRouter(
      <TravelClaimCard {...props} claimStatus="Something" />,
      {
        initialState: {},
      },
    );

    expect(screen.getByText('Claim status: Something')).to.exist;
  });

  it('should render proper text when a null appointment date is given', () => {
    const screen = renderWithStoreAndRouter(
      <TravelClaimCard {...props} appointmentDateTime={null} />,
      {
        initialState: {},
      },
    );

    expect(screen.getByText('Appointment information not available')).to.exist;
  });

  it('should render link to claim details when toggle is true', () => {
    const screen = renderWithStoreAndRouter(
      <TravelClaimCard {...props} canViewClaimDetails />,
      {
        initialState: {},
      },
    );

    expect(screen.getByText('Travel reimbursement claim details')).to.exist;
  });
});
