import React from 'react';
import { Route } from 'react-router-dom';
import { expect } from 'chai';
import sinon from 'sinon';
import moment from 'moment';
import { waitFor, waitForElementToBeRemoved } from '@testing-library/dom';
import { cleanup } from '@testing-library/react';
import { mockFetch } from '@department-of-veterans-affairs/platform-testing/helpers';
import userEvent from '@testing-library/user-event';
import MockDate from 'mockdate';
import {
  createTestStore,
  renderWithStoreAndRouter,
  setTypeOfCare,
  setVAFacility,
  setClinic,
  setPreferredDate,
  getTestDate,
} from '../../../mocks/setup';

import DateTimeSelectPage from '../../../../new-appointment/components/DateTimeSelectPage';
import { FETCH_STATUS } from '../../../../utils/constants';
import { setDateTimeSelectMockFetches } from './helpers';
import { createMockCheyenneFacilityByVersion } from '../../../mocks/data';
import { mockFacilityFetchByVersion } from '../../../mocks/fetch';
import { mockAppointmentSlotFetch } from '../../../mocks/helpers.v2';

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

describe('VAOS Page: DateTimeSelectPage', () => {
  beforeEach(() => {
    mockFetch();
    MockDate.set(getTestDate());
    mockFacilityFetchByVersion({
      facility: createMockCheyenneFacilityByVersion({
        version: 0,
      }),
      version: 0,
    });
  });

  afterEach(() => {
    MockDate.reset();
  });

  it('should not submit form with validation error', async () => {
    const slot308Date = moment()
      .day(9)
      .hour(9)
      .minute(0)
      .second(0);
    const slot309Date = moment()
      .day(11)
      .hour(13)
      .minute(0)
      .second(0);
    setDateTimeSelectMockFetches({
      slotDatesByClinicId: {
        308: [slot308Date],
        309: [slot309Date],
      },
    });
    mockAppointmentSlotFetch({
      clinicId: '308',
      facilityId: '983',
      preferredDate: moment(),
      response: [],
    });
    const preferredDate = moment();

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
          typeOfCareId: '323',
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

    const store = createTestStore(initialState);

    await setTypeOfCare(store, /primary care/i);
    await setVAFacility(store, '983');
    await setClinic(store, /green team/i);
    await setPreferredDate(store, moment());

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
        name: 'We’ve run into a problem trying to find an appointment time',
      }),
    ).to.be.ok;

    // it should display link to contact the local VA medical center
    expect(
      screen.getByRole('link', {
        name: 'Contact your local VA medical center Link opens in a new tab.',
      }),
    ).to.be.ok;

    // it should display link to call the local VA medical center
    expect(
      screen.getByRole('link', {
        name: 'call your local VA medical center Link opens in a new tab.',
      }),
    ).to.be.ok;

    // it should display link to phone number
    expect(screen.getByTestId('crisis-hotline-telephone')).to.exist;
  });

  it('should allow a user to choose available slot and fetch new slots after changing clinics', async () => {
    const slot308Date = moment()
      .day(9)
      .hour(9)
      .minute(0)
      .second(0);
    const slot309Date = moment()
      .day(11)
      .hour(13)
      .minute(0)
      .second(0);
    const preferredDate = moment();
    mockAppointmentSlotFetch({
      clinicId: '308',
      facilityId: '983',
      preferredDate,
      response: [
        {
          id: '308',
          type: 'slots',
          attributes: {
            start: slot308Date.format('YYYY-MM-DDTHH:mm:ssZ'),
            end: slot308Date.format('YYYY-MM-DDTHH:mm:ssZ'),
          },
        },
      ],
    });

    setDateTimeSelectMockFetches({
      slotDatesByClinicId: {
        308: [slot308Date],
        309: [slot309Date],
      },
    });

    const store = createTestStore(initialState);

    await setTypeOfCare(store, /primary care/i);
    await setVAFacility(store, '983');
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

    expect(screen.getByText('Your appointment time')).to.be.ok;

    // 2. Simulate user selecting a date
    let button = screen.queryByLabelText(
      new RegExp(slot308Date.format('dddd, MMMM Do'), 'i'),
    );

    if (!button) {
      userEvent.click(screen.getByText(/^Next/));
      button = await screen.findByLabelText(
        new RegExp(slot308Date.format('dddd, MMMM Do'), 'i'),
      );
    }

    userEvent.click(button);

    userEvent.click(
      await screen.findByRole('radio', { name: '9:00 AM option selected' }),
    );
    expect(button.getAttribute('aria-label')).to.contain(', selected');

    userEvent.click(screen.getByText(/^Continue/));
    await waitFor(() => {
      expect(screen.history.push.called).to.be.true;
    });

    await cleanup();

    // Second pass make sure the slots associated with red team are displayed
    mockAppointmentSlotFetch({
      clinicId: '309',
      facilityId: '983',
      preferredDate,
      response: [
        {
          id: '309',
          type: 'slots',
          attributes: {
            start: slot309Date.format('YYYY-MM-DDTHH:mm:ssZ'),
            end: slot309Date.format('YYYY-MM-DDTHH:mm:ssZ'),
          },
        },
      ],
    });

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
    button = screen.queryByLabelText(
      new RegExp(slot309Date.format('dddd, MMMM Do'), 'i'),
    );

    if (!button) {
      userEvent.click(screen.getByText(/^Next/));
      button = await screen.findByLabelText(
        new RegExp(slot309Date.format('dddd, MMMM Do'), 'i'),
      );
    }

    await waitFor(() => {
      expect(button.disabled).to.not.be.ok;
    });

    userEvent.click(button);
    expect(
      await screen.findByRole('radio', { name: '1:00 PM option selected' }),
    ).to.be.ok;
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

    const slot308Date = moment()
      .day(9)
      .hour(9)
      .minute(0)
      .second(0);
    const preferredDate = moment();

    setDateTimeSelectMockFetches({
      slotDatesByClinicId: {
        308: [slot308Date, slot308Date, slot308Date, slot308Date, slot308Date],
      },
    });

    mockAppointmentSlotFetch({
      clinicId: '308',
      facilityId: '983',
      preferredDate,
      response: [
        {
          id: '308',
          type: 'slots',
          attributes: {
            start: slot308Date.format('YYYY-MM-DDTHH:mm:ssZ'),
            end: slot308Date.format('YYYY-MM-DDTHH:mm:ssZ'),
          },
        },
        {
          id: '308',
          type: 'slots',
          attributes: {
            start: slot308Date.format('YYYY-MM-DDTHH:mm:ssZ'),
            end: slot308Date.format('YYYY-MM-DDTHH:mm:ssZ'),
          },
        },
        {
          id: '308',
          type: 'slots',
          attributes: {
            start: slot308Date.format('YYYY-MM-DDTHH:mm:ssZ'),
            end: slot308Date.format('YYYY-MM-DDTHH:mm:ssZ'),
          },
        },
        {
          id: '308',
          type: 'slots',
          attributes: {
            start: slot308Date.format('YYYY-MM-DDTHH:mm:ssZ'),
            end: slot308Date.format('YYYY-MM-DDTHH:mm:ssZ'),
          },
        },
        {
          id: '308',
          type: 'slots',
          attributes: {
            start: slot308Date.format('YYYY-MM-DDTHH:mm:ssZ'),
            end: slot308Date.format('YYYY-MM-DDTHH:mm:ssZ'),
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
      new RegExp(slot308Date.format('dddd, MMMM Do'), 'i'),
    );

    if (!button) {
      userEvent.click(screen.getByText(/^Next/));
      button = await screen.findByLabelText(
        new RegExp(slot308Date.format('dddd, MMMM Do'), 'i'),
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
    const slot308Date = moment()
      .day(9)
      .hour(9)
      .minute(0)
      .second(0);
    const preferredDate = moment();

    setDateTimeSelectMockFetches({
      slotDatesByClinicId: {
        308: [slot308Date],
      },
    });

    mockAppointmentSlotFetch({
      clinicId: '308',
      facilityId: '983',
      preferredDate,
      response: [
        {
          id: '308',
          type: 'slots',
          attributes: {
            start: slot308Date.format('YYYY-MM-DDTHH:mm:ssZ'),
            end: slot308Date.format('YYYY-MM-DDTHH:mm:ssZ'),
          },
        },
      ],
    });

    const store = createTestStore(initialState);

    await setTypeOfCare(store, /primary care/i);
    await setVAFacility(store, '983');
    await setClinic(store, /yes/i);
    await setPreferredDate(store, preferredDate);

    const screen = renderWithStoreAndRouter(<DateTimeSelectPage />, {
      store,
    });

    await screen.findByText(
      /Please select an available date and time from the calendar below./i,
    );

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
    const preferredDate = moment().startOf('day');
    await setPreferredDate(store, preferredDate);

    // And there are slots available today and tomorrow
    const slot308Date = moment()
      .tz('America/Denver')
      .add(1, 'hour');
    const slot308TomorrowDate = moment()
      .tz('America/Denver')
      .add(1, 'day');
    setDateTimeSelectMockFetches({
      slotDatesByClinicId: {
        308: [slot308Date, slot308TomorrowDate],
      },
    });

    mockAppointmentSlotFetch({
      clinicId: '308',
      facilityId: '983',
      preferredDate,
      response: [
        {
          id: '308',
          type: 'slots',
          attributes: {
            start: slot308Date.format('YYYY-MM-DDTHH:mm:ssZ'),
            end: slot308Date.format('YYYY-MM-DDTHH:mm:ssZ'),
          },
        },
        {
          id: '308',
          type: 'slots',
          attributes: {
            start: slot308TomorrowDate.format('YYYY-MM-DDTHH:mm:ssZ'),
            end: slot308TomorrowDate.format('YYYY-MM-DDTHH:mm:ssZ'),
          },
        },
      ],
    });

    await setTypeOfCare(store, /primary care/i);
    await setVAFacility(store, '983');
    await setClinic(store, /yes/i);

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
        /If you have an urgent medical need or need care right away/i,
      ),
    ).to.exist;

    // And the time shown as earliest available is tomorrow's slot
    expect(
      screen.getByText(
        new RegExp(
          slot308TomorrowDate.tz('America/Denver').format('MMMM D, YYYY'),
        ),
      ),
    ).to.exist;
  });

  it('should show urgent care alert (no slots) message if preferred date is today', async () => {
    // Given the user has selected a clinic
    const store = createTestStore(initialState);

    // And the user has chosen today as their preferred date
    const preferredDate = moment();
    await setPreferredDate(store, preferredDate);

    // And there are no slots available
    setDateTimeSelectMockFetches({
      slotDatesByClinicId: {
        308: [],
      },
    });

    await setTypeOfCare(store, /primary care/i);
    await setVAFacility(store, '983');
    await setClinic(store, /yes/i);

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
        /If you have an urgent medical need or need care right away/i,
      ),
    ).to.exist;

    expect(
      screen.getByText(
        /We couldn’t find an appointment for your selected date/,
      ),
    ).to.be.ok;
  });

  it.skip('should show info standard of care alert when there is a wait for a mental health appointments', async () => {
    const slot308Date = moment().add(22, 'days');
    const preferredDate = moment().add(6, 'days');

    setDateTimeSelectMockFetches({
      slotDatesByClinicId: {
        308: [slot308Date],
      },
    });

    const store = createTestStore(initialState);

    await setTypeOfCare(store, /mental health/i);
    await setVAFacility(store, '983');
    await setClinic(store, /yes/i);
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

  it.skip('should show info standard of care alert when there is a wait for non mental health appointments', async () => {
    const slot308Date = moment().add(30, 'days');
    const preferredDate = moment().add(6, 'days');

    setDateTimeSelectMockFetches({
      slotDatesByClinicId: {
        308: [slot308Date],
      },
    });

    const store = createTestStore(initialState);

    await setTypeOfCare(store, /primary care/i);
    await setVAFacility(store, '983');
    await setClinic(store, /yes/i);
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
    userEvent.click(screen.getByText(/request an earlier appointment/i));

    await waitFor(() =>
      expect(screen.history.push.firstCall.args[0]).to.equal(
        '/new-appointment/request-date',
      ),
    );
  });

  it('should start calendar on preferred date month', async () => {
    // Given a user eligible for direct scheduling
    // And a preferred date and available slot several months in the future
    const slot308Date = moment()
      .add(4, 'months')
      .day(11)
      .hour(13)
      .minute(0)
      .second(0);
    const preferredDate = moment().add(4, 'months');

    setDateTimeSelectMockFetches({
      preferredDate,
      slotDatesByClinicId: {
        308: [slot308Date],
      },
    });

    mockAppointmentSlotFetch({
      clinicId: '308',
      facilityId: '983',
      preferredDate,
      response: [
        {
          id: '308',
          type: 'slots',
          attributes: {
            start: slot308Date.format('YYYY-MM-DDTHH:mm:ssZ'),
            end: slot308Date.format('YYYY-MM-DDTHH:mm:ssZ'),
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
        name: moment()
          .add(4, 'months')
          .format('MMMM YYYY'),
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

  it('should fetch slots when moving between months', async () => {
    const preferredDate = moment()
      .add(1, 'day')
      .add(1, 'month');
    const slot308Date = moment()
      .add(1, 'day')
      .add(1, 'month')
      .startOf('month')
      .day(9)
      .hour(9)
      .minute(0)
      .second(0);
    const secondSlotDate = slot308Date
      .clone()
      .add(2, 'month')
      .day(9)
      .hour(10)
      .minute(0)
      .second(0);
    setDateTimeSelectMockFetches({
      preferredDate,
      slotDatesByClinicId: {
        308: [slot308Date],
      },
    });

    mockAppointmentSlotFetch({
      facilityId: '983',
      clinicId: '308',
      response: [
        {
          id: '308',
          type: 'slots',
          attributes: {
            start: slot308Date.format('YYYY-MM-DDTHH:mm:ssZ'),
            end: slot308Date.format('YYYY-MM-DDTHH:mm:ssZ'),
          },
        },
      ],
      startDate: preferredDate.clone().startOf('month'),
      endDate: preferredDate
        .clone()
        .add('1', 'months')
        .endOf('month')
        .startOf('day'),
    });
    mockAppointmentSlotFetch({
      facilityId: '983',
      clinicId: '308',
      response: [
        {
          id: '308',
          type: 'slots',
          attributes: {
            start: secondSlotDate.format('YYYY-MM-DDTHH:mm:ssZ'),
            end: secondSlotDate.format('YYYY-MM-DDTHH:mm:ssZ'),
          },
        },
      ],
      startDate: secondSlotDate.clone().startOf('month'),
      endDate: secondSlotDate
        .clone()
        .endOf('month')
        .startOf('day'),
    });

    const store = createTestStore(initialState);

    await setTypeOfCare(store, /primary care/i);
    await setVAFacility(store, '983');
    await setClinic(store, /Yes/i);
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

    let dayOfMonthButton = screen.getByLabelText(
      new RegExp(slot308Date.format('dddd, MMMM Do'), 'i'),
    );
    userEvent.click(dayOfMonthButton);
    userEvent.click(
      await screen.findByRole('radio', { name: '9:00 AM option selected' }),
    );

    // Need to move two months to trigger second fetch
    userEvent.click(screen.getByText(/^Next/));
    userEvent.click(screen.getByText(/^Next/));
    overlay = screen.queryByTestId('loadingIndicator');
    if (overlay) {
      await waitForElementToBeRemoved(overlay);
    }

    dayOfMonthButton = await screen.findByLabelText(
      new RegExp(secondSlotDate.format('dddd, MMMM Do'), 'i'),
    );
    userEvent.click(dayOfMonthButton);

    userEvent.click(
      await screen.findByRole('radio', { name: '10:00 AM option selected' }),
    );

    // Go back and select initial slot
    userEvent.click(screen.getByText(/^Prev/));
    userEvent.click(screen.getByText(/^Prev/));

    dayOfMonthButton = screen.getByLabelText(
      new RegExp(slot308Date.format('dddd, MMMM Do'), 'i'),
    );
    userEvent.click(dayOfMonthButton);
    userEvent.click(
      await screen.findByRole('radio', { name: '9:00 AM option selected' }),
    );

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
  });
});
