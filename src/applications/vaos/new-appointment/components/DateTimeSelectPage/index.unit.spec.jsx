import { mockFetch } from '@department-of-veterans-affairs/platform-testing/helpers';
import { waitFor, waitForElementToBeRemoved } from '@testing-library/dom';
import { cleanup } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { expect } from 'chai';
import {
  addDays,
  addHours,
  addMonths,
  format,
  isThisMonth,
  isTomorrow,
  lastDayOfMonth,
  nextThursday,
  nextTuesday,
  setDay,
  startOfDay,
  startOfMonth,
  subDays,
} from 'date-fns';
import { formatInTimeZone, utcToZonedTime } from 'date-fns-tz';
import MockDate from 'mockdate';
import React from 'react';
import { Route } from 'react-router-dom';
import sinon from 'sinon';
import {
  createTestStore,
  getTestDate,
  renderWithStoreAndRouter,
  setClinic,
  setPreferredDate,
  setTypeOfCare,
  setVAFacility,
} from '../../../tests/mocks/setup';

import DateTimeSelectPage from '.';
import MockClinicResponse from '../../../tests/fixtures/MockClinicResponse';
import MockSlotResponse from '../../../tests/fixtures/MockSlotResponse';
import {
  mockAppointmentsApi,
  mockAppointmentSlotApi,
  mockEligibilityFetches,
} from '../../../tests/mocks/mockApis';
import {
  DATE_FORMATS,
  FETCH_STATUS,
  TYPE_OF_CARE_IDS,
} from '../../../utils/constants';
import { getTimezoneByFacilityId } from '../../../utils/timezone';

const initialState = {
  featureToggles: {
    vaOnlineSchedulingDirect: true,
  },
  user: {
    profile: {
      facilities: [{ facilityId: '983', isCerner: false }],
    },
  },
};

function setDateTimeSelectMockFetchesBase({
  typeOfCareId = 'primaryCare',
  preferredDate = new Date(),
  slotError = false,
  slotDatesByClinicId = {},
} = {}) {
  const clinicIds = Object.keys(slotDatesByClinicId);
  const clinics = MockClinicResponse.createResponses({
    clinics: [
      { id: '308', name: 'Green team clinic' },
      { id: '309', name: 'Red team clinic' },
    ],
  });

  mockEligibilityFetches({
    facilityId: '983',
    typeOfCareId,
    limit: true,
    requestPastVisits: true,
    clinics: clinicIds.length === 2 ? clinics : [clinics[0]],
    pastClinics: true,
  });
  mockEligibilityFetches({
    facilityId: '983',
    typeOfCareId,
    limit: true,
    directPastVisits: true,
    clinics: clinicIds.length === 2 ? clinics : [clinics[0]],
    pastClinics: true,
  });

  if (!slotError) {
    clinicIds.forEach(id => {
      const slots = slotDatesByClinicId[id].map(date => {
        return new MockSlotResponse({ id, duration: 20, start: date });
      });
      mockAppointmentSlotApi({
        facilityId: '983',
        preferredDate,
        clinicId: id,
        response: slots,
      });
    });
  }
}

function setDateTimeSelectMockFetches({
  typeOfCareId = 'primaryCare',
  preferredDate = new Date(),
  slotError = false,
  slotDatesByClinicId = {},
} = {}) {
  setDateTimeSelectMockFetchesBase({
    typeOfCareId,
    preferredDate,
    slotError,
    slotDatesByClinicId,
  });
}

function setDateTimeSelectMockFetchesDateFns({
  typeOfCareId = 'primaryCare',
  preferredDate = new Date(),
  slotError = false,
  slotDatesByClinicId = {},
} = {}) {
  setDateTimeSelectMockFetchesBase({
    typeOfCareId,
    preferredDate,
    slotError,
    slotDatesByClinicId,
  });
}

