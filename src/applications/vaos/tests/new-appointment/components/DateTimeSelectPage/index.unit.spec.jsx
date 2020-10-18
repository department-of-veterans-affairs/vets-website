import React from 'react';
import { expect } from 'chai';
import moment from 'moment';
import {
  createTestStore,
  renderWithStoreAndRouter,
} from '../../../mocks/setup';
import userEvent from '@testing-library/user-event';

import DateTimeSelectPage from '../../../../new-appointment/components/DateTimeSelectPage';
import { FETCH_STATUS } from '../../../../utils/constants';
import { waitFor } from '@testing-library/dom';
import { Route } from 'react-router-dom';
import parentFacilities from '../../../../services/mocks/var/facilities.json';
import { transformParentFacilities } from '../../../../services/organization/transformers';

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

const parentFacilitiesParsed = transformParentFacilities(
  parentFacilities.data.map(item => ({
    ...item.attributes,
    id: item.id,
  })),
);

const availableSlots = getAppointmentTimeSlots(
  getMondayTruFriday(moment().add(5, 'd')),
  2,
);

describe('VAOS <DateTimeSelectPage>', () => {
  it('should allow user to select date and time for a VA appointment', async () => {
    const store = createTestStore({
      newAppointment: {
        availableSlots,
        data: {
          calendarData: {
            currentlySelectedDate: null,
            selectedDates: [],
          },
          preferredDate: getMondayTruFriday(moment().add(5, 'd')),
          vaParent: 'var983',
          clinicId: 'var_408',
        },
        pages: [],
        previousPages: [],
        eligibility: [],
        parentFacilities: parentFacilitiesParsed,
      },
    });

    const screen = renderWithStoreAndRouter(
      <Route component={DateTimeSelectPage} />,
      {
        store,
      },
    );

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

    // Find all available appointments for the current month
    const currentMonth = moment().format('MMMM');
    const buttons = screen
      .getAllByRole('button', { name: new RegExp(`${currentMonth}`) })
      .filter(button => button.disabled === false);

    // it should allow the user to select an appointment time
    userEvent.click(buttons[0]);
    const time = moment()
      .minute(0)
      .format('h:mm');
    const radio = screen.getByRole('radio', {
      name: new RegExp(`${time}`),
    });
    userEvent.click(radio);

    // 4. it should allow the user to submit the form
    const button = screen.getByRole('button', {
      name: /^Continue/,
    });
    userEvent.click(button);
    await waitFor(() => {
      expect(screen.history.push.called).to.be.true;
    });
  });

  it('should not submit form with validation error', async () => {
    const store = createTestStore({
      newAppointment: {
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

    // it should not allow user to submit the form without selecting a date
    const button = screen.getByRole('button', {
      name: /^Continue/,
    });
    userEvent.click(button);

    // NOTE: alert does not have an accessible name to query by
    await waitFor(() => {
      expect(screen.getByRole('alert')).to.be.ok;
    });
  });

  it('should display loading message when in loading state', async () => {
    const store = createTestStore({
      newAppointment: {
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

  it('should display error message if slots call fails', () => {
    const store = createTestStore({
      newAppointment: {
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
