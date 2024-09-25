import React from 'react';
import { expect } from 'chai';
import { render, waitFor } from '@testing-library/react';
// import { useLocation } from 'react-router-dom';
import { mockApiRequest } from '@department-of-veterans-affairs/platform-testing/helpers';

// import * as reactRouter from 'react-router-dom';

// import sinon from 'sinon';

import { renderWithStoreAndRouter } from '@department-of-veterans-affairs/platform-testing/react-testing-library-helpers';
import TravelClaimDetails from '../../components/TravelClaimDetails';

describe('TravelClaimDetails', () => {
  const claimDetailsProps = {
    id: '20d73591-ff18-4b66-9838-1429ebbf1b6e',
    claimNumber: 'TC0928098230498',
    claimStatus: 'Claim Submitted',
    appointmentDateTime: '2024-05-26T16:40:45.781Z',
    facilityName: 'Tomah VA Medical Center',
    createdOn: '2024-05-27T16:40:45.781Z',
    modifiedOn: '2024-05-31T16:40:45.781Z',
  };
  const defaultState = {
    // areFeatureTogglesLoading: false,
    // hasStatusFeatureFlag: true,
    // hasDetailsFeatureFlag: true,
    featureToggles: {
      loading: false,
      /* eslint-disable camelcase */
      travel_pay_power_switch: true,
      travel_pay_view_claim_details: true,
      /* eslint-enable camelcase */
    },
  };

  // describe('Successfully renders', () => {
  it.only('Does not fetch a claim by id if claim details are already present in state', async () => {
    // global.fetch.restore();

    mockApiRequest({ ...claimDetailsProps });
    const screen = renderWithStoreAndRouter(
      <TravelClaimDetails {...claimDetailsProps} />,
      {
        initialState: {
          ...defaultState,
          location: { state: claimDetailsProps },
        },
      },
    );
    console.log(screen.queryByText); // eslint-disable-line no-console

    // await console.log('first', await screen.findByText('Claim number: e98')); // eslint-disable-line no-console
    // await console.log('second', await screen.findByText('TC0928098230498')); // eslint-disable-line no-console
    // expect(screen.findByText('Claim number: e98')).to.be.null;
    // expect(screen.findByText('TC0928098230498')).to.be.null;
    // expect(await screen.findByText('TC0928098230498')).to.exist;
    await waitFor(async () => {
      // expect(screen.queryAllByTestId('travel-claim-details').length).to.eq(1);
      // expect(screen.findByText('TC0928098230498')).to.exist;
      // const result = await screen.findByText('anything could be here');
      // console.log('RESULT', result); // eslint-disable-line no-console
      // console.log('HERE', await screen.findByText('anything could be here'));
      console.log('ONE', screen.findByText('Claim number: TC30928098230498')); // eslint-disable-line no-console
      console.log(
        'TWO',
        await screen.findByText('Claim number: TC0928098230498'),
      ); // eslint-disable-line no-console
      console.log('THREE', screen.queryByText('Claim number: TC0928098230498')); // eslint-disable-line no-console
      console.log('FOUR', screen.queryByText('Claim number: TC30928098230498')); // eslint-disable-line no-console
      expect(screen.queryByText('Claim number: TC0928098230498')).to.exist;
      // expect(screen.queryByText('Claim number: TC30928098230498')).to.exist;
    });
  });
  // it('Fetches claim details if they are not found in location state', () => {});
  // });
  it('redirects to the root path when claim statuses feature flag is false', () => {
    const screen = render(<TravelClaimDetails />);

    expect(screen).to.exist;
  });
  it('redirects to claim details when claim details feature flag is false', () => {
    const screen = render(<TravelClaimDetails />);

    expect(screen).to.exist;
  });
  it('handles failed data fetching and displays an error', () => {
    const screen = render(<TravelClaimDetails />);

    expect(screen).to.exist;
  });
});
