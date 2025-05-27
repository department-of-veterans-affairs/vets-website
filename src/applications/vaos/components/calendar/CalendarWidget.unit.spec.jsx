import { waitFor } from '@testing-library/dom';
import userEvent from '@testing-library/user-event';
import { expect } from 'chai';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  addDays,
  addMinutes,
  addMonths,
  addYears,
  startOfMonth,
} from 'date-fns';
import { formatInTimeZone } from 'date-fns-tz';
import { onCalendarChange } from '../../new-appointment/redux/actions';
import {
  createTestStore,
  renderWithStoreAndRouter,
} from '../../tests/mocks/setup';
import CalendarWidget from './CalendarWidget';
import { DATE_FORMATS } from '../../utils/constants';

describe('VAOS Component: CalendarWidget', () => {
  it('should display scheduling duplicate appointment error message for conflict with booked appointment', async () => {
    // Arrange
    const timezone = 'America/Denver';
    const nowUTC = startOfMonth(addMonths(new Date(), 1));
    nowUTC.setHours(12, 0, 0, 0);
    const slot2 = addMinutes(nowUTC, 120);
    const availableSlots = [
      {
        startUtc: formatInTimeZone(nowUTC, 'UTC', DATE_FORMATS.ISODateTimeUTC),
        start: formatInTimeZone(nowUTC, timezone, DATE_FORMATS.ISODateTime),
        end: formatInTimeZone(
          addMinutes(nowUTC, 60),
          'UTC',
          DATE_FORMATS.ISODateTimeUTC,
        ),
      },
      {
        startUtc: formatInTimeZone(slot2, 'UTC', DATE_FORMATS.ISODateTimeUTC),
        start: formatInTimeZone(slot2, timezone, DATE_FORMATS.ISODateTime),
        end: formatInTimeZone(
          addMinutes(slot2, 60),
          'UTC',
          DATE_FORMATS.ISODateTimeUTC,
        ),
      },
    ];
    const startMonth = formatInTimeZone(
      nowUTC,
      timezone,
      DATE_FORMATS.yearMonth,
    );
    const submitted = false;
    // Offset by 30 minutes to simulate an overlapping appointment
    const offset = addMinutes(nowUTC, 30);
    // Grouped by YYYY-MM
    const upcomingAppointments = {
      [startMonth]: [
        {
          startUtc: formatInTimeZone(
            offset,
            'UTC',
            DATE_FORMATS.ISODateTimeUTC,
          ),
          start: formatInTimeZone(offset, timezone, DATE_FORMATS.ISODateTime),
          minutesDuration: 60,
        },
      ],
    };

    const TestPageStub = () => {
      const dispatch = useDispatch();
      const data = useSelector(state => state.newAppointment.data);
      const isAppointmentSelectionError = useSelector(
        state => state.newAppointment.isAppointmentSelectionError,
      );

      return (
        <CalendarWidget
          maxSelections={1}
          availableSlots={availableSlots}
          value={data?.selectedDates}
          id="dateTime"
          timezone={timezone}
          additionalOptions={{
            required: true,
          }}
          disabled={false}
          onChange={(...args) => {
            return dispatch(onCalendarChange(...args));
          }}
          minDate={formatInTimeZone(
            nowUTC,
            timezone,
            DATE_FORMATS.yearMonthDay,
          )}
          maxDate={formatInTimeZone(
            addYears(nowUTC, 1),
            timezone,
            DATE_FORMATS.yearMonthDay,
          )}
          renderIndicator={_ => undefined}
          required
          requiredMessage="Please choose your preferred date and time for your appointment"
          startMonth={startMonth}
          showValidation={submitted && !data?.selectedDates?.length}
          showWeekends
          upcomingAppointments={upcomingAppointments}
          isAppointmentSelectionError={isAppointmentSelectionError}
        />
      );
    };

    // Act
    const store = createTestStore({});
    const screen = renderWithStoreAndRouter(<TestPageStub />, {
      store,
    });

    userEvent.click(screen.getByText('1'));
    userEvent.click(
      screen.getByText(formatInTimeZone(nowUTC, timezone, 'h:mm')),
    );

    // Assert
    await waitFor(() => {
      expect(
        screen.queryByText(
          /You already have an appointment scheduled at this time. Please select another day or time/i,
        ),
      ).to.be.ok;
    });

    userEvent.click(
      screen.getByText(formatInTimeZone(slot2, timezone, 'h:mm')),
    );

    await waitFor(() => {
      expect(
        screen.queryByText(
          /You already have an appointment scheduled at this time. Please select another day or time/i,
        ),
      ).not.to.exist;
    });
  });

  it('should not display scheduling duplicate appointment error message for conflict with cancelled appointment', async () => {
    // Arrange
    const timezone = 'America/Denver';
    const nowUTC = startOfMonth(addMonths(new Date(), 1));
    nowUTC.setHours(12, 0, 0, 0);
    const availableSlots = [
      {
        startUtc: formatInTimeZone(nowUTC, 'UTC', DATE_FORMATS.ISODateTimeUTC),
        start: formatInTimeZone(nowUTC, timezone, DATE_FORMATS.ISODateTime),
        end: formatInTimeZone(
          addMinutes(nowUTC, 60),
          'UTC',
          DATE_FORMATS.ISODateTimeUTC,
        ),
      },
    ];
    const startMonth = formatInTimeZone(
      nowUTC,
      timezone,
      DATE_FORMATS.yearMonth,
    );
    const submitted = false;
    // Offset by 30 minutes to simulate an overlapping appointment
    const offset = addMinutes(nowUTC, 30);
    // Grouped by YYYY-MM
    const upcomingAppointments = {
      [startMonth]: [
        {
          startUtc: formatInTimeZone(
            offset,
            'UTC',
            DATE_FORMATS.ISODateTimeUTC,
          ),
          start: formatInTimeZone(offset, timezone, DATE_FORMATS.ISODateTime),
          minutesDuration: 60,
          status: 'cancelled',
        },
      ],
    };

    const TestPageStub = () => {
      const dispatch = useDispatch();
      const data = useSelector(state => state.newAppointment.data);
      const isAppointmentSelectionError = useSelector(
        state => state.newAppointment.isAppointmentSelectionError,
      );

      return (
        <CalendarWidget
          maxSelections={1}
          availableSlots={availableSlots}
          value={data?.selectedDates}
          id="dateTime"
          timezone={timezone}
          additionalOptions={{
            required: true,
          }}
          disabled={false}
          onChange={(...args) => {
            return dispatch(onCalendarChange(...args));
          }}
          minDate={formatInTimeZone(
            nowUTC,
            timezone,
            DATE_FORMATS.yearMonthDay,
          )}
          maxDate={formatInTimeZone(
            addYears(nowUTC, 1),
            timezone,
            DATE_FORMATS.yearMonthDay,
          )}
          renderIndicator={_ => undefined}
          required
          requiredMessage="Please choose your preferred date and time for your appointment"
          startMonth={startMonth}
          showValidation={submitted && !data?.selectedDates?.length}
          showWeekends
          upcomingAppointments={upcomingAppointments}
          isAppointmentSelectionError={isAppointmentSelectionError}
        />
      );
    };

    // Act
    const store = createTestStore({});
    const screen = renderWithStoreAndRouter(<TestPageStub />, {
      store,
    });

    userEvent.click(screen.getByText('1'));
    userEvent.click(
      screen.getByText(formatInTimeZone(nowUTC, timezone, 'h:mm')),
    );

    // Assert
    await waitFor(() => {
      expect(
        screen.queryByText(
          /You already have an appointment scheduled at this time. Please select another day or time/i,
        ),
      ).not.to.exist;
    });
  });

  it('should clear scheduling duplicate appointment error message after choosing a different day', async () => {
    // Arrange
    const timezone = 'America/Denver';
    const nowUTC = startOfMonth(addMonths(new Date(), 1));
    nowUTC.setHours(12, 0, 0, 0);
    const slot2 = addDays(nowUTC, 1);
    const availableSlots = [
      {
        startUtc: formatInTimeZone(nowUTC, 'UTC', DATE_FORMATS.ISODateTimeUTC),
        start: formatInTimeZone(nowUTC, timezone, DATE_FORMATS.ISODateTime),
        end: formatInTimeZone(
          addMinutes(nowUTC, 60),
          'UTC',
          DATE_FORMATS.ISODateTimeUTC,
        ),
      },
      {
        startUtc: formatInTimeZone(slot2, 'UTC', DATE_FORMATS.ISODateTimeUTC),
        start: formatInTimeZone(slot2, timezone, DATE_FORMATS.ISODateTime),
        end: formatInTimeZone(
          addMinutes(slot2, 60),
          'UTC',
          DATE_FORMATS.ISODateTimeUTC,
        ),
      },
    ];
    const startMonth = formatInTimeZone(
      nowUTC,
      timezone,
      DATE_FORMATS.yearMonth,
    );
    const submitted = false;
    // Offset by 30 minutes to simulate an overlapping appointment
    const offset = addMinutes(nowUTC, 30);
    // Grouped by YYYY-MM
    const upcomingAppointments = {
      [startMonth]: [
        {
          startUtc: formatInTimeZone(
            offset,
            'UTC',
            DATE_FORMATS.ISODateTimeUTC,
          ),
          start: formatInTimeZone(offset, timezone, DATE_FORMATS.ISODateTime),
          minutesDuration: 60,
        },
      ],
    };

    const TestPageStub = () => {
      const dispatch = useDispatch();
      const data = useSelector(state => state.newAppointment.data);
      const isAppointmentSelectionError = useSelector(
        state => state.newAppointment.isAppointmentSelectionError,
      );

      return (
        <CalendarWidget
          maxSelections={1}
          availableSlots={availableSlots}
          value={data?.selectedDates}
          id="dateTime"
          timezone={timezone}
          additionalOptions={{
            required: true,
          }}
          disabled={false}
          onChange={(...args) => {
            return dispatch(onCalendarChange(...args));
          }}
          minDate={formatInTimeZone(
            nowUTC,
            timezone,
            DATE_FORMATS.yearMonthDay,
          )}
          maxDate={formatInTimeZone(
            addYears(nowUTC, 1),
            timezone,
            DATE_FORMATS.yearMonthDay,
          )}
          renderIndicator={_ => undefined}
          required
          requiredMessage="Please choose your preferred date and time for your appointment"
          startMonth={startMonth}
          showValidation={submitted && !data?.selectedDates?.length}
          showWeekends
          upcomingAppointments={upcomingAppointments}
          isAppointmentSelectionError={isAppointmentSelectionError}
        />
      );
    };

    // Act
    const store = createTestStore({});
    const screen = renderWithStoreAndRouter(<TestPageStub />, {
      store,
    });

    userEvent.click(screen.getByText('1'));
    userEvent.click(
      screen.getByText(formatInTimeZone(nowUTC, timezone, 'h:mm')),
    );

    // Assert
    await waitFor(() => {
      expect(
        screen.queryByText(
          /You already have an appointment scheduled at this time. Please select another day or time/i,
        ),
      ).to.be.ok;
    });

    userEvent.click(screen.getByText('2'));

    await waitFor(() => {
      expect(
        screen.queryByText(
          /You already have an appointment scheduled at this time. Please select another day or time/i,
        ),
      ).not.to.exist;
    });
  });
});
