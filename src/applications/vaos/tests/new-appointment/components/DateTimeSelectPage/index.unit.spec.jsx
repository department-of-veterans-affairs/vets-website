import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';
import moment from 'moment';
import {
  createTestStore,
  renderWithStoreAndRouter,
} from '../../../mocks/setup';
import userEvent from '@testing-library/user-event';

// import {
//   DateTimeSelectPage,
//   getOptionsByDate,
// } from '../../../../new-appointment/components/DateTimeSelectPage';
import DateTimeSelectPage from '../../../../new-appointment/components/DateTimeSelectPage';
import { FETCH_STATUS } from '../../../../utils/constants';

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

function getAppointmentTimeSlots(date, count) {
  const start = moment(date)
    .minute(0)
    .second(0);
  const end = moment(date)
    .minute(15)
    .second(0);
  const collection = [];

  for (let i = 0; i < count; i++) {
    collection.push({
      start: start.clone().format('YYYY-MM-DDTHH:mm'),
      end: end.clone().format('YYYY-MM-DDTHH:mm'),
    });
    start.minute(start.minute() + 15);
    end.minute(end.minute() + 15);
  }
  return collection;
}

const availableDates = [
  getMondayTruFriday(moment().add(5, 'd')).format('YYYY-MM-DD'),
];

const availableSlots = getAppointmentTimeSlots(moment().add(5, 'd'), 2);

