import { waitFor } from '@testing-library/dom';
import userEvent from '@testing-library/user-event';
import { expect } from 'chai';
import moment from 'moment-timezone';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { onCalendarChange } from '../../new-appointment/redux/actions';
import {
  createTestStore,
  renderWithStoreAndRouter,
} from '../../tests/mocks/setup';
import CalendarWidget from './CalendarWidget';

describe('VAOS Component: CalendarWidget', () => {
  it('should display scheduling duplicate appointment error message - same timezone', async () => {
    // Arrange
    const now = moment()
      .tz('America/Denver')
      .add(1, 'month')
      .startOf('month')
      .hour(12);
    const availableSlots = [
      {
        start: now.format('YYYY-MM-DDTHH:mm:ss'),
      },
      {
        start: moment(now)
          .hour(13)
          .format('YYYY-MM-DDTHH:mm:ss'),
      },
    ];
    const startMonth = now.format('YYYY-MM');
    const submitted = false;
    // Grouped by YYYY-MM
    const upcomingAppointments = {
      [now.format('YYYY-MM')]: [
        {
          start: now.format('YYYY-MM-DDTHH:mm:ss'),
          timezone: 'America/Denver',
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
          timezone="America/Denver"
          additionalOptions={{
            required: true,
          }}
          disabled={false}
          onChange={(...args) => {
            return dispatch(onCalendarChange(...args));
          }}
          minDate={moment(now).format('YYYY-MM-DD')}
          maxDate={moment(now)
            .add(395, 'days')
            .format('YYYY-MM-DD')}
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
    userEvent.click(screen.getByText(now.format('h:mm')));

    // Assert
    await waitFor(() => {
      expect(
        screen.queryByText(
          /You already have an appointment scheduled at this time. Please select another day or time/i,
        ),
      ).to.be.ok;
    });

    userEvent.click(
      screen.getByText(
        moment(now)
          .hour(13)
          .format('h:mm'),
      ),
    );

    await waitFor(() => {
      expect(
        screen.queryByText(
          /You already have an appointment scheduled at this time. Please select another day or time/i,
        ),
      ).not.to.exist;
    });
  });

  it('should display scheduling duplicate appointment error message - diferent timezone', async () => {
    // Arrange
    const now = moment()
      .tz('America/Denver')
      .add(1, 'month')
      .startOf('month')
      .hour(12);
    const availableSlots = [
      {
        start: now.format('YYYY-MM-DDTHH:mm:ss'),
      },
      {
        start: moment(now)
          .hour(13)
          .format('YYYY-MM-DDTHH:mm:ss'),
      },
    ];
    const startMonth = now.format('YYYY-MM');
    const submitted = false;
    // Grouped by YYYY-MM
    const upcomingAppointments = {
      [now.format('YYYY-MM')]: [
        {
          start: moment
            .tz(moment(now), 'America/New_York')
            .format('YYYY-MM-DDTHH:mm:ss.SSSZ'),
          timezone: 'America/New_York',
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
          timezone="America/Denver"
          additionalOptions={{
            required: true,
          }}
          disabled={false}
          onChange={(...args) => {
            return dispatch(onCalendarChange(...args));
          }}
          minDate={moment(now).format('YYYY-MM-DD')}
          maxDate={moment(now)
            .add(395, 'days')
            .format('YYYY-MM-DD')}
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
    userEvent.click(screen.getByText(now.format('h:mm')));

    // Assert
    await waitFor(() => {
      expect(
        screen.queryByText(
          /You already have an appointment scheduled at this time. Please select another day or time/i,
        ),
      ).to.be.ok;
    });

    userEvent.click(
      screen.getByText(
        moment(now)
          .hour(13)
          .format('h:mm'),
      ),
    );

    await waitFor(() => {
      expect(
        screen.queryByText(
          /You already have an appointment scheduled at this time. Please select another day or time/i,
        ),
      ).not.to.exist;
    });
  });

  it('should not display scheduling duplicate appointment error message for cancelled appointment', async () => {
    // Arrange
    const now = moment()
      .tz('America/Denver')
      .add(1, 'month')
      .startOf('month')
      .hour(12);
    const availableSlots = [
      {
        start: now.format('YYYY-MM-DDTHH:mm:ss'),
      },
      {
        start: moment(now)
          .hour(13)
          .format('YYYY-MM-DDTHH:mm:ss'),
      },
    ];
    const startMonth = now.format('YYYY-MM');
    const submitted = false;
    // Grouped by YYYY-MM
    const upcomingAppointments = {
      [now.format('YYYY-MM')]: [
        {
          start: now.format('YYYY-MM-DDTHH:mm:ss'),
          status: 'cancelled',
          timezone: 'America/Denver',
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
          timezone="America/Denver"
          additionalOptions={{
            required: true,
          }}
          disabled={false}
          onChange={(...args) => {
            return dispatch(onCalendarChange(...args));
          }}
          minDate={moment(now).format('YYYY-MM-DD')}
          maxDate={moment(now)
            .add(395, 'days')
            .format('YYYY-MM-DD')}
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
    userEvent.click(screen.getByText(now.format('h:mm')));

    // Assert
    await waitFor(() => {
      expect(
        screen.queryByText(
          /You already have an appointment scheduled at this time. Please select another day or time/i,
        ),
      ).not.to.exist;
    });
  });
});
