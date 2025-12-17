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
    const link = await screen.findByTestId('referral-community-care-office');
    const helpText = await screen.findByTestId('help-text');
    const informationalText = await screen.findByTestId(
      'referral-informational-text',
    );

    const expectedDate = format(
      new Date(referral.attributes.expirationDate),
      'MMMM d, yyyy',
    );

    expect(details).to.exist;
    expect(details).to.contain.text(expectedDate);
    expect(helpText).to.exist;

    expect(link).to.exist;
    expect(informationalText).to.exist;
  });
  it('should reset slot selection', async () => {
    const referral = createReferralById(referralDate, '222');
    const selectedSlotKey = getReferralSlotKey(referral.attributes.uuid);
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
  it('should display warning alert when provider npi is not available', async () => {
    const referral = createReferralById(referralDate, '333');
    // Ensure provider is defined but npi is not available
    referral.attributes.provider = {
      npi: null,
      name: 'Dr. Moreen S. Rafa',
      facilityName: 'fake facility name',
    };

    const store = createTestStore();

    const screen = renderWithStoreAndRouter(
      <ScheduleReferral currentReferral={referral} />,
      {
        store,
      },
    );

    const alert = await screen.findByTestId('referral-alert');
    expect(alert).to.exist;
    expect(alert).to.contain.text(
      'Online scheduling isn’t available for this referral right now. Call your community care provider or your facility’s community care office to schedule an appointment.',
    );
    expect(
      screen.queryAllByTestId('referral-community-care-office'),
    ).to.have.length(2);

    // Verify that the schedule appointment button is not rendered
    const scheduleButton = screen.queryByTestId('schedule-appointment-button');
    expect(scheduleButton).to.be.null;
  });

  it('should display warning alert when station id is not valid', async () => {
    const referral = createReferralById(referralDate, '444');
    referral.attributes.stationId = '12345';

    const store = createTestStore();

    const screen = renderWithStoreAndRouter(
      <ScheduleReferral currentReferral={referral} />,
      { store },
    );

    const alert = await screen.findByTestId('referral-alert');
    expect(alert).to.exist;
    expect(alert).to.contain.text(
      'Online scheduling isn’t available for this referral right now. Call your community care provider or your facility’s community care office to schedule an appointment.',
    );
    expect(
      screen.queryAllByTestId('referral-community-care-office'),
    ).to.have.length(2);

    // Verify that the schedule appointment button is not rendered
    const scheduleButton = screen.queryByTestId('schedule-appointment-button');
    expect(scheduleButton).to.be.null;

    // Verify provider info shows correct values
    const details = await screen.findByTestId('referral-details');
    expect(details).to.contain.text('Provider: Dr. Moreen S. Rafa');
    expect(details).to.contain.text('Location: fake facility name');
  });
  it('should display schedule appointment button when provider npi is available', async () => {
    const referral = createReferralById(referralDate, '444');
    // Add provider data
    referral.attributes.provider = {
      name: 'Dr. Jane Smith',
      npi: '1234567890',
      facilityName: 'Community Care Clinic',
    };

    const store = createTestStore();

    const screen = renderWithStoreAndRouter(
      <ScheduleReferral currentReferral={referral} />,
      {
        store,
      },
    );

    // Verify that the schedule appointment button is rendered
    const scheduleButton = await screen.findByTestId(
      'schedule-appointment-button',
    );
    expect(scheduleButton).to.exist;
    expect(scheduleButton).to.have.attribute(
      'text',
      'Schedule your appointment',
    );

    // Verify warning alert is not displayed
    const alert = screen.queryByTestId('referral-alert');
    expect(alert).to.be.null;

    // Verify provider info shows correct values
    const details = await screen.findByTestId('referral-details');
    expect(details).to.contain.text('Provider: Dr. Jane Smith');
    expect(details).to.contain.text('Location: Community Care Clinic');
  });
  it('should handle undefined provider field gracefully', async () => {
    const referral = createReferralById(referralDate, '555');
    // Ensure provider is undefined (removed completely)
    delete referral.attributes.provider;

    const store = createTestStore();

    const screen = renderWithStoreAndRouter(
      <ScheduleReferral currentReferral={referral} />,
      {
        store,
      },
    );

    const alert = await screen.findByTestId('referral-alert');
    expect(alert).to.exist;

    // Verify that the schedule appointment button is not rendered
    const scheduleButton = screen.queryByTestId('schedule-appointment-button');
    expect(scheduleButton).to.be.null;

    // Verify provider info shows "Not available"
    const details = await screen.findByTestId('referral-details');
    expect(details).to.contain.text('Provider: Not available');
    expect(details).to.contain.text('Location: Not available');
  });
  it('should allow user to schedule from pilot expansion station', async () => {
    const referral = createReferralById(referralDate, '99999');
    referral.attributes.stationId = '648GE';
    const store = createTestStore();
    const screen = renderWithStoreAndRouter(
      <ScheduleReferral currentReferral={referral} />,
      { store },
    );
    const scheduleButton = await screen.findByTestId(
      'schedule-appointment-button',
    );
    expect(scheduleButton).to.exist;
  });
});