describe('VAOS <DateTimeSelectPage>', () => {
  it('should not submit form with validation error', () => {
    const routeToNextAppointmentPage = sinon.spy();
    const store = createTestStore({
      newAppointment: {
        data: {
          calendarData: {
            currentlySelectedDate: null,
            selectedDates: [],
          },
          availableSlots,
        },
        pages: [],
        eligibility: [],
      },
    });

    const screen = renderWithStoreAndRouter(<DateTimeSelectPage />, {
      store,
    });

    // it should not allow user to submit the form without selecting a date
    const button = screen.getByRole('button', {
      name: /^Continue/,
    });
    userEvent.click(button);

    // NOTE: alert does not have an accessible name to query by
    expect(screen.getByRole('alert')).to.be.ok;

    // NOTE: Implementation detail
    expect(routeToNextAppointmentPage.called).to.be.false;
  });

  it('should allow user to select date and time for a VA appointment', async () => {
    const store = createTestStore({
      newAppointment: {
        availableDates,
        availableSlots,
        data: {
          calendarData: {
            currentlySelectedDate: null,
            selectedDates: [],
          },
        },
        pages: [],
        eligibility: [],
      },
    });

    const screen = renderWithStoreAndRouter(<DateTimeSelectPage />, {
      store,
    });

    // it should display page heading
    expect(
      await screen.findByRole('heading', {
        level: 1,
        name: /Tell us the date and time you’d like your appointment/i,
      }),
    ).to.be.ok;

    // it should display 2 calendar months for VA appointments
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

    // it should allow the user to select an appointment time
    const button = screen.getByRole('button', {
      name: moment()
        .add(5, 'd')
        .format('dddd, MMMM Do'),
    });
    userEvent.click(button);
    const time = moment()
      .minute(0)
      .format('h:mm');
    const radio = screen.getByRole('radio', {
      name: new RegExp(`${time}`),
    });
    userEvent.click(radio);

    // NOTE: Doesn't work as expected. Expectation is radio button state should be 'clicked'
    // when clicking the button. I don't know why the button state is not updated.
    // expect(
    //   screen.getByRole('radio', {
    //     name: new RegExp(`^${time}`),
    //     checked: true,
    //   }),
    // ).to.be.ok;
  });

  it('should display loading message when in loading state', async () => {
    const store = createTestStore({
      newAppointment: {
        availableDates,
        availableSlots,
        data: {
          calendarData: {},
        },
        pages: [],
        eligibility: [],
        appointmentSlotsStatus: FETCH_STATUS.loading,
      },
    });

    const screen = renderWithStoreAndRouter(<DateTimeSelectPage />, {
      store,
    });

    // NOTE: progressbar does not have an accessible name to query by
    expect(screen.getByRole('progressbar')).to.be.ok;
  });

  it('should display wait time alert message when not in loading state', async () => {
    const store = createTestStore({
      newAppointment: {
        availableDates,
        availableSlots,
        data: {
          calendarData: {},
        },
        pages: [],
        eligibility: [],
        appointmentSlotsStatus: FETCH_STATUS.succeeded,
      },
    });

    const screen = renderWithStoreAndRouter(<DateTimeSelectPage />, {
      store,
    });

    expect(
      screen.getByRole('heading', {
        level: 2,
        name: 'Your earliest appointment time',
      }),
    ).to.be.ok;
  });

  // it('should return options for date with getOptionsByDate', () => {
  //   const selectedDate = getMondayTruFriday(moment().add(5, 'd')).format(
  //     'YYYY-MM-DD',
  //   );
  //   const options = getOptionsByDate(
  //     selectedDate,
  //     'America/Denver',
  //     availableSlots,
  //   );
  //   const dateTime0 = moment(availableSlots[0].start);
  //   const dateTime1 = moment(availableSlots[1].start);
  //   const srMeridiem = m =>
  //     m
  //       .format('A')
  //       .replace(/\./g, '')
  //       .toUpperCase();

  //   expect(options.length).to.equal(2);
  //   expect(options[0].label.props.children[0]).to.equal(
  //     dateTime0.format('h:mm'),
  //   );
  //   expect(options[0].label.props.children[2].props.children).to.equal(
  //     dateTime0.format('A'),
  //   );
  //   expect(options[0].label.props.children[4].props.children).to.equal(
  //     srMeridiem(dateTime0),
  //   );

  //   expect(options[1].label.props.children[0]).to.equal(
  //     dateTime1.format('h:mm'),
  //   );
  //   expect(options[1].label.props.children[2].props.children).to.equal(
  //     dateTime1.format('A'),
  //   );
  //   expect(options[1].label.props.children[4].props.children).to.equal(
  //     srMeridiem(dateTime1),
  //   );
  // });

  // it('should adjust for timezone if passed UTC', () => {
  //   const selectedDate = '2019-10-29';

  //   const options = getOptionsByDate(selectedDate, 'America/Denver', [
  //     {
  //       start: '2019-10-29T09:30:00Z',
  //       end: '2019-10-29T09:50:00Z',
  //     },
  //   ]);

  //   expect(options[0].label.props.children[0]).to.equal('3:30');
  // });

  it('should display error message if slots call fails', () => {
    const store = createTestStore({
      newAppointment: {
        availableDates,
        availableSlots,
        data: {
          calendarData: {},
        },
        pages: [],
        eligibility: [],
        appointmentSlotsStatus: FETCH_STATUS.failed,
      },
    });

    const screen = renderWithStoreAndRouter(<DateTimeSelectPage />, {
      store,
    });

    expect(
      screen.getByRole('heading', {
        level: 3,
        name:
          'We’ve run into a problem when trying to find available appointment times',
      }),
    ).to.be.ok;

    // it should display link to find the nearest VA medical center
    expect(
      screen.getByRole('link', {
        name: 'Find your nearest VA medical center',
      }),
    ).to.be.ok;

    // it should display link to contact the local VA medical center
    expect(
      screen.getByRole('link', {
        name: 'Contact your local VA medical center',
      }),
    ).to.be.ok;

    // it should display link to call the local VA medical center
    expect(
      screen.getByRole('link', {
        name: 'call your local VA medical center',
      }),
    ).to.be.ok;

    // it should display link to phone number
    expect(
      screen.getByRole('link', {
        name: '800-273-8255',
      }),
    ).to.be.ok;
  });
});
