import React from 'react';
import { expect } from 'chai';
import moment from 'moment';
import {
  createTestStore,
  renderWithStoreAndRouter,
  setTypeOfCare,
  setVAFacility,
  setClinic,
  setPreferredDate,
} from '../../../mocks/setup';
import userEvent from '@testing-library/user-event';

import DateTimeSelectPage from '../../../../new-appointment/components/DateTimeSelectPage';
import { FETCH_STATUS } from '../../../../utils/constants';
import { waitFor } from '@testing-library/dom';
import { Route } from 'react-router-dom';
import parentFacilities from '../../../../services/mocks/var/facilities.json';
import { transformParentFacilities } from '../../../../services/organization/transformers';
import { cleanup } from '@testing-library/react';
import {
  mockEligibilityFetches,
  mockAppointmentSlotFetch,
} from '../../../mocks/helpers';
import { getClinicMock, getAppointmentSlotMock } from '../../../mocks/v0';
import { mockFetch, resetFetch } from 'platform/testing/unit/helpers';

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
  xit('should allow user to select date and time for a VA appointment', async () => {
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
    await waitFor(() => {
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
    const radio = await screen.findByRole('radio', {
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

  it('should fetch new slots after clinic change', async () => {
    // Initial global fetch
    mockFetch();

    const clinics = [
      {
        id: '308',
        attributes: {
          ...getClinicMock(),
          siteCode: '983',
          clinicId: '308',
          institutionCode: '983',
          clinicFriendlyLocationName: 'Green team clinic',
        },
      },
      {
        id: '309',
        attributes: {
          ...getClinicMock(),
          siteCode: '983',
          clinicId: '309',
          institutionCode: '983',
          clinicFriendlyLocationName: 'Red team clinic',
        },
      },
    ];
    mockEligibilityFetches({
      siteId: '983',
      facilityId: '983',
      typeOfCareId: '323',
      limit: true,
      requestPastVisits: true,
      directPastVisits: true,
      clinics,
      pastClinics: true,
    });
    const slot308Date = moment()
      .day(9)
      .hour(9)
      .minute(0)
      .second(0);
    const slots308 = [
      {
        ...getAppointmentSlotMock(),
        startDateTime: slot308Date.format('YYYY-MM-DDTHH:mm:ss[+00:00]'),
        endDateTime: slot308Date
          .clone()
          .minute(20)
          .format('YYYY-MM-DDTHH:mm:ss[+00:00]'),
      },
    ];

    const slot309Date = moment()
      .day(11)
      .hour(13)
      .minute(0)
      .second(0);
    const slots309 = [
      {
        ...getAppointmentSlotMock(),
        startDateTime: slot309Date.format('YYYY-MM-DDTHH:mm:ss[+00:00]'),
        endDateTime: slot309Date
          .clone()
          .minute(20)
          .format('YYYY-MM-DDTHH:mm:ss[+00:00]'),
      },
    ];
    const preferredDate = moment();
    mockAppointmentSlotFetch({
      siteId: '983',
      clinicId: '308',
      typeOfCareId: '323',
      slots: slots308,
      preferredDate,
    });
    mockAppointmentSlotFetch({
      siteId: '983',
      clinicId: '309',
      typeOfCareId: '323',
      slots: slots309,
      preferredDate,
    });

    const initialState = {
      featureToggles: {
        vaOnlineSchedulingVSPAppointmentNew: false,
        vaOnlineSchedulingDirect: true,
      },
      user: {
        profile: {
          facilities: [{ facilityId: '983', isCerner: false }],
        },
      },
    };

    const store = createTestStore(initialState);

    await setTypeOfCare(store, /primary care/i);
    await setVAFacility(store, '983');
    await setClinic(store, /green team/i);
    await setPreferredDate(store, preferredDate);

    // First pass check to make sure the slots associated with green team are displayed
    let screen = renderWithStoreAndRouter(<DateTimeSelectPage />, {
      store,
    });

    // 1. Wait for progressbar to disappear
    await waitFor(
      () =>
        expect(
          screen.queryByRole('progressbar', {
            name: 'Finding appointment availability...',
          }),
        ).to.not.exist,
    );

    // 2. Simulate user selecting a date
    let button = screen.getByRole('button', {
      name: slot308Date.format('dddd, MMMM Do'),
    });
    userEvent.click(button);
    expect(
      await screen.findByRole('radio', { name: '9:00 AM option selected' }),
    ).to.be.ok;

    await cleanup();

    // Second pass make sure the slots associated with red team are displayed
    await setClinic(store, /red team/i);
    screen = renderWithStoreAndRouter(<DateTimeSelectPage />, {
      store,
    });

    // 3. Wait for progressbar to disappear
    await waitFor(
      () =>
        expect(
          screen.queryByRole('progressbar', {
            name: 'Finding appointment availability...',
          }),
        ).to.not.exist,
    );

    // 4. Simulate user selecting a date
    button = screen.getByRole('button', {
      name: slot309Date.format('dddd, MMMM Do'),
    });
    userEvent.click(button);
    expect(
      await screen.findByRole('radio', { name: '1:00 PM option selected' }),
    ).to.be.ok;

    // Cleanup
    resetFetch();
  });
});
