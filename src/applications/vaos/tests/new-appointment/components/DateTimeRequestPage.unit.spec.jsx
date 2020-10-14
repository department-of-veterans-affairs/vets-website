import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';
import moment from 'moment';
import { renderWithStoreAndRouter } from '../../mocks/setup';
import userEvent from '@testing-library/user-event';

import {
  DateTimeRequestPage,
  getOptionsByDate,
} from '../../../new-appointment/components/DateTimeRequestPage';

const initialState = {
  featureToggles: {
    vaOnlineSchedulingCancel: true,
  },
};

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
  it('should return options for date with getOptionsByDate', () => {
    const options = getOptionsByDate();
    expect(options.length).to.equal(2);
    expect(options[0].value).to.equal('AM');
    expect(options[0].label).to.equal('AM');
    expect(options[1].value).to.equal('PM');
    expect(options[1].label).to.equal('PM');
  });

  describe('Add community care appointment to calendar', async () => {
    it('should allow user to request date and time for a community care appointment', async () => {
      const routeToNextAppointmentPage = sinon.spy();
      const routeToPreviousAppointmentPage = sinon.spy();

      // NOTE: Next available date is atleast 5 days from the current date
      const selectedDate1 = getMondayTruFriday(moment().add(5, 'd')).format(
        'YYYY-MM-DD',
      );
      const selectedDate2 = getMondayTruFriday(moment().add(6, 'd')).format(
        'YYYY-MM-DD',
      );

      // Seeding calendar with currently selected date and 2 previously selected dates
      const screen = renderWithStoreAndRouter(
        <DateTimeRequestPage
          data={{
            calendarData: {
              currentlySelectedDate: selectedDate1,
              selectedDates: [
                { date: selectedDate1, optionTime: 'AM' },
                { date: selectedDate2, optionTime: 'PM' },
              ],
            },
          }}
          routeToNextAppointmentPage={routeToNextAppointmentPage}
          routeToPreviousAppointmentPage={routeToPreviousAppointmentPage}
          history={history}
        />,
        {
          initialState,
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
      expect(
        screen.getByRole('checkbox', {
          name: 'AM appointment',
        }),
      ).to.be.ok;

      // it should allow the user to select evening for currently selected date
      expect(
        screen.getByRole('checkbox', {
          name: 'PM appointment',
        }),
      ).to.be.ok;

      // it should not allow the user to view the previous month if viewing the current month
      let button = screen.getByRole('button', {
        name: 'Previous',
      });
      userEvent.click(button);
      expect(
        screen.getByRole('heading', {
          level: 2,
          name: moment().format('MMMM YYYY'),
        }),
      ).to.be.ok;

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

      // it should allow user to view the previous 2 calendar months
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

      // it should allow the user to go to the previous page
      button = screen.getByRole('button', {
        name: /Back$/,
      });
      userEvent.click(button);
      expect(routeToPreviousAppointmentPage.called).to.be.true;

      // it should allow user to submit the form
      button = screen.getByRole('button', {
        name: /^Continue/,
      });
      userEvent.click(button);
      expect(routeToNextAppointmentPage.called).to.be.true;
    });

    it('should display an alert when user selects more than 3 dates', async () => {
      const routeToNextAppointmentPage = sinon.spy();
      const routeToPreviousAppointmentPage = sinon.spy();

      // NOTE: Next available date is atleast 5 days from the current date
      const selectedDate1 = getMondayTruFriday(moment().add(5, 'd')).format(
        'YYYY-MM-DD',
      );
      const selectedDate2 = getMondayTruFriday(moment().add(6, 'd')).format(
        'YYYY-MM-DD',
      );
      const selectedDate3 = getMondayTruFriday(moment().add(7, 'd')).format(
        'YYYY-MM-DD',
      );

      // Seeding calendar with currently selected date and 3 previously selected dates
      const screen = renderWithStoreAndRouter(
        <DateTimeRequestPage
          data={{
            calendarData: {
              currentlySelectedDate: getMondayTruFriday(
                moment().add(8, 'd'),
              ).format('YYYY-MM-DD'),
              selectedDates: [
                { date: selectedDate1, optionTime: 'AM' },
                { date: selectedDate2, optionTime: 'PM' },
                { date: selectedDate3, optionTime: 'PM' },
              ],
            },
          }}
          routeToNextAppointmentPage={routeToNextAppointmentPage}
          routeToPreviousAppointmentPage={routeToPreviousAppointmentPage}
        />,
        {
          initialState,
        },
      );

      // it should display an alert when the users selects more than the allowed dates
      const checkbox = screen.getByRole('checkbox', {
        name: 'AM appointment',
      });
      userEvent.click(checkbox);

      // NOTE: alert doesn't have a name so search for text too
      expect(screen.getByRole('alert')).to.be.ok;
      expect(
        screen.getByText(
          'You can only choose up to 3 dates for your appointment.',
        ),
      ).to.be.ok;

      // it should allow the user to go to the previous page
      const button = screen.getByRole('button', {
        name: /Back$/,
      });
      userEvent.click(button);
      expect(routeToPreviousAppointmentPage.called).to.be.true;
    });

    it('should display an alert when user selects 2 dates and multiple times', async () => {
      const routeToNextAppointmentPage = sinon.spy();
      const routeToPreviousAppointmentPage = sinon.spy();

      // NOTE: Next available date is atleast 5 days from the current date
      const selectedDate1 = getMondayTruFriday(moment().add(5, 'd')).format(
        'YYYY-MM-DD',
      );
      const selectedDate2 = getMondayTruFriday(moment().add(6, 'd')).format(
        'YYYY-MM-DD',
      );

      // Seeding calendar with currently selected date and 3 previously selected dates
      const screen = renderWithStoreAndRouter(
        <DateTimeRequestPage
          data={{
            calendarData: {
              currentlySelectedDate: selectedDate1,
              selectedDates: [
                { date: selectedDate1, optionTime: 'AM' },
                { date: selectedDate2, optionTime: 'AM' },
                { date: selectedDate2, optionTime: 'PM' },
              ],
            },
          }}
          routeToNextAppointmentPage={routeToNextAppointmentPage}
          routeToPreviousAppointmentPage={routeToPreviousAppointmentPage}
        />,
        {
          initialState,
        },
      );

      // it should display an alert when the users selects more than the allowed dates
      const checkbox = screen.getByRole('checkbox', {
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

      // it should allow the user to go to the previous page
      const button = screen.getByRole('button', {
        name: /Back$/,
      });
      userEvent.click(button);
      expect(routeToPreviousAppointmentPage.called).to.be.true;
    });

    it('should display an alert when user submits the form with no dates selected', async () => {
      const routeToNextAppointmentPage = sinon.spy();
      const routeToPreviousAppointmentPage = sinon.spy();

      // Seeding calendar with currently selected date and 3 previously selected dates
      const screen = renderWithStoreAndRouter(
        <DateTimeRequestPage
          data={{
            calendarData: {
              currentlySelectedDate: null,
              selectedDates: [],
            },
          }}
          routeToNextAppointmentPage={routeToNextAppointmentPage}
          routeToPreviousAppointmentPage={routeToPreviousAppointmentPage}
        />,
        {
          initialState,
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

      // it should allow the user to go to the previous page
      button = screen.getByRole('button', {
        name: /Back$/,
      });
      userEvent.click(button);
      expect(routeToPreviousAppointmentPage.called).to.be.true;

      // it should not allow user to submit the form
      button = screen.getByRole('button', {
        name: /^Continue/,
      });
      userEvent.click(button);
      expect(routeToNextAppointmentPage.called).to.be.false;
    });
  });
});
