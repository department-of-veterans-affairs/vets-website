import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';
import MockDate from 'mockdate';
import { waitFor } from '@testing-library/dom';
import * as utils from 'applications/vaos/services/utils';
import {
  renderWithStoreAndRouter,
  createTestStore,
} from '../../tests/mocks/setup';
import ReferralTaskCardWithReferral from './ReferralTaskCardWithReferral';

import { createReferralById } from '../utils/referrals';

describe('VAOS Component: ReferralTaskCardWithReferral', () => {
  let apiRequestWithUrlStub;

  beforeEach(() => {
    MockDate.set('2025-01-01');
    apiRequestWithUrlStub = sinon.stub(utils, 'apiRequestWithUrl');
  });

  afterEach(() => {
    MockDate.reset();
    apiRequestWithUrlStub.restore();
  });

  it('should display the task card when the referral is fetched successfully', async () => {
    const store = createTestStore();

    apiRequestWithUrlStub.resolves({
      data: createReferralById(
        '2024-11-29',
        'add2f0f4-a1ea-4dea-a504-a54ab57c6801',
      ),
    });

    const screen = renderWithStoreAndRouter(<ReferralTaskCardWithReferral />, {
      store,
      path: '/?id=add2f0f4-a1ea-4dea-a504-a54ab57c6801',
    });

    expect(await screen.findByTestId('referral-task-card')).to.exist;
  });

  it('should not display anything when url parameter is not populated', async () => {
    const store = createTestStore();
    apiRequestWithUrlStub.resolves({
      data: createReferralById(
        '2024-11-29',
        'add2f0f4-a1ea-4dea-a504-a54ab57c6801',
      ),
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
  });

  it('should display the expired alert when referral is expired', async () => {
    const store = createTestStore();

    apiRequestWithUrlStub.resolves({
      data: createReferralById(
        '2024-11-29',
        'add2f0f4-a1ea-4dea-a504-a54ab57c6801',
        '111',
        '2024-12-01',
      ),
    });

    const screen = renderWithStoreAndRouter(<ReferralTaskCardWithReferral />, {
      store,
      path: '/?id=445e2d1b-7150-4631-97f2-f6f473bdef00',
    });

    waitFor(() => {
      expect(screen.getByTestId('expired-alert')).to.exist;
    });
  });

  it('should display the loading component when fetch status is loading', async () => {
    const store = createTestStore();
    apiRequestWithUrlStub.resolves({
      data: createReferralById(
        '2024-11-29',
        'add2f0f4-a1ea-4dea-a504-a54ab57c6801',
      ),
    });

    const screen = renderWithStoreAndRouter(<ReferralTaskCardWithReferral />, {
      store,
      path: '/?id=1234',
    });
    expect(screen.getByTestId('loading-indicator')).to.exist;
  });

  it('should display the loading component when fetch status is notStarted', async () => {
    const store = createTestStore();

    apiRequestWithUrlStub.resolves({
      data: createReferralById(
        '2024-11-29',
        'add2f0f4-a1ea-4dea-a504-a54ab57c6801',
      ),
    });

    const screen = renderWithStoreAndRouter(<ReferralTaskCardWithReferral />, {
      store,
      path: '/?id=1234',
    });
    expect(screen.getByTestId('loading-indicator')).to.exist;
  });

  it('should display the error alert when fetch fails', async () => {
    const store = createTestStore();
    apiRequestWithUrlStub.rejects(new Error('Internal Server Error'));

    const screen = renderWithStoreAndRouter(<ReferralTaskCardWithReferral />, {
      store,
      path: '/?id=error',
    });

    waitFor(() => {
      expect(screen.getByTestId('referral-error')).to.exist;
    });
  });
});
