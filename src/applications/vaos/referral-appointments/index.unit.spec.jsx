import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';

import ReferralAppointments from './index';
import { renderWithStoreAndRouter } from '../tests/mocks/setup';
import * as useManualScrollRestoration from '../hooks/useManualScrollRestoration';
import * as useIsInPilotUserStations from './hooks/useIsInPilotUserStations';

const initialState = {
  featureToggles: {
    vaOnlineSchedulingCancel: true,
    vaOnlineSchedulingCCDirectScheduling: true,
  },
};

describe('ReferralAppointments', () => {
  const sandbox = sinon.createSandbox();
  let useIsInPilotUserStationsStub;

  beforeEach(() => {
    sandbox.stub(useManualScrollRestoration, 'default');
    useIsInPilotUserStationsStub = sandbox
      .stub(useIsInPilotUserStations, 'useIsInPilotUserStations')
      .returns({
        isInPilotUserStations: true,
      });
  });

  afterEach(() => {
    sandbox.restore();
  });

  it('should redirect to home when user is not in pilot stations', () => {
    useIsInPilotUserStationsStub.returns({
      isInPilotUserStations: false,
    });

    const screen = renderWithStoreAndRouter(<ReferralAppointments />, {
      initialState,
      path: '/schedule-referral',
    });

    expect(screen.history.location.pathname).to.equal('/');
  });

  it('should render routes when user is in pilot stations', () => {
    const screen = renderWithStoreAndRouter(<ReferralAppointments />, {
      initialState,
      path: '/schedule-referral',
    });

    // Should not redirect when isInPilotUserStations is true
    expect(screen.history.location.pathname).to.equal('/schedule-referral');
  });
});
