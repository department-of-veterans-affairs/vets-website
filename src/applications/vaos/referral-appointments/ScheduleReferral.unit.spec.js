import React from 'react';
import { expect } from 'chai';
import {
  createTestStore,
  renderWithStoreAndRouter,
} from '../tests/mocks/setup';
import ScheduleReferral from './ScheduleReferral';
import { createReferral } from './utils/referrals';

describe('scheduleReferral component', () => {
  const referralDate = '2024-09-09';
  it('should display the subtitle correctly given different numbers of appointments', async () => {
    const referralOne = createReferral(referralDate, '111');
    const store = createTestStore();
    const screen = renderWithStoreAndRouter(
      <ScheduleReferral currentReferral={referralOne} />,
      {
        store,
      },
    );
    const subtitle = await screen.findByTestId('subtitle');
    expect(subtitle).to.contain.text('1 appointment');
  });
  it('should display the subtitle correctly given 2 appointments', async () => {
    const referralTwo = createReferral(referralDate, '222');
    const store = createTestStore();
    referralTwo.numberOfAppointments = 2;
    const screen = renderWithStoreAndRouter(
      <ScheduleReferral currentReferral={referralTwo} />,
      {
        store,
      },
    );
    const subtitle = await screen.findByTestId('subtitle');
    expect(subtitle).to.contain.text('2 appointments');
  });
});
