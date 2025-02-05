import React from 'react';
import sinon from 'sinon';
import { expect } from 'chai';
import { format } from 'date-fns';
import ReferralTaskCard from './ReferralTaskCard';
import { createReferralById } from '../utils/referrals';
import {
  createTestStore,
  renderWithStoreAndRouter,
} from '../../tests/mocks/setup';

describe('VAOS Component: ReferralTaskCard', () => {
  let sandbox;
  let clock;
  const now = new Date('2024-09-09T00:00:00Z');

  beforeEach(() => {
    // Set a fixed date for all tests
    sandbox = sinon.sandbox.create();
    clock = sinon.useFakeTimers({
      now,
      toFake: ['Date'],
    });
  });

  afterEach(() => {
    sandbox.restore();
    clock.restore();
  });

  const uuid = 'add2f0f4-a1ea-4dea-a504-a54ab57c68';
  const referralData = createReferralById('2024-09-06', uuid);
  referralData.ReferralExpirationDate = '2025-03-04';
  const expectedDateFormated = format(
    new Date(referralData.ReferralExpirationDate),
    'PP',
  );

  it('should not display referral task card with defaults', () => {
    const store = createTestStore();
    const screen = renderWithStoreAndRouter(<ReferralTaskCard />, { store });
    expect(screen.queryByRole('heading')).not.to.exist;
  });

  it('should display referral task card', () => {
    const store = createTestStore();

    const screen = renderWithStoreAndRouter(
      <ReferralTaskCard data={referralData} />,
      { store },
    );
    expect(
      screen.getByRole('heading', {
        level: 4,
        name: 'Schedule your physical therapy appointment',
      }),
    ).to.exist;
    expect(
      screen.getByText(
        `We’ve approved your referral for 1 appointment with a community care provider. You must schedule all appointments for this referral by ${expectedDateFormated}.`,
      ),
    ).to.exist;
    expect(screen.queryByTestId(`referral-task-card-schedule-referral-${uuid}`))
      .to.exist;
  });

  it('should display referral task card when there are multiple appointments', () => {
    const store = createTestStore();
    const referral = {
      ...referralData,
      numberOfAppointments: 3,
    };
    const screen = renderWithStoreAndRouter(
      <ReferralTaskCard data={referral} />,
      { store },
    );
    expect(
      screen.getByRole('heading', {
        name: 'Schedule your physical therapy appointment',
      }),
    ).to.exist;
    expect(
      screen.getByText(
        `We’ve approved your referral for 3 appointments with a community care provider. You must schedule all appointments for this referral by ${expectedDateFormated}.`,
      ),
    ).to.exist;
    expect(screen.queryByTestId(`referral-task-card-schedule-referral-${uuid}`))
      .to.exist;
  });

  it('should not display a referral task card when the referral has expired', () => {
    const store = createTestStore();
    const referral = {
      ...referralData,
      ReferralExpirationDate: '2024-09-08',
    };
    const screen = renderWithStoreAndRouter(
      <ReferralTaskCard data={referral} />,
      { store },
    );
    expect(screen.queryByRole('heading')).not.to.exist;
  });
});
