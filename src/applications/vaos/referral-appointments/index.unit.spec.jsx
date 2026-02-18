import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';

import { waitFor } from '@testing-library/react';
import ReferralAppointments from './index';
import { renderWithStoreAndRouter } from '../tests/mocks/setup';
import { FETCH_STATUS } from '../utils/constants';
import { createReferralById } from './utils/referrals';
import MockReferralListResponse from '../tests/fixtures/MockReferralListResponse';
import * as useManualScrollRestoration from '../hooks/useManualScrollRestoration';
import * as useIsInPilotUserStations from './hooks/useIsInPilotUserStations';
import * as vaosApi from '../redux/api/vaosApi';

const initialStateVAOSService = {
  featureToggles: {
    vaOnlineSchedulingCCDirectScheduling: true,
  },
};

describe('ReferralAppointments', () => {
  const sandbox = sinon.createSandbox();

  beforeEach(() => {
    sandbox.stub(vaosApi, 'useGetReferralByIdQuery').returns({
      data: createReferralById(
        '2024-11-29',
        'add2f0f4-a1ea-4dea-a504-a54ab57c6801',
      ),
      error: false,
      isLoading: false,
    });
    sandbox.stub(useManualScrollRestoration, 'default');
    sandbox.stub(useIsInPilotUserStations, 'useIsInPilotUserStations').returns({
      isInPilotUserStations: true,
    });
  });

  afterEach(() => {
    sandbox.restore();
  });

  it('should render loading layout when referral is loading', async () => {
    vaosApi.useGetReferralByIdQuery.returns({
      data: null,
      error: false,
      isLoading: true,
    });
    const initialState = {
      ...initialStateVAOSService,
      referral: {
        referralsFetchStatus: FETCH_STATUS.loading,
      },
    };

    const screen = renderWithStoreAndRouter(<ReferralAppointments />, {
      initialState,
      path: '/?id=445e2d1b-7150-4631-97f2-f6f473bdef00',
    });

    expect(screen.getByTestId('loading-container')).to.exist;
  });

  it('should render error layout when there is an error fetching referral', async () => {
    vaosApi.useGetReferralByIdQuery.returns({
      data: null,
      error: true,
      isLoading: false,
    });
    const initialState = {
      ...initialStateVAOSService,
      referral: {
        referralsFetchStatus: FETCH_STATUS.succeeded,
      },
    };

    const screen = renderWithStoreAndRouter(<ReferralAppointments />, {
      initialState,
      path: '/?id=445e2d1b-7150-4631-97f2-f6f473bdef00',
    });

    await waitFor(() => {
      expect(screen.getByText('We’re sorry. We’ve run into a problem.')).to
        .exist;
    });

    // Check the back link
    expect(screen.getByTestId('back-link')).to.have.attribute(
      'text',
      'Back to appointments',
    );
    expect(screen.getByTestId('referral-layout-heading')).to.have.text(
      'Something went wrong on our end',
    );
    expect(screen.getByTestId('referral-community-care-office')).to.exist;
  });

  it('should render ScheduleReferral for the base path', async () => {
    const initialState = {
      ...initialStateVAOSService,
      referral: {
        referralsFetchStatus: FETCH_STATUS.succeeded,
      },
    };

    const screen = renderWithStoreAndRouter(<ReferralAppointments />, {
      initialState,
      path: '/?id=add2f0f4-a1ea-4dea-a504-a54ab57c6801',
    });

    await waitFor(() => {
      // Looking for elements that would be in ScheduleReferral component
      expect(screen.getByTestId('schedule-appointment-button')).to.exist;
    });
  });

  it('should redirect to referrals-requests page if referral has appointments', async () => {
    const referralWithAppointments = createReferralById(
      '2024-11-29',
      'add2f0f4-a1ea-4dea-a504-a54ab57c6801',
    );
    referralWithAppointments.attributes.hasAppointments = true;

    vaosApi.useGetReferralByIdQuery.returns({
      data: referralWithAppointments,
      error: false,
      isLoading: true,
    });

    const referralsResponse = new MockReferralListResponse({
      numberOfReferrals: 3,
    }).toJSON();

    const initialState = {
      ...initialStateVAOSService,
      referral: {
        referrals: referralsResponse.data,
        referralsFetchStatus: FETCH_STATUS.succeeded,
      },
    };

    const screen = renderWithStoreAndRouter(<ReferralAppointments />, {
      initialState,
      path: '/date-time?id=add2f0f4-a1ea-4dea-a504-a54ab57c6801',
    });

    await waitFor(() => {
      expect(screen.history.location.pathname).to.equal('/referrals-requests');
    });
  });
});