describe('VAOS Page: DateTimeSelectPage', () => {
  beforeEach(() => {
    mockFetch();
    MockDate.set(getTestDate());
  });

  afterEach(() => {
    MockDate.reset();
  });

  it.skip('should not submit form with validation error', async () => {
    // Ticket to fix test: https://github.com/department-of-veterans-affairs/va.gov-team/issues/120858
    const slot308Date = new Date(setDay(new Date(), 9).setHours(9, 0, 0));
    const slot309Date = new Date(setDay(new Date(), 11).setHours(13, 0, 0));
    setDateTimeSelectMockFetches({
      slotDatesByClinicId: {
        308: [slot308Date],
        309: [slot309Date],
      },
    });
    const preferredDate = addDays(new Date(), 1);

    const store = createTestStore(initialState);

    await setTypeOfCare(store, /primary care/i);
    await setVAFacility(store, '983');
    await setClinic(store, /green team/i);
    await setPreferredDate(store, preferredDate);

    // First pass check to make sure the slots associated with green team are displayed
    const screen = renderWithStoreAndRouter(
      <Route component={DateTimeSelectPage} />,
      {
        store,
      },
    );

    const overlay = screen.queryByTestId('loadingIndicator');
    if (overlay) {
      await waitForElementToBeRemoved(overlay);
    }
    // it should not allow user to submit the form without selecting a date
    const button = screen.getByText(/^Continue/);
    userEvent.click(button);

    // NOTE: alert does not have an accessible name to query by
    await waitFor(() => {
      expect(screen.getAllByRole('alert')).to.be.ok;
    });
    expect(screen.history.push.called).to.be.false;

    // should be able to go back with validation error
    userEvent.click(screen.getByText(/Back$/));
    await waitFor(() => {
      expect(screen.history.push.called).to.be.true;
    });
  });

  it('should display loading message when in loading state', async () => {
    const store = createTestStore({
      newAppointment: {
        data: {
          typeOfCareId: TYPE_OF_CARE_IDS.PRIMARY_CARE,
          vaFacility: '983GB',
          clinicId: '308',
        },
        pages: [],
        eligibility: {
          '983GB_323': { request: true },
        },
        appointmentSlotsStatus: FETCH_STATUS.loading,
      },
    });

    mockAppointmentSlotApi({
      facilityId: '983',
      preferredDate: new Date(),
      responseCode: 404,
    });

    const screen = renderWithStoreAndRouter(<DateTimeSelectPage />, {
      store,
    });

    // NOTE: progressbar does not have an accessible name to query by
    expect(screen.getByTestId('loadingIndicator')).to.be.ok;
  });

  it('should display error message if slots call fails', async () => {
    setDateTimeSelectMockFetches({
      slotDatesByClinicId: {
        308: [],
        309: [],
      },
      slotError: true,
    });

    mockAppointmentSlotApi({
      facilityId: '983',
      clinicId: '308',
      preferredDate: new Date(),
      responseCode: 404,
    });

    const store = createTestStore(initialState);

    await setTypeOfCare(store, /primary care/i);
    await setVAFacility(store, '983');
    await setClinic(store, /green team/i);
    await setPreferredDate(store, new Date());

    // First pass check to make sure the slots associated with green team are displayed
    const screen = renderWithStoreAndRouter(
      <Route component={DateTimeSelectPage} />,
      {
        store,
      },
    );

    // 1. Wait for progressbar to disappear
    const overlay = screen.queryByTestId('loadingIndicator');
    if (overlay) {
      await waitForElementToBeRemoved(overlay);
    }

    expect(
      screen.getByRole('heading', {
        level: 2,
        name: 'This tool isn’t working right now',
      }),
    ).to.be.ok;

    // it should display link to find your local VA health care facility
    expect(
      screen.getByRole('link', {
        name: 'Find your local VA health care facility (opens in a new tab)',
      }),
    ).to.be.ok;

    // it should display link to phone number
    expect(screen.getByTestId('crisis-hotline-telephone')).to.exist;
  });

  it('should allow a user to choose available slot and fetch new slots after changing clinics', async () => {
    const facilityId = '983';
    const timezone = getTimezoneByFacilityId(facilityId);
    const slot308Date = new Date(nextTuesday(new Date()).setHours(9, 0, 0, 0));

    // Add a day if the slot date is tomorrow since the slot date can revert to the
    // previous day depending on the timezone.
    let slot309Date = new Date(nextThursday(new Date()).setHours(13, 0, 0, 0));
    if (isTomorrow(slot309Date)) {
      slot309Date = addDays(slot309Date, 1);
    }
    const preferredDate = new Date();
    const start = subDays(preferredDate, 30);
    const end = addDays(preferredDate, 395);

    mockAppointmentsApi({
      start,
      end,
      statuses: ['booked', 'arrived', 'fulfilled', 'cancelled', 'checked-in'],
    });

    setDateTimeSelectMockFetchesDateFns({
      slotDatesByClinicId: {
        308: [slot308Date],
        309: [slot309Date],
      },
    });

    const store = createTestStore(initialState);

    await setTypeOfCare(store, /primary care/i);
    await setVAFacility(store, facilityId);
    await setClinic(store, /green team/i);
    await setPreferredDate(store, preferredDate);

    // First pass check to make sure the slots associated with green team are displayed
    let screen = renderWithStoreAndRouter(
      <Route component={DateTimeSelectPage} />,
      {
        store,
      },
    );

    // 1. Wait for progressbar to disappear
    let overlay = screen.queryByTestId('loadingIndicator');
    if (overlay) {
      await waitForElementToBeRemoved(overlay);
    }

    expect(
      screen.getByText(
        'We couldn’t find an appointment for your selected date',
      ),
    ).to.be.ok;

    // 2. Simulate user selecting a date
    const slot308DateString = formatInTimeZone(
      slot308Date,
      timezone,
      'EEEE, MMMM do',
    );
    let button = screen.queryByLabelText(new RegExp(slot308DateString, 'i'));

    if (!button) {
      userEvent.click(screen.getByText(/^Next/));
      button = await screen.findByLabelText(new RegExp(slot308DateString, 'i'));
    }

    userEvent.click(button);

    const expected308 = formatInTimeZone(
      slot308Date,
      timezone,
      "h:mm a 'option selected'",
    );
    userEvent.click(await screen.findByRole('radio', { name: expected308 }));
    expect(button.getAttribute('aria-label')).to.contain(', selected');

    userEvent.click(screen.getByText(/^Continue/));
    await waitFor(() => {
      expect(screen.history.push.called).to.be.true;
    });

    await cleanup();

    await setClinic(store, /red team/i);
    screen = renderWithStoreAndRouter(<DateTimeSelectPage />, {
      store,
    });

    // 3. Wait for progressbar to disappear
    overlay = screen.queryByTestId('loadingIndicator');
    if (overlay) {
      await waitForElementToBeRemoved(overlay);
    }

    // 4. Simulate user selecting a date
    const slot309DateString = formatInTimeZone(
      slot309Date,
      timezone,
      'EEEE, MMMM do',
    );
    button = screen.queryByLabelText(new RegExp(slot309DateString, 'i'));

    if (!button) {
      userEvent.click(screen.getByText(/^Next/));
      button = await screen.findByLabelText(new RegExp(slot309DateString, 'i'));
    }

    await waitFor(() => {
      expect(button.disabled).to.not.be.ok;
    });

    userEvent.click(button);
    const expected309 = formatInTimeZone(
      slot309Date,
      timezone,
      "h:mm a 'option selected'",
    );
    expect(await screen.findByRole('radio', { name: expected309 })).to.be.ok;
  });

  it('should adjust look and feel by screen size', async () => {
    const matchMediaStub = sinon.stub();
    const listeners = [];
    const matchResult = {
      matches: false,
      addListener: f => listeners.push(f),
      removeListener: f => listeners.filter(l => l === f),
    };
    const oldMatchMedia = global.matchMedia;
    global.matchMedia = matchMediaStub;
    matchMediaStub.returns(matchResult);

    const slot308Date = new Date(setDay(new Date(), 9).setHours(9, 0, 0));
    const preferredDate = new Date();

    setDateTimeSelectMockFetches({
      slotDatesByClinicId: {
        308: [slot308Date, slot308Date, slot308Date, slot308Date, slot308Date],
      },
    });

    mockAppointmentSlotApi({
      clinicId: '308',
      facilityId: '983',
      preferredDate,
      response: [
        {
          id: '308',
          type: 'slots',
          attributes: {
            start: format(slot308Date, DATE_FORMATS.ISODateTimeUTC),
            end: format(slot308Date, DATE_FORMATS.ISODateTimeUTC),
          },
        },
        {
          id: '308',
          type: 'slots',
          attributes: {
            start: format(slot308Date, DATE_FORMATS.ISODateTimeUTC),
            end: format(slot308Date, DATE_FORMATS.ISODateTimeUTC),
          },
        },
        {
          id: '308',
          type: 'slots',
          attributes: {
            start: format(slot308Date, DATE_FORMATS.ISODateTimeUTC),
            end: format(slot308Date, DATE_FORMATS.ISODateTimeUTC),
          },
        },
        {
          id: '308',
          type: 'slots',
          attributes: {
            start: format(slot308Date, DATE_FORMATS.ISODateTimeUTC),
            end: format(slot308Date, DATE_FORMATS.ISODateTimeUTC),
          },
        },
        {
          id: '308',
          type: 'slots',
          attributes: {
            start: format(slot308Date, DATE_FORMATS.ISODateTimeUTC),
            end: format(slot308Date, DATE_FORMATS.ISODateTimeUTC),
          },
        },
      ],
    });

    const store = createTestStore(initialState);

    await setTypeOfCare(store, /primary care/i);
    await setVAFacility(store, '983');
    await setClinic(store, /Yes/i);
    await setPreferredDate(store, preferredDate);

    // First pass check to make sure the slots associated with green team are displayed
    const screen = renderWithStoreAndRouter(<DateTimeSelectPage />, {
      store,
    });

    // 1. Wait for progressbar to disappear
    const overlay = screen.queryByTestId('loadingIndicator');
    if (overlay) {
      await waitForElementToBeRemoved(overlay);
    }

    expect(screen.findByText('Your appointment time')).to.be.ok;

    // 2. Simulate user selecting a date
    let button = screen.queryByLabelText(
      new RegExp(format(slot308Date, 'EEEE, MMMM do'), 'i'),
    );

    if (!button) {
      userEvent.click(screen.getByText(/^Next/));
      button = await screen.findByLabelText(
        new RegExp(format(slot308Date, 'EEEE, MMMM do'), 'i'),
      );
    }

    userEvent.click(button);

    await screen.findAllByRole('radio');

    // We can't really get around testing by class in here, since we're trying
    // to verify the look and feel is correct for users
    const slotElements = screen.baseElement.querySelectorAll(
      '.vaos-calendar__option-cell',
    );

    // At a row size of 2, with an uneven number of elements
    // the last element should have the last modifier, which adds extra padding
    // the upper right cell should also have a border radius and extra padding
    expect(slotElements[slotElements.length - 1]).to.have.class(
      'vaos-calendar__option-cell--last',
    );
    expect(slotElements[1]).to.have.class('vaos-u-border-radius--top-right');
    expect(slotElements[1]).to.have.class('vads-u-padding-right--2');

    matchMediaStub.withArgs('(min-width: 1008px)').returns({
      ...matchResult,
      matches: true,
    });
    await waitFor(() => {
      expect(listeners[0]).to.be.ok;
    });
    listeners[0]();

    // At a row size of 4, the cell in the top right is now the 4th item, so
    // that one should have the padding and border radius, and the second one
    // should not anymore
    await waitFor(() => {
      expect(slotElements[3]).to.have.class('vaos-u-border-radius--top-right');
    });
    expect(slotElements[1]).not.to.have.class(
      'vaos-u-border-radius--top-right',
    );
    expect(slotElements[1]).not.to.have.class('vads-u-padding-right--2');
    expect(slotElements[3]).to.have.class('vads-u-padding-right--2');

    matchMediaStub.withArgs('(min-width: 1008px)').returns(matchResult);
    matchMediaStub.withArgs('(min-width: 481px)').returns({
      ...matchResult,
      matches: true,
    });
    listeners[0]();

    // At a row size of 3, the cell in the top right is now the 3rd item, so
    // that one should have the padding and border radius, and the fourth one
    // should not anymore
    await waitFor(() => {
      expect(slotElements[2]).to.have.class('vaos-u-border-radius--top-right');
    });
    expect(slotElements[3]).not.to.have.class(
      'vaos-u-border-radius--top-right',
    );
    expect(slotElements[3]).not.to.have.class('vads-u-padding-right--2');
    expect(slotElements[2]).to.have.class('vads-u-padding-right--2');

    global.matchMedia = oldMatchMedia;
  });

  it('should show validation error if no date selected', async () => {
    const slot308Date = new Date(setDay(new Date(), 9).setHours(9, 0, 0));
    const preferredDate = new Date();

    setDateTimeSelectMockFetches({
      slotDatesByClinicId: {
        308: [slot308Date],
      },
    });

    mockAppointmentSlotApi({
      clinicId: '308',
      facilityId: '983',
      preferredDate,
      response: [
        {
          id: '308',
          type: 'slots',
          attributes: {
            start: format(slot308Date, DATE_FORMATS.ISODateTimeUTC),
            end: format(slot308Date, DATE_FORMATS.ISODateTimeUTC),
          },
        },
      ],
    });

    const store = createTestStore(initialState);

    await setTypeOfCare(store, /primary care/i);
    await setVAFacility(store, '983');
    await setClinic(store, /Yes/i);
    await setPreferredDate(store, preferredDate);

    const screen = renderWithStoreAndRouter(<DateTimeSelectPage />, {
      store,
    });

    // 1. Wait for progressbar to disappear
    const overlay = screen.queryByTestId('loadingIndicator');
    if (overlay) {
      await waitForElementToBeRemoved(overlay);
    }

    await screen.findByText(/Scheduling at Green team clinic/i);
    await screen.findByText(/Times are displayed in Mountain time \(MT\)\./i);

    const continueButton = screen.getByText(/continue/i);
    await waitFor(() => expect(continueButton.disabled).to.not.be.ok);
    userEvent.click(continueButton);
    expect(
      await screen.findByText(
        'Please choose your preferred date and time for your appointment',
      ),
    ).to.be.ok;
    expect(screen.history.push.called).not.to.be.true;
  });

  it('should show urgent care alert (has slots) message if preferred date is today', async () => {
    // Given the user has selected a clinic
    const store = createTestStore(initialState);

    // And the user has chosen today as their preferred date
    const preferredDate = startOfDay(new Date());
    await setPreferredDate(store, preferredDate);

    // And there are slots available today and tomorrow
    const slot308Date = addHours(new Date(), 1);

    // Adding 2 days since the default time is 00:00:00. Adding 1 day will result
    // in the same day when converted to America/Denver, thus resulting in no
    // available appointment slots.
    const slot308TomorrowDate = addDays(new Date(), 2);

    setDateTimeSelectMockFetches({
      slotDatesByClinicId: {
        308: [slot308Date, slot308TomorrowDate],
      },
    });

    mockAppointmentSlotApi({
      clinicId: '308',
      facilityId: '983',
      preferredDate,
      response: [
        {
          id: '308',
          type: 'slots',
          attributes: {
            start: formatInTimeZone(
              slot308Date,
              'UTC',
              DATE_FORMATS.ISODateTimeUTC,
            ),
            end: formatInTimeZone(
              slot308Date,
              'UTC',
              DATE_FORMATS.ISODateTimeUTC,
            ),
          },
        },
        {
          id: '308',
          type: 'slots',
          attributes: {
            start: formatInTimeZone(
              slot308TomorrowDate,
              'UTC',
              DATE_FORMATS.ISODateTimeUTC,
            ),
            end: formatInTimeZone(
              slot308TomorrowDate,
              'UTC',
              DATE_FORMATS.ISODateTimeUTC,
            ),
          },
        },
      ],
    });
    await setTypeOfCare(store, /primary care/i);
    await setVAFacility(store, '983');
    await setClinic(store, /Yes/i);

    // When the page is displayed
    const screen = renderWithStoreAndRouter(
      <Route component={DateTimeSelectPage} />,
      {
        store,
      },
    );

    // Then the urgent care alert is displayed
    expect(
      await screen.findByText(
        /If you need care sooner, use one of these urgent communications options/i,
      ),
    ).to.exist;

    // And the info about later slots is displayed
    expect(
      await screen.findByText(
        /If this date doesn’t work, you can pick a new one from the calendar./i,
      ),
    ).to.exist;

    // And the time shown as earliest available is tomorrow's slot
    expect(
      screen.getByText(
        new RegExp(
          format(
            utcToZonedTime(slot308TomorrowDate, 'America/Denver'),
            'MMMM d, yyyy',
          ),
        ),
      ),
    ).to.exist;
  });

  it('should show urgent care alert (no slots) message if preferred date is today', async () => {
    // Given the user has selected a clinic
    const store = createTestStore(initialState);

    // And the user has chosen today as their preferred date
    const preferredDate = new Date();
    await setPreferredDate(store, preferredDate);

    // And there are no slots available
    setDateTimeSelectMockFetches({
      slotDatesByClinicId: {
        308: [],
      },
    });

    await setTypeOfCare(store, /primary care/i);
    await setVAFacility(store, '983');
    await setClinic(store, /Yes/i);

    // When the page is displayed
    const screen = renderWithStoreAndRouter(
      <Route component={DateTimeSelectPage} />,
      {
        store,
      },
    );

    // Then the urgent care alert is displayed
    expect(
      await screen.findByText(
        /If you need care sooner, use one of these urgent communications options/i,
      ),
    ).to.exist;

    // And the info about calling the facility is displayed
    expect(
      screen.getByText(
        /To find an available date to schedule this appointment, you can call your local VA health care facility./,
      ),
    ).to.be.ok;
  });

  it('should show info standard of care alert when there is a wait for a mental health appointments', async () => {
    const preferredDate = new Date();
    const slot308Date = addDays(new Date(), 6);

    setDateTimeSelectMockFetches({
      typeOfCareId: 'outpatientMentalHealth',
      slotDatesByClinicId: {
        308: [slot308Date],
      },
    });

    const store = createTestStore(initialState);

    await setTypeOfCare(store, /mental health/i);
    await setVAFacility(store, '983', 'outpatientMentalHealth');
    await setClinic(store, /Yes/i);
    await setPreferredDate(store, preferredDate);

    const screen = renderWithStoreAndRouter(
      <Route component={DateTimeSelectPage} />,
      {
        store,
      },
    );

    expect(
      await screen.findByText(/The earliest we can schedule your appointment/i),
    ).to.exist;
    // This shouldn't show up if not eligible for requests
    expect(screen.queryByText(/request an earlier appointment/i)).not.to.exist;
  });

  it('should show info standard of care alert when there is a wait for non mental health appointments', async () => {
    const preferredDate = new Date();
    const slot308Date = addDays(new Date(), 6);

    setDateTimeSelectMockFetches({
      slotDatesByClinicId: {
        308: [slot308Date],
      },
    });

    const store = createTestStore(initialState);

    await setTypeOfCare(store, /primary care/i);
    await setVAFacility(store, '983');
    await setClinic(store, /Yes/i);
    await setPreferredDate(store, preferredDate);

    const screen = renderWithStoreAndRouter(
      <Route component={DateTimeSelectPage} />,
      {
        store,
      },
    );

    expect(
      await screen.findByText(/The earliest we can schedule your appointment/i),
    ).to.exist;

    // Go to the request flow if these dates don't work
    userEvent.click(screen.getByTestId('appointment-request-link'));

    await waitFor(() =>
      expect(screen.history.push.firstCall.args[0]).to.equal('va-request/'),
    );
  });

  it('should start calendar on preferred date month', async () => {
    // Given a user eligible for direct scheduling
    // And a preferred date and available slot several months in the future
    const slot308Date = new Date(
      setDay(addMonths(new Date(), 4), 11).setHours(13, 0, 0),
    );
    const preferredDate = addMonths(new Date(), 4);

    setDateTimeSelectMockFetches({
      preferredDate,
      slotDatesByClinicId: {
        308: [slot308Date],
      },
    });

    mockAppointmentSlotApi({
      clinicId: '308',
      facilityId: '983',
      preferredDate,
      response: [
        {
          id: '308',
          type: 'slots',
          attributes: {
            start: format(slot308Date, DATE_FORMATS.ISODateTimeUTC),
            end: format(slot308Date, DATE_FORMATS.ISODateTimeUTC),
          },
        },
      ],
    });

    const store = createTestStore(initialState);

    await setTypeOfCare(store, /primary care/i);
    await setVAFacility(store, '983');
    await setClinic(store, /Yes/i);
    await setPreferredDate(store, preferredDate);

    // When the page is displayed
    const screen = renderWithStoreAndRouter(
      <Route component={DateTimeSelectPage} />,
      {
        store,
      },
    );

    // 1. Wait for progressbar to disappear
    const overlay = screen.queryByTestId('loadingIndicator');
    if (overlay) {
      await waitForElementToBeRemoved(overlay);
    }

    // Then the calendar is on the month of the preferred date
    expect(
      screen.getByRole('heading', {
        level: 2,
        name: format(addMonths(new Date(), 4), 'MMMM yyyy'),
      }),
    ).to.be.ok;

    // And the user is able to continue to the next month
    expect(
      // It takes 1.5s to search for buttons by role on this page, this is quicker
      screen.getByText(
        (content, el) => el.textContent === 'Next' && el.type === 'button',
      ),
    ).to.not.have.attribute('disabled');
  });

  it('should show required text next to page heading', async () => {
    const preferredDate = new Date();
    const slot308Date = addDays(new Date(), 6);

    setDateTimeSelectMockFetches({
      typeOfCareId: 'outpatientMentalHealth',
      slotDatesByClinicId: {
        308: [slot308Date],
      },
    });

    const store = createTestStore(initialState);

    await setTypeOfCare(store, /mental health/i);
    await setVAFacility(store, '983', 'outpatientMentalHealth');
    await setClinic(store, /Yes/i);
    await setPreferredDate(store, preferredDate);

    const screen = renderWithStoreAndRouter(
      <Route component={DateTimeSelectPage} />,
      {
        store,
      },
    );

    expect(await screen.findByText(/Required/i)).to.exist;
  });
});

