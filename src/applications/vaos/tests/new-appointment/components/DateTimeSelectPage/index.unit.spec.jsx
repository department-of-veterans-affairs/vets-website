import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';
import moment from 'moment';
import { Route } from 'react-router-dom';
import { waitFor, waitForElementToBeRemoved } from '@testing-library/dom';
import { cleanup } from '@testing-library/react';
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
import {
  mockEligibilityFetches,
  mockAppointmentSlotFetch,
} from '../../../mocks/helpers';
import { getClinicMock, getAppointmentSlotMock } from '../../../mocks/v0';
import { mockFetch, resetFetch } from 'platform/testing/unit/helpers';

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

describe('VAOS <DateTimeSelectPage>', () => {
  beforeEach(() => mockFetch());
  afterEach(() => resetFetch());
  it('should not submit form with validation error', async () => {
    const store = createTestStore({
      newAppointment: {
        data: {
          vaFacility: '983GB',
          clinicId: '308',
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
    const button = screen.getByText(/^Continue/);
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
          vaFacility: '983GB',
          clinicId: '308',
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

  it('should display error message if slots call fails', async () => {
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
    const overlay = screen.queryByText(/Finding appointment availability.../i);
    if (overlay) {
      await waitForElementToBeRemoved(overlay);
    }

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

  it('should allow a user to choose available slot and fetch new slots after changing clinics', async () => {
    mockEligibilityFetches({
      siteId: '983',
      facilityId: '983',
      typeOfCareId: '323',
      limit: true,
      requestPastVisits: true,
      directPastVisits: true,
      clinics: [
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
      ],
      pastClinics: true,
    });

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
      siteId: '983',
      clinicId: '308',
      typeOfCareId: '323',
      slots: [
        {
          ...getAppointmentSlotMock(),
          startDateTime: slot308Date.format('YYYY-MM-DDTHH:mm:ss[+00:00]'),
          endDateTime: slot308Date
            .clone()
            .minute(20)
            .format('YYYY-MM-DDTHH:mm:ss[+00:00]'),
        },
      ],
      preferredDate,
    });
    mockAppointmentSlotFetch({
      siteId: '983',
      clinicId: '309',
      typeOfCareId: '323',
      slots: [
        {
          ...getAppointmentSlotMock(),
          startDateTime: slot309Date.format('YYYY-MM-DDTHH:mm:ss[+00:00]'),
          endDateTime: slot309Date
            .clone()
            .minute(20)
            .format('YYYY-MM-DDTHH:mm:ss[+00:00]'),
        },
      ],
      preferredDate,
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
    let overlay = screen.queryByText(/Finding appointment availability.../i);
    if (overlay) {
      await waitForElementToBeRemoved(overlay);
    }

    expect(screen.findByText('Your earliest appointment time')).to.be.ok;

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

    userEvent.click(screen.getByText(/^Continue/));
    await waitFor(() => {
      expect(screen.history.push.called).to.be.true;
    });

    await cleanup();

    // Second pass make sure the slots associated with red team are displayed
    await setClinic(store, /red team/i);
    screen = renderWithStoreAndRouter(<DateTimeSelectPage />, {
      store,
    });

    // 3. Wait for progressbar to disappear
    overlay = screen.queryByText(/Finding appointment availability.../i);
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

    mockEligibilityFetches({
      siteId: '983',
      facilityId: '983',
      typeOfCareId: '323',
      limit: true,
      requestPastVisits: true,
      directPastVisits: true,
      clinics: [
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
      ],
      pastClinics: true,
    });

    const slot308Date = moment()
      .day(9)
      .hour(9)
      .minute(0)
      .second(0);
    const preferredDate = moment();

    const slot = {
      ...getAppointmentSlotMock(),
      startDateTime: slot308Date.format('YYYY-MM-DDTHH:mm:ss[+00:00]'),
      endDateTime: slot308Date
        .clone()
        .minute(20)
        .format('YYYY-MM-DDTHH:mm:ss[+00:00]'),
    };
    mockAppointmentSlotFetch({
      siteId: '983',
      clinicId: '308',
      typeOfCareId: '323',
      // Doesn't matter for this test that they're all the same time
      slots: [slot, slot, slot, slot, slot],
      preferredDate,
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
    const overlay = screen.queryByText(/Finding appointment availability.../i);
    if (overlay) {
      await waitForElementToBeRemoved(overlay);
    }

    expect(screen.findByText('Your earliest appointment time')).to.be.ok;

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
});
