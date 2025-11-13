import { mockFetch } from '@department-of-veterans-affairs/platform-testing/helpers';
import { waitFor, waitForElementToBeRemoved } from '@testing-library/dom';
import { cleanup } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { expect } from 'chai';
import {
  addDays,
  addMonths,
  format,
  lastDayOfMonth,
  setDay,
  startOfDay,
  startOfMonth,
} from 'date-fns';
import { formatInTimeZone } from 'date-fns-tz';
import MockDate from 'mockdate';
import React from 'react';
import {
  createTestStore,
  renderWithStoreAndRouter,
  setVaccineClinic,
  setVaccineFacility,
} from '../../tests/mocks/setup';

import MockClinicResponse from '../../tests/fixtures/MockClinicResponse';
import MockFacilityResponse from '../../tests/fixtures/MockFacilityResponse';
import MockSlotResponse from '../../tests/fixtures/MockSlotResponse';
import {
  mockAppointmentSlotApi,
  mockEligibilityFetches,
} from '../../tests/mocks/mockApis';
import { DATE_FORMATS, TYPE_OF_CARE_IDS } from '../../utils/constants';
import SelectDate1Page from './SelectDate1Page';
import { mockToday } from '../../tests/mocks/constants';

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
  const clinics = MockClinicResponse.createResponses({
    clinics: [
      { id: '308', name: 'Green team clinic' },
      { id: '309', name: 'Red team clinic' },
    ],
  });

  beforeEach(() => {
    mockFetch();
    MockDate.set(mockToday);
  });

  it('should not submit form with validation error', async () => {
    mockEligibilityFetches({
      facilityId: '983',
      typeOfCareId: TYPE_OF_CARE_IDS.COVID_VACCINE_ID,
      clinics,
    });

    const preferredDate = new Date(mockToday);

    mockAppointmentSlotApi({
      facilityId: '983',
      clinicId: '308',
      response: [],
      preferredDate,
    });

    const store = createTestStore(initialState);

    await setVaccineFacility(store, new MockFacilityResponse());
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
    const preferredDate = new Date(mockToday);
    mockEligibilityFetches({
      facilityId: '983',
      typeOfCareId: TYPE_OF_CARE_IDS.COVID_VACCINE_ID,
      clinics,
    });
    mockAppointmentSlotApi({
      clinicId: '308',
      facilityId: '983',
      preferredDate,
      responseCode: true,
    });

    const store = createTestStore(initialState);

    await setVaccineFacility(store, new MockFacilityResponse());
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
    mockEligibilityFetches({
      facilityId: '983',
      typeOfCareId: TYPE_OF_CARE_IDS.COVID_VACCINE_ID,
      clinics,
    });

    // Slot dates are in UTC
    const slot308Date = new Date(
      setDay(new Date(mockToday), 9).setHours(15, 0, 0),
    );
    const slot309Date = new Date(
      setDay(new Date(mockToday), 11).setHours(19, 0, 0),
    );
    const preferredDate = new Date(mockToday);

    mockAppointmentSlotApi({
      facilityId: '983',
      clinicId: '308',
      response: [
        {
          id: '308',
          type: 'slots',
          attributes: {
            start: format(slot308Date, DATE_FORMATS.ISODateTimeUTC),
            end: format(
              new Date(new Date(slot308Date).setMinutes(20)),
              DATE_FORMATS.ISODateTime,
            ),
          },
        },
        {
          id: '309',
          type: 'slots',
          attributes: {
            start: format(slot309Date, DATE_FORMATS.ISODateTimeUTC),
            end: format(
              new Date(new Date(slot309Date).setMinutes(20)),
              DATE_FORMATS.ISODateTime,
            ),
          },
        },
      ],
      preferredDate,
    });
    mockAppointmentSlotApi({
      facilityId: '983',
      clinicId: '309',
      response: [
        {
          id: '309',
          type: 'slots',
          attributes: {
            start: format(slot309Date, DATE_FORMATS.ISODateTimeUTC),
            end: format(
              new Date(new Date(slot309Date).setMinutes(20)),
              DATE_FORMATS.ISODateTime,
            ),
          },
        },
      ],
      preferredDate,
    });

    const store = createTestStore(initialState);

    await setVaccineFacility(store, new MockFacilityResponse());
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
      new RegExp(format(slot308Date, 'EEEE, MMMM do'), 'i'),
    );

    if (!button) {
      userEvent.click(screen.getByText(/^Next/));
      button = await screen.findByLabelText(
        new RegExp(format(slot308Date, 'EEEE, MMMM do'), 'i'),
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
      new RegExp(format(slot309Date, 'EEEE, MMMM do'), 'i'),
    );

    if (!button) {
      userEvent.click(screen.getByText(/^Next/));

      // 4a. Wait for progressbar to disappear
      overlay = screen.queryByTestId('loadingIndicator');
      if (overlay) {
        await waitForElementToBeRemoved(overlay);
      }

      button = await screen.findByLabelText(
        new RegExp(format(slot309Date, 'EEEE, MMMM do'), 'i'),
      );
    }

    userEvent.click(button);
    expect(
      await screen.findByRole('radio', { name: '1:00 PM option selected' }),
    ).to.be.ok;
  });

  it('should show validation error if no date selected', async () => {
    mockEligibilityFetches({
      facilityId: '983',
      typeOfCareId: TYPE_OF_CARE_IDS.COVID_VACCINE_ID,
      clinics,
    });

    const preferredDate = new Date(mockToday);
    mockAppointmentSlotApi({
      facilityId: '983',
      clinicId: '308',
      response: [],
      preferredDate,
    });

    const store = createTestStore(initialState);

    await setVaccineFacility(store, new MockFacilityResponse());
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
});

