import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';
import MockDate from 'mockdate';
import {
  renderWithStoreAndRouter,
  createTestStore,
} from '../../tests/mocks/setup';
import ReferralTaskCardWithReferral from './ReferralTaskCardWithReferral';
import { createReferralById } from '../utils/referrals';
import * as vaosApi from '../../redux/api/vaosApi';

describe('VAOS Component: ReferralTaskCardWithReferral', () => {
  const sandbox = sinon.createSandbox();
  let getReferallByIdStub;

  beforeEach(() => {
    MockDate.set('2025-01-01');
    getReferallByIdStub = sandbox.stub(vaosApi, 'useGetReferralByIdQuery');
  });

  afterEach(() => {
    MockDate.reset();
    sandbox.restore();
  });

  it('should display the task card when the referral is fetched successfully', () => {
    const store = createTestStore();
    getReferallByIdStub.returns({
      data: createReferralById(
        '2025-12-12',
        'add2f0f4-a1ea-4dea-a504-a54ab57c6801',
      ),
      error: null,
      isLoading: false,
    });

    const screen = renderWithStoreAndRouter(<ReferralTaskCardWithReferral />, {
      store,
      path: '/?id=add2f0f4-a1ea-4dea-a504-a54ab57c6801',
    });

    expect(screen.findByTestId('referral-task-card')).to.exist;
  });

  it('should not display anything when url parameter is not populated', () => {
    const store = createTestStore();
    // restore the stub to test it's behavior with no id passed in
    sandbox.restore();

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

  it('should display the expired alert when referral is expired', () => {
    const store = createTestStore();
    getReferallByIdStub.returns({
      data: createReferralById(
        '2024-01-01',
        'add2f0f4-a1ea-4dea-a504-a54ab57c6801',
      ),
      error: null,
      isLoading: false,
    });

    const screen = renderWithStoreAndRouter(<ReferralTaskCardWithReferral />, {
      store,
      path: '/?id=445e2d1b-7150-4631-97f2-f6f473bdef00',
    });

    expect(screen.getByTestId('expired-alert')).to.exist;
  });

  it('isExpired should return true and expired alert when referral has no expired date', () => {
    const store = createTestStore();
    const referral = createReferralById(
      '2024-12-01',
      'add2f0f4-a1ea-4dea-a504-a54ab57c6801',
    );
    referral.attributes.expirationDate = '';

    getReferallByIdStub.returns({
      data: referral,
      error: null,
      isLoading: false,
    });

    const screen = renderWithStoreAndRouter(<ReferralTaskCardWithReferral />, {
      store,
      path: '/?id=445e2d1b-7150-4631-97f2-f6f473bdef00',
    });

    expect(screen.getByTestId('expired-alert')).to.exist;
  });

  it('should display the loading component when fetch status is loading', () => {
    const store = createTestStore();
    getReferallByIdStub.returns({
      data: null,
      error: null,
      isLoading: true,
    });

    const screen = renderWithStoreAndRouter(<ReferralTaskCardWithReferral />, {
      store,
      path: '/?id=1234',
    });
    expect(screen.getByTestId('loading-indicator')).to.exist;
  });

  it('should display the error alert when fetch fails', () => {
    const store = createTestStore();
    getReferallByIdStub.returns({
      data: null,
      error: true,
      isLoading: false,
    });

    const screen = renderWithStoreAndRouter(<ReferralTaskCardWithReferral />, {
      store,
      path: '/?id=error',
    });

    expect(screen.getByTestId('referral-error')).to.exist;
  });
});
