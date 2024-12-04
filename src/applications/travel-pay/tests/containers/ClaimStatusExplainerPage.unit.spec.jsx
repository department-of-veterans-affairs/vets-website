import React from 'react';
import { expect } from 'chai';
import { waitFor } from '@testing-library/react';
import sinon from 'sinon';

import { renderWithStoreAndRouter } from '@department-of-veterans-affairs/platform-testing/react-testing-library-helpers';
import ClaimStatusExplainerPage from '../../containers/pages/ClaimStatusExplainerPage';

describe('ClaimStatusExplainerPage', () => {
  const getState = ({
    featureTogglesAreLoading = false,
    hasStatusFeatureFlag = true,
  } = {}) => ({
    featureToggles: {
      loading: featureTogglesAreLoading,
      /* eslint-disable camelcase */
      travel_pay_power_switch: hasStatusFeatureFlag,
      /* eslint-enable camelcase */
    },
  });

  let oldLocation;
  beforeEach(() => {
    oldLocation = global.window.location;
    delete global.window.location;

    global.window.location = {
      replace: sinon.spy(),
    };
  });

  afterEach(() => {
    global.window.location = oldLocation;
  });

  it('Successfully renders', async () => {
    const screen = renderWithStoreAndRouter(<ClaimStatusExplainerPage />, {
      initialState: { ...getState() },
    });

    await waitFor(() => {
      expect(screen.queryByText('What does my claim status mean?')).to.exist;
    });
  });

  it('redirects to the root path when claim statuses feature flag is false', async () => {
    renderWithStoreAndRouter(<ClaimStatusExplainerPage />, {
      initialState: { ...getState({ hasStatusFeatureFlag: false }) },
    });

    await waitFor(() => {
      expect(window.location.replace.calledWith('/')).to.be.true;
    });
  });
});
