import React from 'react';
import { expect } from 'chai';
import { format } from 'date-fns';
import ScheduleReferral from './ScheduleReferral';
import {
  createTestStore,
  renderWithStoreAndRouter,
} from '../tests/mocks/setup';
import { createReferralById, getReferralSlotKey } from './utils/referrals';

describe('VAOS Component: ScheduleReferral', () => {
  afterEach(() => {
    sessionStorage.clear();
  });
  const referralDate = '2024-09-09';
  it('should display the subtitle correctly given different numbers of appointments', async () => {
    const referralOne = createReferralById(referralDate, '111');
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
    const referralTwo = createReferralById(referralDate, '222');
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

  it('should render with default data', async () => {
    const referral = createReferralById(referralDate, '111');

    const store = createTestStore();

    const screen = renderWithStoreAndRouter(
      <ScheduleReferral currentReferral={referral} />,
      {
        store,
      },
    );

    const details = await screen.findByTestId('referral-details');
    const facility = await screen.findByTestId('referral-facility');
    const helpText = await screen.findByTestId('help-text');
    const additionalAppointmentHelpText = await screen.findByTestId(
      'additional-appointment-help-text',
    );

    const expectedDate = format(
      new Date(referral.ReferralExpirationDate),
      'MMMM d, yyyy',
    );

    expect(details).to.exist;
    expect(details).to.contain.text(expectedDate);
    expect(helpText).to.exist;
    expect(additionalAppointmentHelpText).to.exist;

    expect(facility).to.exist;
  });
  it('should reset slot selection', async () => {
    const referral = createReferralById(referralDate, '222');
    const selectedSlotKey = getReferralSlotKey(referral.UUID);
    sessionStorage.setItem(selectedSlotKey, '0');
    const initialState = {
      featureToggles: {
        vaOnlineSchedulingCCDirectScheduling: true,
      },
      referral: {
        currentPage: 'scheduleAppointment',
        selectedSlot: '0',
      },
    };
    renderWithStoreAndRouter(<ScheduleReferral currentReferral={referral} />, {
      initialState,
    });
    expect(sessionStorage.getItem(selectedSlotKey)).to.be.null;
  });
});
