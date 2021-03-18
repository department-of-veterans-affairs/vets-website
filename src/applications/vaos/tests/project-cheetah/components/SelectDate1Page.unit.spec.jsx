import React from 'react';
import MockDate from 'mockdate';
import { expect } from 'chai';
import moment from 'moment';
import { waitFor, waitForElementToBeRemoved } from '@testing-library/dom';
import { cleanup } from '@testing-library/react';
import {
  createTestStore,
  renderWithStoreAndRouter,
  setVaccineFacility,
  setVaccineClinic,
} from '../../mocks/setup';
import userEvent from '@testing-library/user-event';

import SelectDate1Page from '../../../project-cheetah/components/SelectDate1Page';
import {
  mockEligibilityFetches,
  mockAppointmentSlotFetch,
} from '../../mocks/helpers';
import { getClinicMock, getAppointmentSlotMock } from '../../mocks/v0';
import { mockFetch, resetFetch } from 'platform/testing/unit/helpers';
import { TYPE_OF_CARE_ID } from '../../../project-cheetah/utils';

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

describe('VAOS vaccine flow <SelectDate1Page>', () => {
  beforeEach(() => {
    mockFetch();
    MockDate.set(moment('2020-01-26T14:00:00'));
  });
  afterEach(() => {
    resetFetch();
    MockDate.reset();
  });
  it('should not submit form with validation error', async () => {
    mockEligibilityFetches({
      siteId: '983',
      facilityId: '983',
      typeOfCareId: TYPE_OF_CARE_ID,
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
      typeOfCareId: TYPE_OF_CARE_ID,
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
      typeOfCareId: TYPE_OF_CARE_ID,
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

    await setVaccineFacility(store, '983');
    await setVaccineClinic(store, /green team/i);

    // First pass check to make sure the slots associated with green team are displayed
    const screen = renderWithStoreAndRouter(<SelectDate1Page />, {
      store,
    });

    const overlay = screen.queryByText(/Finding appointment availability.../i);
    if (overlay) {
      await waitForElementToBeRemoved(overlay);
    }
    // it should not allow user to submit the form without selecting a date
    const button = screen.getByText(/^Continue/);
    userEvent.click(button);

    // NOTE: alert does not have an accessible name to query by
    await waitFor(() => {
      expect(screen.getByRole('alert')).to.be.ok;
    });
    expect(screen.history.push.called).to.be.false;

    // should be able to go back with validation error
    userEvent.click(screen.getByText(/Back$/));
    await waitFor(() => {
      expect(screen.history.push.called).to.be.true;
    });
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
      typeOfCareId: TYPE_OF_CARE_ID,
      clinics,
    });

    const store = createTestStore(initialState);

    await setVaccineFacility(store, '983');
    await setVaccineClinic(store, /green team/i);

    // First pass check to make sure the slots associated with green team are displayed
    const screen = renderWithStoreAndRouter(<SelectDate1Page />, {
      store,
    });

    // 1. Wait for progressbar to disappear
    const overlay = screen.queryByText(/Finding appointment availability.../i);
    if (overlay) {
      await waitForElementToBeRemoved(overlay);
    }

    expect(
      screen.getByRole('heading', {
        level: 2,
        name:
          'We’ve run into a problem when trying to find available appointment times',
      }),
    ).to.be.ok;

    // it should display link to contact the local VA medical center
    expect(
      screen.getByRole('link', {
        name: 'call your local VA medical center Link opens in a new tab.',
      }),
    ).to.be.ok;
  });

  it('should allow a user to choose available slot and fetch new slots after changing clinics', async () => {
    mockEligibilityFetches({
      siteId: '983',
      facilityId: '983',
      typeOfCareId: TYPE_OF_CARE_ID,
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
      typeOfCareId: TYPE_OF_CARE_ID,
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
      typeOfCareId: TYPE_OF_CARE_ID,
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

    await setVaccineFacility(store, '983');
    await setVaccineClinic(store, /green team/i);

    // First pass check to make sure the slots associated with green team are displayed
    let screen = renderWithStoreAndRouter(<SelectDate1Page />, {
      store,
    });

    // 1. Wait for progressbar to disappear
    let overlay = screen.queryByText(/Finding appointment availability.../i);
    if (overlay) {
      await waitForElementToBeRemoved(overlay);
    }

    expect(await screen.findByText(/Choose a date/i)).to.be.ok;

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
    await setVaccineClinic(store, /red team/i);
    screen = renderWithStoreAndRouter(<SelectDate1Page />, {
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

  it('should show validation error if no date selected', async () => {
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
    ];
    mockEligibilityFetches({
      siteId: '983',
      facilityId: '983',
      typeOfCareId: TYPE_OF_CARE_ID,
      clinics,
    });
    const slot308Date = moment();
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

    const preferredDate = moment();
    mockAppointmentSlotFetch({
      siteId: '983',
      clinicId: '308',
      typeOfCareId: TYPE_OF_CARE_ID,
      slots: slots308,
      preferredDate,
    });

    const store = createTestStore(initialState);

    await setVaccineFacility(store, '983');
    await setVaccineClinic(store, /green team/i);

    const screen = renderWithStoreAndRouter(<SelectDate1Page />, {
      store,
    });

    await screen.findByText(/When choosing a date, make sure/i);

    userEvent.click(screen.getByText(/continue/i));
    expect(await screen.findByRole('alert')).to.contain.text(
      'Please choose your preferred date and time for your appointment',
    );
    expect(screen.history.push.called).not.to.be.true;
  });

  it('should fetch slots when moving between months', async () => {
    mockEligibilityFetches({
      siteId: '983',
      facilityId: '983',
      typeOfCareId: TYPE_OF_CARE_ID,
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
    });

    const preferredDate = moment();
    const slot308Date = moment()
      .add(1, 'day')
      .hour(9)
      .minute(0)
      .second(0);
    const secondSlotDate = slot308Date
      .clone()
      .add(2, 'month')
      .hour(10)
      .minute(0)
      .second(0);

    mockAppointmentSlotFetch({
      siteId: '983',
      clinicId: '308',
      typeOfCareId: TYPE_OF_CARE_ID,
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
      clinicId: '308',
      typeOfCareId: TYPE_OF_CARE_ID,
      slots: [
        {
          ...getAppointmentSlotMock(),
          startDateTime: secondSlotDate.format('YYYY-MM-DDTHH:mm:ss[+00:00]'),
          endDateTime: secondSlotDate
            .clone()
            .minute(20)
            .format('YYYY-MM-DDTHH:mm:ss[+00:00]'),
        },
      ],
      startDate: preferredDate
        .clone()
        .add('2', 'months')
        .startOf('month'),
      endDate: preferredDate
        .clone()
        .add('2', 'months')
        .endOf('month'),
    });

    const store = createTestStore(initialState);

    await setVaccineFacility(store, '983');
    await setVaccineClinic(store, /Green team/i);

    // First pass check to make sure the slots associated with green team are displayed
    const screen = renderWithStoreAndRouter(<SelectDate1Page />, {
      store,
    });

    let overlay = screen.queryByText(/Finding appointment availability.../i);
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
    overlay = screen.queryByText(/Finding appointment availability.../i);
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
