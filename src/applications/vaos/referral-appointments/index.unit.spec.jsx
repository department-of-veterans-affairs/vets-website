import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';
import { waitFor } from '@testing-library/react';
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

describe('VAOS ReferralAppointments router component', () => {
  const sandbox = sinon.createSandbox();

  beforeEach(() => {
    sandbox.stub(useManualScrollRestoration, 'default');
    sandbox.stub(useIsInPilotUserStations, 'useIsInPilotUserStations').returns({
      isInPilotUserStations: true,
    });
  });

  afterEach(() => {
    sandbox.restore();
  });

  it('should render ScheduleReferral component for base path', () => {
    const screen = renderWithStoreAndRouter(<ReferralAppointments />, {
      initialState,
      path: '/referrals',
    });

    // ScheduleReferral component should render
    expect(screen.container).to.exist;
  });

  it('should render ChooseDateAndTime component for /date-time path', () => {
    const screen = renderWithStoreAndRouter(<ReferralAppointments />, {
      initialState,
      path: '/referrals/date-time',
    });

    expect(screen.container).to.exist;
  });

  it('should render ReviewAndConfirm component for /review path', () => {
    const screen = renderWithStoreAndRouter(<ReferralAppointments />, {
      initialState,
      path: '/referrals/review',
    });

    expect(screen.container).to.exist;
  });

  it('should render CompleteReferral component for /complete/:appointmentId path', () => {
    const screen = renderWithStoreAndRouter(<ReferralAppointments />, {
      initialState,
      path: '/referrals/complete/test-appointment-id',
    });

    expect(screen.container).to.exist;
  });

  it('should redirect to home when user is not in pilot stations', async () => {
    useIsInPilotUserStations.useIsInPilotUserStations.restore();
    sandbox.stub(useIsInPilotUserStations, 'useIsInPilotUserStations').returns({
      isInPilotUserStations: false,
    });

    const screen = renderWithStoreAndRouter(<ReferralAppointments />, {
      initialState,
      path: '/referrals',
    });

    await waitFor(() => {
      expect(screen.history.location.pathname).to.equal('/');
    });
  });

  it('should call useManualScrollRestoration hook', () => {
    renderWithStoreAndRouter(<ReferralAppointments />, {
      initialState,
      path: '/referrals',
    });

    expect(useManualScrollRestoration.default.calledOnce).to.be.true;
  });
});
