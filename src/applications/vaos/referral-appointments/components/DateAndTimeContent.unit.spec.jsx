import React from 'react';
import { fireEvent } from '@testing-library/react';
import { expect } from 'chai';
import MockDate from 'mockdate';
import DateAndTimeContent from './DateAndTimeContent';
import { createReferralById, getReferralSlotKey } from '../utils/referrals';
import { createDraftAppointmentInfo } from '../utils/provider';
import { renderWithStoreAndRouter } from '../../tests/mocks/setup';
import {
  generateSlotsForDay,
  transformSlotsForCommunityCare,
} from '../../services/mocks/utils/slots';

describe('VAOS Component: DateAndTimeContent', () => {
  const initialState = {
    featureToggles: {
      vaOnlineSchedulingCCDirectScheduling: true,
    },
    referral: {
      currentPage: 'scheduleAppointment',
      selectedSlot: null,
    },
  };
  const referral = createReferralById(
    '2024-12-05',
    'add2f0f4-a1ea-4dea-a504-a54ab57c68',
  ).attributes;
  const appointmentsByMonth = {
    '2024-12': [
      {
        start: '2024-12-06T15:00:00-05:00',
        timezone: 'America/New_York',
        minutesDuration: 30,
      },
      {
        start: '2024-12-19T08:40:00-05:00',
        timezone: 'America/New_York',
        minutesDuration: 60,
      },
    ],
    '2025-01': [
      {
        start: '2025-01-02T12:00:00-05:00',
        timezone: 'America/New_York',
        minutesDuration: 60,
      },
      {
        start: '2025-01-19T08:40:00-05:00',
        timezone: 'America/New_York',
        minutesDuration: 60,
      },
    ],
  };
  beforeEach(() => {
    MockDate.set('2024-12-05T05:00:00-05:00');
  });
  const slotsDate = '2024-12-05T05:00:00-05:00';
  afterEach(() => {
    sessionStorage.clear();
    MockDate.reset();
  });
  const draftAppointmentInfo = createDraftAppointmentInfo();
  const slots = generateSlotsForDay(slotsDate, {
    slotsPerDay: 1,
    slotDuration: 60,
    businessHours: {
      start: 12,
      end: 18,
    },
  });
  draftAppointmentInfo.attributes.slots = transformSlotsForCommunityCare(slots);
  it('should render DateAndTimeContent component', () => {
    const screen = renderWithStoreAndRouter(
      <DateAndTimeContent
        currentReferral={referral}
        draftAppointmentInfo={draftAppointmentInfo}
        appointmentsByMonth={appointmentsByMonth}
      />,
      {
        initialState,
      },
    );
    expect(screen.getByTestId('cal-widget')).to.exist;
  });
  it('should show error if no date selected', async () => {
    const screen = renderWithStoreAndRouter(
      <DateAndTimeContent
        currentReferral={referral}
        draftAppointmentInfo={draftAppointmentInfo}
        appointmentsByMonth={appointmentsByMonth}
      />,
      {
        initialState,
      },
    );
    const continueButton = await screen.findByRole('button', {
      name: /Continue/i,
    });
    fireEvent.click(continueButton);
    expect(
      await screen.getByText(
        'Please choose your preferred date and time for your appointment',
      ),
    ).to.exist;
  });
  it('should select date if value in session storage', async () => {
    const selectedSlotValue = slotsDate;
    const selectedSlotKey = getReferralSlotKey(referral.uuid);
    sessionStorage.setItem(selectedSlotKey, selectedSlotValue);

    // Create state with matching selectedSlot value
    const stateWithSelectedSlot = {
      featureToggles: {
        vaOnlineSchedulingCCDirectScheduling: true,
      },
      referral: {
        currentPage: 'scheduleAppointment',
        selectedSlotStartTime: selectedSlotValue,
      },
    };

    // Ensure the draftAppointmentInfo has a slot matching the selectedSlotValue
    draftAppointmentInfo.attributes.slots[0].start = selectedSlotValue;

    const screen = renderWithStoreAndRouter(
      <DateAndTimeContent
        currentReferral={referral}
        draftAppointmentInfo={draftAppointmentInfo}
        appointmentsByMonth={{}} // Empty to avoid conflicts
      />,
      {
        initialState: stateWithSelectedSlot,
        path: '/schedule-referral/date-time',
      },
    );

    const continueButton = await screen.findByRole('button', {
      name: /Continue/i,
    });

    fireEvent.click(continueButton);

    // Routes to next page if selection exists
    expect(await screen.history.push.called).to.be.true;
  });
  it('should show error if no slots available', async () => {
    const screen = renderWithStoreAndRouter(
      <DateAndTimeContent
        currentReferral={referral}
        draftAppointmentInfo={createDraftAppointmentInfo()}
        appointmentsByMonth={appointmentsByMonth}
      />,
      {
        initialState,
      },
    );
    expect(screen.getByTestId('no-slots-alert')).to.exist;
    expect(screen.getByTestId('referral-community-care-office')).to.exist;
  });
  describe('when not in pilot station', () => {
    it('should show an alert and a link to find a community care office', () => {
      const referralNotInPilot = createReferralById(
        '2024-12-05',
        'add2f0f4-a1ea-4dea-a504-a54ab57c68',
        undefined,
        undefined,
        true,
        '12345',
      ).attributes;
      const screen = renderWithStoreAndRouter(
        <DateAndTimeContent
          currentReferral={referralNotInPilot}
          draftAppointmentInfo={draftAppointmentInfo}
          appointmentsByMonth={appointmentsByMonth}
        />,
        {
          initialState,
        },
      );
      const alert = screen.getByTestId('station-id-not-valid-alert');
      expect(screen.getByTestId('station-id-not-valid-alert')).to.exist;
      expect(alert).to.contain.text(
        'Call this provider or your facility’s community care office to schedule an appointment.',
      );
      expect(screen.getByTestId('referral-community-care-office')).to.exist;
    });
  });

  it('should display provider timezone when it differs from referral timezone', async () => {
    // Create draft appointment info with Pacific timezone provider
    const pacificTimezoneDraftAppointmentInfo = createDraftAppointmentInfo();
    pacificTimezoneDraftAppointmentInfo.attributes.provider.location.timezone =
      'America/Los_Angeles';
    pacificTimezoneDraftAppointmentInfo.attributes.slots = transformSlotsForCommunityCare(
      slots,
    );

    // Appointments are in Eastern time (from appointmentsByMonth)
    // but provider is in Pacific time
    const screen = renderWithStoreAndRouter(
      <DateAndTimeContent
        currentReferral={referral}
        draftAppointmentInfo={pacificTimezoneDraftAppointmentInfo}
        appointmentsByMonth={appointmentsByMonth}
      />,
      {
        initialState,
      },
    );

    // Should display Pacific time zone information for the provider
    expect(
      screen.getByText(
        /Appointment times are displayed in Pacific time \(PT\)/,
      ),
    ).to.exist;
    expect(screen.getByTestId('cal-widget')).to.exist;
  });
});