describe('When preferred date is immediate care', () => {
  describe('And current date is last day of the month and end of day', () => {
    beforeEach(() => {
      mockFetch();
    });

    it('should fetch slots when moving between months', async () => {
      MockDate.set(lastDayOfMonth(new Date()));

      const facilityId = '983';
      const timezone = getTimezoneByFacilityId(facilityId);
      const preferredDate = new Date();

      // NOTE: Available slot dates must be after tommorow. So in this case, timezone
      // conversion to MT resulted in the previous day thus the need to add 2 days.
      // See: ./new-appointments/redux/actions.js/getAppointmentsSlots:680
      const slot308Date = addDays(preferredDate, 2);

      // NOTE: The initial request for slots returns 2 months worth thus the need
      // to add 2 months.
      const secondSlotDate = lastDayOfMonth(addMonths(preferredDate, 2));
      const clinics = MockClinicResponse.createResponses({
        clinics: [
          { id: '308', name: 'Green team clinic' },
          { id: '309', name: 'Red team clinic' },
        ],
      });

      mockAppointmentsApi({
        start: subDays(new Date(), 30),
        end: addDays(new Date(), 395),
        statuses: ['booked', 'arrived', 'fulfilled', 'cancelled', 'checked-in'],
      });
      mockEligibilityFetches({
        facilityId,
        typeOfCareId: 'primaryCare',
        clinics,
      });
      mockAppointmentSlotApi({
        facilityId,
        clinicId: '308',
        response: [
          new MockSlotResponse({
            id: '1',
            start: slot308Date,
          }),
        ],
        startDate: startOfMonth(startOfDay(preferredDate)),
        endDate: lastDayOfMonth(addMonths(startOfDay(preferredDate), 1)),
      });
      mockAppointmentSlotApi({
        facilityId,
        clinicId: '308',
        response: [
          new MockSlotResponse({
            id: '1',
            start: secondSlotDate,
          }),
        ],
        startDate: startOfMonth(addMonths(startOfDay(preferredDate), 2)),
        endDate: lastDayOfMonth(addMonths(startOfDay(preferredDate), 2)),
      });

      const store = createTestStore(initialState);

      await setTypeOfCare(store, /primary care/i);
      await setVAFacility(store, facilityId);
      await setClinic(store, /green team/i);
      await setPreferredDate(store, preferredDate);

      // First pass check to make sure the slots associated with green team are displayed
      const screen = renderWithStoreAndRouter(
        <Route component={DateTimeSelectPage} />,
        {
          store,
        },
      );

      let overlay = screen.queryByTestId('loadingIndicator');
      if (overlay) {
        await waitForElementToBeRemoved(overlay);
      }

      // Clicking next since preferred date is end of month. Appointment slots
      // will be returned for the next month since immediate care is not allowed.
      // NOTE: A warning message is displayed indicating this.
      userEvent.click(screen.getByText(/^Next/));

      const slot308DateString = formatInTimeZone(
        slot308Date,
        timezone,
        'EEEE, MMMM do',
      );
      let dayOfMonthButton = screen.getByLabelText(
        new RegExp(slot308DateString, 'i'),
      );
      userEvent.click(dayOfMonthButton);

      const expected308 = formatInTimeZone(
        slot308Date,
        timezone,
        "h:mm a 'option selected'",
      );
      userEvent.click(await screen.findByRole('radio', { name: expected308 }));

      userEvent.click(screen.getByText(/^Next/));
      overlay = screen.queryByTestId('loadingIndicator');
      if (overlay) {
        await waitForElementToBeRemoved(overlay);
      }

      const secondDateString = formatInTimeZone(
        secondSlotDate,
        timezone,
        'EEEE, MMMM do',
      );
      dayOfMonthButton = await screen.findByLabelText(
        new RegExp(secondDateString, 'i'),
      );
      userEvent.click(dayOfMonthButton);

      const expectedSecondSlot = formatInTimeZone(
        secondSlotDate,
        timezone,
        "h:mm a 'option selected'",
      );
      userEvent.click(
        await screen.findByRole('radio', { name: expectedSecondSlot }),
      );

      // Go back and select initial slot
      userEvent.click(screen.getByText(/^Prev/));

      dayOfMonthButton = screen.getByLabelText(
        new RegExp(slot308DateString, 'i'),
      );
      userEvent.click(dayOfMonthButton);
      userEvent.click(await screen.findByRole('radio', { name: expected308 }));

      // Have a selected slot, can move to next screen
      userEvent.click(screen.getByText(/^Continue/));
      await waitFor(() => {
        expect(screen.history.push.called).to.be.true;
      });
      screen.history.push.reset();

      // Clicking selected date should unselect date
      userEvent.click(dayOfMonthButton);
      userEvent.click(screen.getByText(/^Continue/));
      await waitFor(() => {
        expect(screen.getByRole('alert')).to.be.ok;
      });
      expect(screen.history.push.called).to.be.false;

      MockDate.reset();
    });
  });
});

