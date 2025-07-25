import React from 'react';
import { fireEvent } from '@testing-library/react';
import { expect } from 'chai';
import MockDate from 'mockdate';
import DateAndTimeContent from './DateAndTimeContent';
import { createReferralById, getReferralSlotKey } from '../utils/referrals';
import { createDraftAppointmentInfo } from '../utils/provider';
import { renderWithStoreAndRouter } from '../../tests/mocks/setup';

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
  afterEach(() => {
    sessionStorage.clear();
    MockDate.reset();
  });
  it('should render DateAndTimeContent component', () => {
    const screen = renderWithStoreAndRouter(
      <DateAndTimeContent
        currentReferral={referral}
        draftAppointmentInfo={createDraftAppointmentInfo(1)}
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
        draftAppointmentInfo={createDraftAppointmentInfo(1)}
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
    const selectedSlotValue = '2024-12-06T15:00:00-05:00';
    const selectedSlotKey = getReferralSlotKey(referral.uuid);
    sessionStorage.setItem(selectedSlotKey, selectedSlotValue);

    // Create state with matching selectedSlot value
    const stateWithSelectedSlot = {
      featureToggles: {
        vaOnlineSchedulingCCDirectScheduling: true,
      },
      referral: {
        currentPage: 'scheduleAppointment',
        selectedSlot: selectedSlotValue,
      },
    };

    const draftAppointmentInfo = createDraftAppointmentInfo(2);

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
        draftAppointmentInfo={createDraftAppointmentInfo(0)}
        appointmentsByMonth={appointmentsByMonth}
      />,
      {
        initialState,
      },
    );
    expect(screen.getByTestId('no-slots-alert')).to.exist;
  });
});
