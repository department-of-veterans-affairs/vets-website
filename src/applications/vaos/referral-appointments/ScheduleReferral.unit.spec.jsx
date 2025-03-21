import React from 'react';
import { expect } from 'chai';
import { format } from 'date-fns';
import { waitFor } from '@testing-library/dom';
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
      new Date(referral.expirationDate),
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
    const selectedSlotKey = getReferralSlotKey(referral.uuid);
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
    await waitFor(() => {
      expect(sessionStorage.getItem(selectedSlotKey)).to.be.null;
    });
  });
});