describe('When preferred date is not immediate care', () => {
  describe('And current date is last day of the month and end of day', () => {
    beforeEach(() => {
      mockFetch();
    });

    // Check for test flakyness on the last day of each month
    it('should fetch slots when moving between months', async () => {
      MockDate.set(lastDayOfMonth(new Date()));

      const facilityId = '983';
      const timezone = getTimezoneByFacilityId(facilityId);
      const preferredDate = addDays(new Date(), 1);

      // NOTE: Available slot dates must be after tommorow. So in this case, timezone
      // conversion to MT resulted in the previous day thus the need to add 2 days.
      // See: ./new-appointments/redux/actions.js/getAppointmentsSlots:680
      const slot308Date = addDays(preferredDate, 2);

      // NOTE: The initial request for slots returns 2 months worth thus the need
      // to add 2 months.
      const secondSlotDate = lastDayOfMonth(addMonths(preferredDate, 2));
      const clinics = MockClinicResponse.createResponses({
        clinics: [
          { id: '308', name: 'Green team clinic' },
          { id: '309', name: 'Red team clinic' },
        ],
      });

      mockAppointmentsApi({
        start: subDays(new Date(), 30),
        end: addDays(new Date(), 395),
        statuses: ['booked', 'arrived', 'fulfilled', 'cancelled', 'checked-in'],
      });
      mockEligibilityFetches({
        facilityId,
        typeOfCareId: 'primaryCare',
        clinics,
      });
      mockAppointmentSlotApi({
        facilityId,
        clinicId: '308',
        response: [
          new MockSlotResponse({
            id: '1',
            start: slot308Date,
          }),
        ],
        startDate: startOfMonth(startOfDay(preferredDate)),
        endDate: lastDayOfMonth(addMonths(startOfDay(preferredDate), 1)),
      });
      mockAppointmentSlotApi({
        facilityId,
        clinicId: '308',
        response: [
          new MockSlotResponse({
            id: '1',
            start: secondSlotDate,
          }),
        ],
        startDate: startOfMonth(addMonths(startOfDay(preferredDate), 2)),
        endDate: lastDayOfMonth(addMonths(startOfDay(preferredDate), 2)),
      });

      const store = createTestStore(initialState);

      await setTypeOfCare(store, /primary care/i);
      await setVAFacility(store, facilityId);
      await setClinic(store, /green team/i);
      await setPreferredDate(store, preferredDate);

      // First pass check to make sure the slots associated with green team are displayed
      const screen = renderWithStoreAndRouter(
        <Route component={DateTimeSelectPage} />,
        {
          store,
        },
      );

      let overlay = screen.queryByTestId('loadingIndicator');
      if (overlay) {
        await waitForElementToBeRemoved(overlay);
      }

      const slot308DateString = formatInTimeZone(
        slot308Date,
        timezone,
        'EEEE, MMMM do',
      );

      // Did timezone conversion bump date to next month?
      if (isThisMonth(preferredDate)) {
        userEvent.click(screen.getByText(/^Next/));
      }

      let dayOfMonthButton = screen.getByLabelText(
        new RegExp(slot308DateString, 'i'),
      );
      userEvent.click(dayOfMonthButton);

      const expected308 = formatInTimeZone(
        slot308Date,
        timezone,
        "h:mm a 'option selected'",
      );
      userEvent.click(await screen.findByRole('radio', { name: expected308 }));

      // Need to move two months to trigger second fetch
      userEvent.click(screen.getByText(/^Next/));
      userEvent.click(screen.getByText(/^Next/));
      overlay = screen.queryByTestId('loadingIndicator');
      if (overlay) {
        await waitForElementToBeRemoved(overlay);
      }

      const secondDateString = formatInTimeZone(
        secondSlotDate,
        timezone,
        'EEEE, MMMM do',
      );
      dayOfMonthButton = await screen.findByLabelText(
        new RegExp(secondDateString, 'i'),
      );
      userEvent.click(dayOfMonthButton);

      const expectedSecondSlot = formatInTimeZone(
        secondSlotDate,
        timezone,
        "h:mm a 'option selected'",
      );
      userEvent.click(
        await screen.findByRole('radio', { name: expectedSecondSlot }),
      );

      // Go back and select initial slot
      userEvent.click(screen.getByText(/^Prev/));
      userEvent.click(screen.getByText(/^Prev/));

      dayOfMonthButton = screen.getByLabelText(
        new RegExp(slot308DateString, 'i'),
      );
      userEvent.click(dayOfMonthButton);
      userEvent.click(await screen.findByRole('radio', { name: expected308 }));

      // Have a selected slot, can move to next screen
      userEvent.click(screen.getByText(/^Continue/));
      await waitFor(() => {
        expect(screen.history.push.called).to.be.true;
      });
      screen.history.push.reset();

      // Clicking selected date should unselect date
      userEvent.click(dayOfMonthButton);
      userEvent.click(screen.getByText(/^Continue/));
      await waitFor(() => {
        expect(screen.getByRole('alert')).to.be.ok;
      });
      expect(screen.history.push.called).to.be.false;

      MockDate.reset();
    });
  });
});
