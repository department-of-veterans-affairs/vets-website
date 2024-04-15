import React from 'react';
import { expect } from 'chai';
import moment from 'moment';
import { waitFor, waitForElementToBeRemoved } from '@testing-library/dom';
import { cleanup } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { mockFetch } from '@department-of-veterans-affairs/platform-testing/helpers';
import {
  createTestStore,
  renderWithStoreAndRouter,
  setVaccineFacility,
  setVaccineClinic,
} from '../../mocks/setup';

import SelectDate1Page from '../../../covid-19-vaccine/components/SelectDate1Page';
import { getAppointmentSlotMock } from '../../mocks/v0';
import { TYPE_OF_CARE_ID } from '../../../covid-19-vaccine/utils';
import { mockEligibilityFetchesByVersion } from '../../mocks/fetch';
import { createMockClinicByVersion } from '../../mocks/data';
import { mockAppointmentSlotFetch } from '../../mocks/helpers.v2';

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

describe('VAOS vaccine flow: SelectDate1Page', () => {
  const clinic1 = createMockClinicByVersion({
    id: '308',
    stationId: '983',
    friendlyName: 'Green team clinic',
  });
  const clinic2 = createMockClinicByVersion({
    id: '309',
    stationId: '983',
    friendlyName: 'Red team clinic',
  });
  const clinics = [clinic1, clinic2];

  beforeEach(() => {
    mockFetch();
  });

  it('should not submit form with validation error', async () => {
    mockEligibilityFetchesByVersion({
      facilityId: '983',
      typeOfCareId: TYPE_OF_CARE_ID,
      clinics,
    });

    const preferredDate = moment();

    mockAppointmentSlotFetch({
      facilityId: '983',
      clinicId: '308',
      response: [],
      preferredDate,
    });

    const store = createTestStore(initialState);

    await setVaccineFacility(store, '983');
    await setVaccineClinic(store, /green team/i);

    // First pass check to make sure the slots associated with green team are displayed
    const screen = renderWithStoreAndRouter(<SelectDate1Page />, {
      store,
    });

    const overlay = screen.queryByTestId('loadingIndicator');
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
    const preferredDate = moment();
    mockEligibilityFetchesByVersion({
      facilityId: '983',
      typeOfCareId: TYPE_OF_CARE_ID,
      clinics,
    });
    mockAppointmentSlotFetch({
      clinicId: '308',
      facilityId: '983',
      preferredDate,
      withError: true,
    });

    const store = createTestStore(initialState);

    await setVaccineFacility(store, '983');
    await setVaccineClinic(store, /green team/i);

    // First pass check to make sure the slots associated with green team are displayed
    const screen = renderWithStoreAndRouter(<SelectDate1Page />, {
      store,
    });

    // 1. Wait for progressbar to disappear
    const overlay = screen.queryByTestId('loadingIndicator');
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
    mockEligibilityFetchesByVersion({
      facilityId: '983',
      typeOfCareId: TYPE_OF_CARE_ID,
      clinics,
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
      facilityId: '983',
      clinicId: '308',
      response: [
        {
          id: '308',
          type: 'slots',
          attributes: {
            start: slot308Date.format('YYYY-MM-DDTHH:mm:ssZ'),
            end: slot308Date
              .clone()
              .minute(20)
              .format('YYYY-MM-DDTHH:mm:ssZ'),
          },
        },
        {
          id: '309',
          type: 'slots',
          attributes: {
            start: slot309Date.format('YYYY-MM-DDTHH:mm:ssZ'),
            end: slot309Date
              .clone()
              .minute(20)
              .format('YYYY-MM-DDTHH:mm:ssZ'),
          },
        },
      ],
      preferredDate,
    });
    mockAppointmentSlotFetch({
      facilityId: '983',
      clinicId: '309',
      response: [
        {
          id: '309',
          type: 'slots',
          attributes: {
            start: slot309Date.format('YYYY-MM-DDTHH:mm:ssZ'),
            end: slot309Date
              .clone()
              .minute(20)
              .format('YYYY-MM-DDTHH:mm:ssZ'),
          },
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
    let overlay = screen.queryByTestId('loadingIndicator');
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

      // 4a. Wait for progressbar to disappear
      overlay = screen.queryByTestId('loadingIndicator');
      if (overlay) {
        await waitForElementToBeRemoved(overlay);
      }

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
    mockEligibilityFetchesByVersion({
      facilityId: '983',
      typeOfCareId: TYPE_OF_CARE_ID,
      clinics,
    });

    const preferredDate = moment();
    mockAppointmentSlotFetch({
      facilityId: '983',
      clinicId: '308',
      response: [],
      preferredDate,
    });

    const store = createTestStore(initialState);

    await setVaccineFacility(store, '983');
    await setVaccineClinic(store, /green team/i);

    const screen = renderWithStoreAndRouter(<SelectDate1Page />, {
      store,
    });

    await screen.findByText(/Appointment times are in/i);
    await screen.findByText(
      /Note: If your vaccine requires 2 doses, you’ll need to come back for your second dose 3 to 4 weeks after the date you select/i,
    );

    userEvent.click(screen.getByText(/continue/i));
    expect(await screen.findByRole('alert')).to.contain.text(
      'Please choose your preferred date and time for your appointment',
    );
    expect(screen.history.push.called).not.to.be.true;
  });

  it.skip('should fetch slots when moving between months', async () => {
    mockEligibilityFetchesByVersion({
      facilityId: '983',
      typeOfCareId: TYPE_OF_CARE_ID,
      clinics,
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
      facilityId: '983',
      clinicId: '308',
      response: [
        {
          ...getAppointmentSlotMock(),
          startDateTime: slot308Date.format('YYYY-MM-DDTHH:mm:ss[+00:00]'),
          endDateTime: slot308Date
            .clone()
            .minute(20)
            .format('YYYY-MM-DDTHH:mm:ss[+00:00]'),
        },
        {
          id: '308',
          type: 'slots',
          attributes: {
            start: slot308Date.format('YYYY-MM-DDTHH:mm:ssZ'),
            end: slot308Date
              .clone()
              .minute(20)
              .format('YYYY-MM-DDTHH:mm:ssZ'),
          },
        },
      ],
      preferredDate,
    });
    mockAppointmentSlotFetch({
      facilityId: '983',
      clinicId: '308',
      response: [
        {
          ...getAppointmentSlotMock(),
          startDateTime: secondSlotDate.format('YYYY-MM-DDTHH:mm:ss[+00:00]'),
          endDateTime: secondSlotDate
            .clone()
            .minute(20)
            .format('YYYY-MM-DDTHH:mm:ss[+00:00]'),
        },
        {
          id: '308',
          type: 'slots',
          attributes: {
            start: secondSlotDate.format('YYYY-MM-DDTHH:mm:ssZ'),
            end: secondSlotDate
              .clone()
              .minute(20)
              .format('YYYY-MM-DDTHH:mm:ssZ'),
          },
        },
      ],
      startDate: preferredDate
        .clone()
        .add('2', 'months')
        .startOf('month'),
      endDate: preferredDate
        .clone()
        .add('2', 'months')
        .endOf('month')
        .startOf('day'),
    });

    const store = createTestStore(initialState);

    await setVaccineFacility(store, '983');
    await setVaccineClinic(store, /Green team/i);

    // First pass check to make sure the slots associated with green team are displayed
    const screen = renderWithStoreAndRouter(<SelectDate1Page />, {
      store,
    });

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
