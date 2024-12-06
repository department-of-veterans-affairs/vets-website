import React from 'react';
import { expect } from 'chai';
import { format } from 'date-fns';
import ScheduleReferral from './ScheduleReferral';
import {
  createTestStore,
  renderWithStoreAndRouter,
} from '../tests/mocks/setup';
import { createReferral } from './utils/referrals';

describe('VAOS Component: ScheduleReferral', () => {
  it('should display the subtitle correctly given different numbers of appointments', async () => {
    const referralOne = createReferral(new Date(), '111');
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
    const referralTwo = createReferral(new Date(), '222');
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
    const referral = createReferral(new Date(), '111');

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
    expect(details).to.contain.text('Type of care: Cardiology');
    expect(details).to.contain.text('Provider: Dr. Face');
    expect(details).to.contain.text('Location: New skin technologies bldg 2');
    expect(details).to.contain.text('Number of appointments: 1');
    expect(details).to.contain.text('Referral number: VA0000009880');
    expect(helpText).to.exist;
    expect(additionalAppointmentHelpText).to.exist;

    expect(facility).to.exist;
    expect(facility).to.contain.text(
      'Referring VA facility: Batavia VA Medical Center',
    );
    expect(facility).to.contain.text('Phone: (585) 297-1000');
  });
});
