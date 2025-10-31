import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';

import { renderWithStoreAndRouter } from '@department-of-veterans-affairs/platform-testing/react-testing-library-helpers';
import ClaimStatusExplainerPage from '../../containers/pages/ClaimStatusExplainerPage';

describe('ClaimStatusExplainerPage', () => {
  const getState = ({
    featureTogglesAreLoading = false,
    hasClaimsManagementFeatureFlag = false,
  } = {}) => ({
    featureToggles: {
      loading: featureTogglesAreLoading,
      /* eslint-disable camelcase */
      travel_pay_claims_management: hasClaimsManagementFeatureFlag,
    },
  });

  let oldLocation;

  beforeEach(() => {
    oldLocation = global.window.location;
    global.window.location = {};
    global.window.location.replace = sinon.spy();
  });

  afterEach(() => {
    global.window.location = oldLocation;
  });

  it('Successfully renders', () => {
    const screen = renderWithStoreAndRouter(<ClaimStatusExplainerPage />, {
      initialState: { ...getState() },
    });

    expect(screen.queryByText('What does my claim status mean?')).to.exist;
  });

  it('shows a loading spinner of toggles are loading', () => {
    const screenFeatureToggle = renderWithStoreAndRouter(
      <ClaimStatusExplainerPage />,
      {
        initialState: { ...getState({ featureTogglesAreLoading: true }) },
      },
    );

    expect(screenFeatureToggle.getByTestId('travel-pay-loading-indicator')).to
      .exist;
  });

  it('redirects to /my-health/travel-pay/claims/ when claims management feature flag is true', () => {
    renderWithStoreAndRouter(<ClaimStatusExplainerPage />, {
      initialState: { ...getState({ hasClaimsManagementFeatureFlag: true }) },
    });

    expect(window.location.replace.calledWith('/my-health/travel-pay/claims/'))
      .to.be.true;
  });
});