describe('When preferred date is immediate care', () => {
  describe('And current date is last day of the month and end of day', () => {
    beforeEach(() => {
      mockFetch();
      MockDate.set(lastDayOfMonth(new Date(mockToday)));
    });

    afterEach(() => {
      MockDate.reset();
    });

    it('should fetch slots when moving between months', async () => {
      const clinics = MockClinicResponse.createResponses({
        clinics: [
          { id: '308', name: 'Green team clinic' },
          { id: '309', name: 'Red team clinic' },
        ],
      });

      // Use the mocked current date (last day of month) instead of mockToday
      // mock date is set in the beforeEach
      const preferredDate = new Date();

      // NOTE: Available slot dates must be after tommorow. So in this case, timezone
      // conversion to MT resulted in the previous day thus the need to add 2 days.
      // See: ./new-appointments/redux/actions.js/getAppointmentsSlots:680
      const slot308Date = addDays(preferredDate, 2);

      // NOTE: The initial request for slots returns 2 months worth thus the need
      // to add 2 months.
      const secondSlotDate = lastDayOfMonth(addMonths(preferredDate, 2));

      mockAppointmentSlotApi({
        facilityId: '983',
        clinicId: '308',
        response: [
          new MockSlotResponse({
            id: '1',
            start: slot308Date,
          }),
        ],
        preferredDate,
      });
      mockAppointmentSlotApi({
        facilityId: '983',
        clinicId: '308',
        response: [
          new MockSlotResponse({
            id: '1',
            start: secondSlotDate,
          }),
        ],
        preferredDate: startOfMonth(addMonths(startOfDay(preferredDate), 2)),
        endDate: lastDayOfMonth(addMonths(startOfDay(preferredDate), 2)),
      });
      mockEligibilityFetches({
        facilityId: '983',
        typeOfCareId: TYPE_OF_CARE_IDS.COVID_VACCINE_ID,
        clinics,
      });

      const store = createTestStore(initialState);

      await setVaccineFacility(store, new MockFacilityResponse());
      await setVaccineClinic(store, /Green team/i);

      // First pass check to make sure the slots associated with green team are displayed
      const screen = renderWithStoreAndRouter(<SelectDate1Page />, {
        store,
      });

      // Need to move to the next month if today is the last day
      let overlay = screen.queryByTestId('loadingIndicator');
      if (overlay) {
        await waitForElementToBeRemoved(overlay);
      }

      let dayOfMonthButton = screen.getByLabelText(
        new RegExp(
          formatInTimeZone(slot308Date, 'America/Denver', 'EEEE, MMMM do'),
          'i',
        ),
      );
      userEvent.click(dayOfMonthButton);
      userEvent.click(
        await screen.findByRole('radio', {
          id: `dateTime_${format(slot308Date, 'yyyy-MM-dd')}_0`,
        }),
      );

      // To trigger the second fetch:
      userEvent.click(screen.getByText(/^Next/));

      overlay = screen.queryByTestId('loadingIndicator');
      if (overlay) {
        await waitForElementToBeRemoved(overlay);
      }

      dayOfMonthButton = await screen.findByLabelText(
        new RegExp(
          formatInTimeZone(secondSlotDate, 'America/Denver', 'EEEE, MMMM do'),
          'i',
        ),
      );
      userEvent.click(dayOfMonthButton);

      // Select the slot
      userEvent.click(
        await screen.findByRole('radio', {
          id: `dateTime_${formatInTimeZone(
            secondSlotDate,
            'America/Denver',
            'yyyy-MM-dd',
          )}_0`,
        }),
      );

      // To go back and select initial slot:
      userEvent.click(screen.getByText(/^Prev/));

      dayOfMonthButton = screen.getByLabelText(
        new RegExp(
          formatInTimeZone(slot308Date, 'America/Denver', 'EEEE, MMMM do'),
          'i',
        ),
      );
      userEvent.click(dayOfMonthButton);

      // Select the slot
      userEvent.click(
        await screen.findByRole('radio', {
          id: `dateTime_${formatInTimeZone(
            slot308Date,
            'America/Denver',
            'yyyy-MM-dd',
          )}_0`,
        }),
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
});
