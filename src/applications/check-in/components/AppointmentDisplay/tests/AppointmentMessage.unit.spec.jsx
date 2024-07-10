import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';
import MockDate from 'mockdate';
import AppointmentMessage from '../AppointmentMessage';

import CheckInProvider from '../../../tests/unit/utils/CheckInProvider';
import { ELIGIBILITY } from '../../../utils/appointment/eligibility';
import { setupI18n, teardownI18n } from '../../../utils/i18n/i18n';

describe('check-in', () => {
  beforeEach(() => {
    setupI18n();
  });

  afterEach(() => {
    teardownI18n();
    MockDate.reset();
  });
  describe('AppointmentMessage', () => {
    const mockRouter = {
      currentPage: '/details',
    };
    it('should render the bad status message for appointments with INELIGIBLE_BAD_STATUS status', () => {
      const action = render(
        <CheckInProvider router={mockRouter}>
          <AppointmentMessage
            appointment={{
              eligibility: ELIGIBILITY.INELIGIBLE_BAD_STATUS,
            }}
          />
        </CheckInProvider>,
      );

      expect(action.getByTestId('ineligible-bad-status-message')).to.exist;
      expect(action.getByTestId('ineligible-bad-status-message')).to.have.text(
        'Online check-in isn’t available for this appointment. Check in with a staff member.',
      );
    });
    it('should render the bad status message for appointments with INELIGIBLE_UNSUPPORTED_LOCATION status', () => {
      const action = render(
        <CheckInProvider router={mockRouter}>
          <AppointmentMessage
            appointment={{
              eligibility: ELIGIBILITY.INELIGIBLE_UNSUPPORTED_LOCATION,
            }}
          />
        </CheckInProvider>,
      );

      expect(action.getByTestId('unsupported-location-message')).to.exist;
      expect(action.getByTestId('unsupported-location-message')).to.have.text(
        'Online check-in isn’t available for this appointment. Check in with a staff member.',
      );
    });
    it('should render the bad status message for appointments with INELIGIBLE_UNKNOWN_REASON status', () => {
      const action = render(
        <CheckInProvider router={mockRouter}>
          <AppointmentMessage
            appointment={{
              eligibility: ELIGIBILITY.INELIGIBLE_UNKNOWN_REASON,
            }}
          />
        </CheckInProvider>,
      );
      expect(action.getByTestId('unknown-reason-message')).to.exist;
      expect(action.getByTestId('unknown-reason-message')).to.have.text(
        'Online check-in isn’t available for this appointment. Check in with a staff member.',
      );
    });
    it('should render the bad status message for appointments with ELIGIBLE status that expire in the next 10 seconds', () => {
      MockDate.set('2018-01-01T12:14:51-04:00');
      const action = render(
        <CheckInProvider router={mockRouter}>
          <AppointmentMessage
            appointment={{
              checkInWindowEnd: '2018-01-01T12:15:00-04:00',
              eligibility: ELIGIBILITY.ELIGIBLE,
            }}
          />
        </CheckInProvider>,
      );
      expect(action.getByTestId('too-late-message')).to.exist;
      expect(action.getByTestId('too-late-message')).to.have.text(
        'Your appointment started more than 15 minutes ago. We can’t check you in online. Ask a staff member for help.',
      );
    });
    it('should render the bad status message for appointments with INELIGIBLE_TOO_LATE status', () => {
      const action = render(
        <CheckInProvider router={mockRouter}>
          <AppointmentMessage
            appointment={{
              eligibility: ELIGIBILITY.INELIGIBLE_TOO_LATE,
            }}
          />
        </CheckInProvider>,
      );

      expect(action.getByTestId('too-late-message')).to.exist;
      expect(action.getByTestId('too-late-message')).to.have.text(
        'Your appointment started more than 15 minutes ago. We can’t check you in online. Ask a staff member for help.',
      );
    });
    it('should render the bad status message for appointments with INELIGIBLE_TOO_EARLY status', () => {
      const action = render(
        <CheckInProvider router={mockRouter}>
          <AppointmentMessage
            appointment={{
              eligibility: ELIGIBILITY.INELIGIBLE_TOO_EARLY,
              checkInWindowStart: '2021-07-19T14:00:00',
              startTime: '2021-07-19T14:30:00',
            }}
          />
        </CheckInProvider>,
      );

      expect(action.getByTestId('too-early-message')).to.exist;
      expect(action.getByTestId('too-early-message')).to.have.text(
        'You can check in starting at 2:00 p.m.',
      );
    });
    it('should render the bad status message for appointments with INELIGIBLE_ALREADY_CHECKED_IN status', () => {
      const action = render(
        <CheckInProvider router={mockRouter}>
          <AppointmentMessage
            appointment={{
              eligibility: ELIGIBILITY.INELIGIBLE_ALREADY_CHECKED_IN,
              checkedInTime: '2021-07-19T14:14:00',
              startTime: '2021-07-19T14:30:00',
            }}
          />
        </CheckInProvider>,
      );

      expect(action.getByTestId('already-checked-in-message')).to.exist;
      expect(action.getByTestId('already-checked-in-message')).to.have.text(
        'You checked in at 2:14 p.m.',
      );
    });
    it('should render the bad status message for appointments with INELIGIBLE_ALREADY_CHECKED_IN status and no checked in time', () => {
      const action = render(
        <CheckInProvider router={mockRouter}>
          <AppointmentMessage
            appointment={{
              eligibility: ELIGIBILITY.INELIGIBLE_ALREADY_CHECKED_IN,

              startTime: '2021-07-19T14:30:00',
            }}
          />
        </CheckInProvider>,
      );

      expect(action.getByTestId('already-checked-in-no-time-message')).to.exist;
      expect(
        action.getByTestId('already-checked-in-no-time-message'),
      ).to.have.text('You’re checked in');
    });

    it('should render the bad status message for appointments with INELIGIBLE_ALREADY_CHECKED_IN status and an invalid date time', () => {
      const action = render(
        <CheckInProvider router={mockRouter}>
          <AppointmentMessage
            appointment={{
              eligibility: ELIGIBILITY.INELIGIBLE_ALREADY_CHECKED_IN,
              checkedInTime: 'Invalid DateTime',
              startTime: '2021-07-19T14:30:00',
            }}
          />
        </CheckInProvider>,
      );

      expect(action.getByTestId('already-checked-in-no-time-message')).to.exist;
      expect(
        action.getByTestId('already-checked-in-no-time-message'),
      ).to.have.text('You’re checked in');
    });
  });
  describe('AppointmentMessage for upcoming appointments list', () => {
    const mockRouter = {
      currentPage: '/appointments',
    };
    it('should not render the bad status message for appointments with INELIGIBLE_BAD_STATUS status', () => {
      const screen = render(
        <CheckInProvider router={mockRouter}>
          <AppointmentMessage
            appointment={{
              eligibility: ELIGIBILITY.INELIGIBLE_BAD_STATUS,
            }}
          />
        </CheckInProvider>,
      );
      expect(screen.queryByTestId('ineligible-bad-status-message')).to.not
        .exist;
    });
    it('should not render the bad status message for appointments with INELIGIBLE_UNSUPPORTED_LOCATION status', () => {
      const screen = render(
        <CheckInProvider router={mockRouter}>
          <AppointmentMessage
            appointment={{
              eligibility: ELIGIBILITY.INELIGIBLE_UNSUPPORTED_LOCATION,
            }}
          />
        </CheckInProvider>,
      );
      expect(screen.queryByTestId('unsupported-location-message')).to.not.exist;
    });
    it('should not render the bad status message for appointments with INELIGIBLE_UNKNOWN_REASON status', () => {
      const screen = render(
        <CheckInProvider router={mockRouter}>
          <AppointmentMessage
            appointment={{
              eligibility: ELIGIBILITY.INELIGIBLE_UNKNOWN_REASON,
            }}
          />
        </CheckInProvider>,
      );
      expect(screen.queryByTestId('unknown-reason-message')).to.not.exist;
    });
    it('should not render the bad status message for appointments with ELIGIBLE status that expire in the next 10 seconds', () => {
      MockDate.set('2018-01-01T12:14:51-04:00');
      const screen = render(
        <CheckInProvider router={mockRouter}>
          <AppointmentMessage
            appointment={{
              checkInWindowEnd: '2018-01-01T12:15:00-04:00',
              eligibility: ELIGIBILITY.ELIGIBLE,
            }}
          />
        </CheckInProvider>,
      );
      expect(screen.queryByTestId('too-late-message')).to.not.exist;
    });
    it('should render the status message for appointments with INELIGIBLE_TOO_EARLY status', () => {
      const action = render(
        <CheckInProvider router={mockRouter}>
          <AppointmentMessage
            appointment={{
              eligibility: ELIGIBILITY.INELIGIBLE_TOO_EARLY,
              checkInWindowStart: '2021-07-19T14:00:00',
              startTime: '2021-07-19T14:30:00',
            }}
          />
        </CheckInProvider>,
      );

      expect(action.getByTestId('too-early-message')).to.exist;
      expect(action.getByTestId('too-early-message')).to.have.text(
        'You can check in starting at 2:00 p.m.',
      );
    });
    it('should render the status message for appointments with INELIGIBLE_ALREADY_CHECKED_IN status', () => {
      const action = render(
        <CheckInProvider router={mockRouter}>
          <AppointmentMessage
            appointment={{
              eligibility: ELIGIBILITY.INELIGIBLE_ALREADY_CHECKED_IN,
              checkedInTime: '2021-07-19T14:14:00',
              startTime: '2021-07-19T14:30:00',
            }}
          />
        </CheckInProvider>,
      );

      expect(action.getByTestId('already-checked-in-message')).to.exist;
      expect(action.getByTestId('already-checked-in-message')).to.have.text(
        'You checked in at 2:14 p.m.',
      );
    });
    it('should render the status message for appointments with INELIGIBLE_ALREADY_CHECKED_IN status and no checked in time', () => {
      const action = render(
        <CheckInProvider router={mockRouter}>
          <AppointmentMessage
            appointment={{
              eligibility: ELIGIBILITY.INELIGIBLE_ALREADY_CHECKED_IN,

              startTime: '2021-07-19T14:30:00',
            }}
          />
        </CheckInProvider>,
      );

      expect(action.getByTestId('already-checked-in-no-time-message')).to.exist;
      expect(
        action.getByTestId('already-checked-in-no-time-message'),
      ).to.have.text('You’re checked in');
    });
    it('should render the status message for appointments with INELIGIBLE_ALREADY_CHECKED_IN status and an invalid date time', () => {
      const action = render(
        <CheckInProvider router={mockRouter}>
          <AppointmentMessage
            appointment={{
              eligibility: ELIGIBILITY.INELIGIBLE_ALREADY_CHECKED_IN,
              checkedInTime: 'Invalid DateTime',
              startTime: '2021-07-19T14:30:00',
            }}
          />
        </CheckInProvider>,
      );

      expect(action.getByTestId('already-checked-in-no-time-message')).to.exist;
      expect(
        action.getByTestId('already-checked-in-no-time-message'),
      ).to.have.text('You’re checked in');
    });
  });
});
