import React from 'react';
import { expect } from 'chai';
import moment from 'moment';
import { createTestStore, renderWithStoreAndRouter } from '../../mocks/setup';
import userEvent from '@testing-library/user-event';

import DateTimeRequestPage from '../../../new-appointment/components/DateTimeRequestPage';
import { FETCH_STATUS } from '../../../utils/constants';
import { waitFor } from '@testing-library/dom';
import { Route } from 'react-router-dom';

function getMondayTruFriday(date) {
  if (date.day() === 6) {
    // Move date to next week Monday
    return date.day(8);
  } else if (date.day() === 0) {
    // Move date to current week Monday
    return date.day(1);
  }
  return date;
}

describe('VAOS <DateTimeRequestPage>', () => {
  describe('Add community care appointment to calendar', async () => {
    it('should allow user to request date and time for a community care appointment', async () => {
      const store = createTestStore({
        newAppointment: {
          data: {
            calendarData: {},
          },
          pages: [],
          eligibility: [],
          appointmentSlotsStatus: FETCH_STATUS.succeeded,
          previousPages: [],
        },
      });

      const screen = renderWithStoreAndRouter(
        <Route component={DateTimeRequestPage} />,
        {
          store,
        },
      );

      // it should display page heading
      expect(
        await screen.findByRole('heading', {
          level: 1,
          name: /Choose a day and time for your appointment/i,
        }),
      ).to.be.ok;

      // it should display 2 calendar months for community care appointments
      expect(
        screen.getByRole('heading', {
          level: 2,
          name: moment().format('MMMM YYYY'),
        }),
      ).to.be.ok;
      expect(
        screen.getByRole('heading', {
          level: 2,
          name: moment()
            .add(1, 'M')
            .format('MMMM YYYY'),
        }),
      ).to.be.ok;

      // it should allow the user to select morning for currently selected date
      // 1. Simulate user selecting a date
      let button = screen.getByRole('button', {
        name: moment()
          .add(5, 'd')
          .format('dddd, MMMM Do'),
      });
      userEvent.click(button);

      // 2. Simulate user selecting a time
      let checkbox = screen.getByRole('checkbox', {
        name: 'AM appointment',
      });
      userEvent.click(checkbox);

      // 3. Simulate user selecting another time
      checkbox = screen.getByRole('checkbox', {
        name: 'PM appointment',
      });
      userEvent.click(checkbox);

      // 4. it should allow the user to submit the form
      button = screen.getByRole('button', {
        name: /^Continue/,
      });
      userEvent.click(button);
      await waitFor(() => {
        expect(screen.history.push.called).to.be.true;
      });

      // NOTE: Reset the spy!!!
      screen.history.push.reset();

      // 5. it should allow the user to go to the previous page
      button = screen.getByRole('button', {
        name: /Back$/,
      });
      userEvent.click(button);
      await waitFor(() => {
        expect(screen.history.push.called).to.be.true;
      });
    });

    it('should allow the user to view different calendar months', async () => {
      const store = createTestStore({
        newAppointment: {
          data: {
            calendarData: {},
          },
          pages: [],
          eligibility: [],
          appointmentSlotsStatus: FETCH_STATUS.succeeded,
          previousPages: [],
        },
      });

      const screen = renderWithStoreAndRouter(
        <Route component={DateTimeRequestPage} />,
        {
          store,
        },
      );

      // it should not allow the user to view the previous month if viewing the current month
      let button = screen.getByRole('button', {
        name: 'Previous',
      });
      userEvent.click(button);
      await waitFor(() => {
        expect(screen.history.push.called).to.be.false;
      });

      // it should allow the user to view the next 2 month if viewing the current month
      button = screen.getByRole('button', {
        name: 'Next',
        pressed: false,
      });
      userEvent.click(button);
      expect(
        screen.getByRole('heading', {
          level: 2,
          name: moment()
            .add(2, 'M')
            .format('MMMM YYYY'),
        }),
      ).to.be.ok;
      expect(
        screen.getByRole('heading', {
          level: 2,
          name: moment()
            .add(3, 'M')
            .format('MMMM YYYY'),
        }),
      ).to.be.ok;

      // it should allow the user to view the previous 2 calendar months when not viewing the current month
      button = screen.getByRole('button', {
        name: 'Previous',
      });
      userEvent.click(button);
      expect(
        screen.getByRole('heading', {
          level: 2,
          name: moment().format('MMMM YYYY'),
        }),
      ).to.be.ok;
      expect(
        screen.getByRole('heading', {
          level: 2,
          name: moment()
            .add(1, 'M')
            .format('MMMM YYYY'),
        }),
      ).to.be.ok;
    });

    it('should display an alert when user selects more than 3 dates', async () => {
      const store = createTestStore({
        newAppointment: {
          data: {
            calendarData: {},
          },
          pages: [],
          eligibility: [],
          appointmentSlotsStatus: FETCH_STATUS.succeeded,
          previousPages: [],
        },
      });

      const screen = renderWithStoreAndRouter(
        <Route component={DateTimeRequestPage} />,
        {
          store,
        },
      );

      // it should display an alert when the users selects more than the allowed dates
      // 1. Simulate user selecting a date
      let button = screen.getByRole('button', {
        name: getMondayTruFriday(moment().add(5, 'd')).format('dddd, MMMM Do'),
      });
      userEvent.click(button);

      // 2. Simulate user selecting AM
      let checkbox = screen.getByRole('checkbox', {
        name: 'AM appointment',
      });
      userEvent.click(checkbox);

      // 3. Simulate user selecting another date
      button = screen.getByRole('button', {
        name: getMondayTruFriday(moment().add(6, 'd')).format('dddd, MMMM Do'),
      });
      userEvent.click(button);

      // 3. Simulate user selecting PM
      checkbox = screen.getByRole('checkbox', {
        name: 'PM appointment',
      });
      userEvent.click(checkbox);

      // 4. Simulate user selecting another date
      button = screen.getByRole('button', {
        name: getMondayTruFriday(moment().add(7, 'd')).format('dddd, MMMM Do'),
      });
      userEvent.click(button);

      // 5. Simulate user selecting AM
      checkbox = screen.getByRole('checkbox', {
        name: 'AM appointment',
      });
      userEvent.click(checkbox);

      // 6. Simulate user selecting another date which should result in error
      button = screen.getByRole('button', {
        name: getMondayTruFriday(moment().add(8, 'd')).format('dddd, MMMM Do'),
      });
      userEvent.click(button);

      // 6. Simulate user selecting PM which should result in error
      checkbox = screen.getByRole('checkbox', {
        name: 'PM appointment',
      });
      userEvent.click(checkbox);

      // NOTE: alert doesn't have a name so search for text too
      expect(screen.getByRole('alert')).to.be.ok;
      expect(
        screen.getByText(
          'You can only choose up to 3 dates for your appointment.',
        ),
      ).to.be.ok;
    });

    it('should display an alert when user selects 2 dates and multiple times', async () => {
      const store = createTestStore({
        newAppointment: {
          data: {
            calendarData: {},
          },
          pages: [],
          eligibility: [],
          appointmentSlotsStatus: FETCH_STATUS.succeeded,
        },
      });

      const screen = renderWithStoreAndRouter(
        <Route component={DateTimeRequestPage} />,
        {
          store,
        },
      );

      // it should display an alert when the users selects more than the allowed dates
      // 1. Simulate user selecting a date
      let button = screen.getByRole('button', {
        name: getMondayTruFriday(moment().add(5, 'd')).format('dddd, MMMM Do'),
      });
      userEvent.click(button);

      // 2. Simulate user selecting AM
      let checkbox = screen.getByRole('checkbox', {
        name: 'AM appointment',
      });
      userEvent.click(checkbox);

      // 3. Simulate user selecting PM
      checkbox = screen.getByRole('checkbox', {
        name: 'PM appointment',
      });
      userEvent.click(checkbox);

      // 4. Simulate user selecting another date
      button = screen.getByRole('button', {
        name: getMondayTruFriday(moment().add(6, 'd')).format('dddd, MMMM Do'),
      });
      userEvent.click(button);

      // 5. Simulate user selecting AM
      checkbox = screen.getByRole('checkbox', {
        name: 'AM appointment',
      });
      userEvent.click(checkbox);

      // 6. Simulate user selecting PM which should result in error
      checkbox = screen.getByRole('checkbox', {
        name: 'PM appointment',
      });
      userEvent.click(checkbox);

      // NOTE: alert doesn't have a name so search for text too
      expect(screen.getByRole('alert')).to.be.ok;
      expect(
        screen.getByText(
          'You can only choose up to 3 dates for your appointment.',
        ),
      ).to.be.ok;

      // 7. it should not allow the user to submit the form
      button = screen.getByRole('button', {
        name: /^Continue/,
      });
      userEvent.click(button);
      await waitFor(() => {
        expect(screen.history.push.called).to.be.false;
      });
    });

    it('should display an alert when user submits the form with no dates selected', async () => {
      const store = createTestStore({
        newAppointment: {
          data: {
            calendarData: {},
          },
          pages: [],
          eligibility: [],
          appointmentSlotsStatus: FETCH_STATUS.succeeded,
          previousPages: [],
        },
      });

      const screen = renderWithStoreAndRouter(
        <Route component={DateTimeRequestPage} />,
        {
          store,
        },
      );

      // it should display an alert when users tries to submit the form
      let button = screen.getByRole('button', {
        name: /^Continue/,
      });
      userEvent.click(button);

      // NOTE: alert doesn't have a name so search for text too
      expect(screen.getByRole('alert')).to.be.ok;
      expect(
        screen.getByText(
          'Please select at least one preferred date for your appointment. You can select up to three dates.',
        ),
      ).to.be.ok;

      // it should not allow user to submit the form
      button = screen.getByRole('button', {
        name: /^Continue/,
      });
      userEvent.click(button);
      await waitFor(() => {
        expect(screen.history.push.called).to.be.false;
      });
    });
  });
});
