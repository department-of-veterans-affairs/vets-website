import React from 'react';
import { expect } from 'chai';
import MockDate from 'mockdate';
import sinon from 'sinon';
import {
  renderWithStoreAndRouter,
  createTestStore,
} from '../../tests/mocks/setup';
import ReferralTaskCardWithReferral from './ReferralTaskCardWithReferral';

import { createReferralById } from '../utils/referrals';
import { FETCH_STATUS } from '../../utils/constants';
import * as useGetReferralByIdModule from '../hooks/useGetReferralById';

describe('VAOS Component: ReferralTaskCardWithReferral', () => {
  beforeEach(() => {
    // Set the current date to after the referral date but before the expiration date
    MockDate.set('2025-01-01');
  });
  afterEach(() => {
    MockDate.reset();
  });

  it('should display the task card when the referral is fetched successfully', async () => {
    const store = createTestStore();
    const useGetReferralByIdStub = sinon
      .stub(useGetReferralByIdModule, 'useGetReferralById')
      .returns({
        referral: createReferralById(
          '2024-11-29',
          'add2f0f4-a1ea-4dea-a504-a54ab57c6801',
        ),
        referralFetchStatus: FETCH_STATUS.succeeded,
      });

    const screen = renderWithStoreAndRouter(<ReferralTaskCardWithReferral />, {
      store,
      path: '/?id=add2f0f4-a1ea-4dea-a504-a54ab57c6801',
    });
    expect(await screen.findByTestId('referral-task-card')).to.exist;
    useGetReferralByIdStub.restore();
  });

  it('should not display anything when url paramter is not populated', async () => {
    const store = createTestStore();
    const useGetReferralByIdStub = sinon
      .stub(useGetReferralByIdModule, 'useGetReferralById')
      .returns({
        referral: undefined,
        referralFetchStatus: FETCH_STATUS.notStarted,
      });
    const screen = renderWithStoreAndRouter(<ReferralTaskCardWithReferral />, {
      store,
      path: '/?id=',
    });

    const taskCard = screen.queryByTestId('referral-task-card');
    const error = screen.queryByTestId('referral-error');
    const loading = screen.queryByTestId('loading-indicator');
    const expired = screen.queryByTestId('expired-alert');
    expect(taskCard).to.be.null;
    expect(error).to.be.null;
    expect(loading).to.be.null;
    expect(expired).to.be.null;
    useGetReferralByIdStub.restore();
  });

  it('should display the expired alert when referral is expired', async () => {
    const store = createTestStore();
    const useGetReferralByIdStub = sinon
      .stub(useGetReferralByIdModule, 'useGetReferralById')
      .returns({
        referral: createReferralById(
          '2024-11-29',
          '445e2d1b-7150-4631-97f2-f6f473bdef00',
          '111',
          '2024-12-01',
        ),
        referralFetchStatus: FETCH_STATUS.succeeded,
      });
    const screen = renderWithStoreAndRouter(<ReferralTaskCardWithReferral />, {
      store,
      path: '/?id=445e2d1b-7150-4631-97f2-f6f473bdef00',
    });
    expect(screen.getByTestId('expired-alert')).to.exist;
    useGetReferralByIdStub.restore();
  });

  it('should display the loading component when fetch status is loading', async () => {
    const store = createTestStore();
    const useGetReferralByIdStub = sinon
      .stub(useGetReferralByIdModule, 'useGetReferralById')
      .returns({
        referral: undefined,
        referralFetchStatus: FETCH_STATUS.loading,
      });
    const screen = renderWithStoreAndRouter(<ReferralTaskCardWithReferral />, {
      store,
      path: '/?id=1234',
    });
    expect(screen.getByTestId('loading-indicator')).to.exist;
    useGetReferralByIdStub.restore();
  });

  it('should display the loading component when fetch status is notStarted', async () => {
    const store = createTestStore();
    const useGetReferralByIdStub = sinon
      .stub(useGetReferralByIdModule, 'useGetReferralById')
      .returns({
        referral: undefined,
        referralFetchStatus: FETCH_STATUS.notStarted,
      });
    const screen = renderWithStoreAndRouter(<ReferralTaskCardWithReferral />, {
      store,
      path: '/?id=1234',
    });
    expect(screen.getByTestId('loading-indicator')).to.exist;
    useGetReferralByIdStub.restore();
  });

  it('should display the error alert when fetch fails', async () => {
    const store = createTestStore();
    const useGetReferralByIdStub = sinon
      .stub(useGetReferralByIdModule, 'useGetReferralById')
      .returns({
        referral: undefined,
        referralFetchStatus: FETCH_STATUS.failed,
      });
    const screen = renderWithStoreAndRouter(<ReferralTaskCardWithReferral />, {
      store,
      path: '/?id=error',
    });
    expect(screen.getByTestId('referral-error')).to.exist;
    useGetReferralByIdStub.restore();
  });
});
