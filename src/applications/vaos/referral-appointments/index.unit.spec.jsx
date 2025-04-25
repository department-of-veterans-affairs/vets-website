import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';

import { waitFor } from '@testing-library/react';
import * as servicesUtils from 'applications/vaos/services/utils';
import ReferralAppointments from './index';
import { renderWithStoreAndRouter } from '../tests/mocks/setup';
import { FETCH_STATUS } from '../utils/constants';
import { createReferrals, createReferralById } from './utils/referrals';
import * as useManualScrollRestoration from '../hooks/useManualScrollRestoration';
import * as utils from '../utils/scrollAndFocus';
import * as useIsInCCPilot from './hooks/useIsInCCPilot';

const initialStateVAOSService = {
  featureToggles: {
    vaOnlineSchedulingCancel: true,
    vaOnlineSchedulingVAOSServiceRequests: true,
    vaOnlineSchedulingCCDirectScheduling: true,
  },
};

describe('ReferralAppointments', () => {
  let sandbox;

  beforeEach(() => {
    sandbox = sinon.createSandbox();

    sandbox.stub(servicesUtils, 'apiRequestWithUrl');
    sandbox.stub(useManualScrollRestoration, 'default');
    sandbox.stub(utils, 'scrollAndFocus');
    sandbox.stub(useIsInCCPilot, 'useIsInCCPilot').returns({
      isInCCPilot: true,
    });
  });

  afterEach(() => {
    sandbox.restore();
  });

  it('should call useManualScrollRestoration() on loading component', () => {
    const initialState = {
      ...initialStateVAOSService,
      referral: {
        referrals: createReferrals(3, '2024-11-20'),
        referralsFetchStatus: FETCH_STATUS.succeeded,
      },
      appointments: {
        pending: [],
        pendingStatus: FETCH_STATUS.succeeded,
      },
    };

    renderWithStoreAndRouter(<ReferralAppointments />, {
      initialState,
    });

    expect(useManualScrollRestoration.default.called).to.be.true;
  });

  it('should call scrollAndFocus h2 if error', async () => {
    servicesUtils.apiRequestWithUrl.rejects(new Error('Internal Server Error'));

    const initialState = {
      ...initialStateVAOSService,
      referral: {
        referrals: createReferrals(3, '2024-11-20'),
        referralsFetchStatus: FETCH_STATUS.succeeded,
      },
      appointments: {
        pending: [],
        pendingStatus: FETCH_STATUS.succeeded,
      },
    };

    renderWithStoreAndRouter(<ReferralAppointments />, {
      initialState,
      path: '/?id=445e2d1b-7150-4631-97f2-f6f473bdef00',
    });

    await waitFor(() => {
      expect(utils.scrollAndFocus.called).to.be.true;
      expect(utils.scrollAndFocus.calledWith('h2')).to.be.true;
    });
  });

  it('should call scrollAndFocus with h1 if referral is available', async () => {
    servicesUtils.apiRequestWithUrl.resolves({
      data: createReferralById(
        '2024-11-29',
        'add2f0f4-a1ea-4dea-a504-a54ab57c6801',
      ),
    });

    const initialState = {
      ...initialStateVAOSService,
      referral: {
        referrals: createReferrals(3, '2024-11-20'),
        referralsFetchStatus: FETCH_STATUS.succeeded,
      },
      appointments: {
        pending: [],
        pendingStatus: FETCH_STATUS.succeeded,
      },
    };

    renderWithStoreAndRouter(<ReferralAppointments />, {
      initialState,
      path: '/?id=445e2d1b-7150-4631-97f2-f6f473bdef00',
    });

    await waitFor(() => {
      expect(utils.scrollAndFocus.called).to.be.true;
      expect(utils.scrollAndFocus.calledWith('h1')).to.be.true;
    });
  });
});
