import userEvent from '@testing-library/user-event';
import { expect } from 'chai';
import MockDate from 'mockdate';
import React from 'react';

import { mockFetch } from '@department-of-veterans-affairs/platform-testing/helpers';
import { waitFor, within } from '@testing-library/dom';
import {
  addDays,
  addMonths,
  format,
  isMonday,
  nextMonday,
  setDate,
} from 'date-fns';
import { Route } from 'react-router-dom';
import DateTimeRequestPage from '.';
import MockFacilityResponse from '../../../tests/fixtures/MockFacilityResponse';
import MockSchedulingConfigurationResponse, {
  MockServiceConfiguration,
} from '../../../tests/fixtures/MockSchedulingConfigurationResponse';
import {
  mockFacilitiesApi,
  mockSchedulingConfigurationsApi,
} from '../../../tests/mocks/mockApis';
import {
  createTestStore,
  renderWithStoreAndRouter,
  setCommunityCareFlow,
} from '../../../tests/mocks/setup';
import { FETCH_STATUS } from '../../../utils/constants';

async function chooseMorningRequestSlot(screen) {
  const currentMonth = format(addDays(new Date(), 5), 'MMMM');

  userEvent.click(
    screen
      .getAllByLabelText(new RegExp(currentMonth))
      .find(button => button.disabled === false),
  );

  userEvent.click(
    screen.getByRole('checkbox', {
      name: 'A.M. appointment',
    }),
  );
}

describe('VAOS Page: DateTimeRequestPage', () => {
  beforeEach(() => {
    mockFetch();
    MockDate.set(new Date('2020-01-26T14:00:00'));
  });
  afterEach(() => {
    MockDate.reset();
  });
  it('should allow user to request date and time for a community care appointment', async () => {
    const store = createTestStore({
      newAppointment: {
        data: {},
        pages: [],
        eligibility: [],
        appointmentSlotsStatus: FETCH_STATUS.succeeded,
        previousPages: [],
      },
    });

    const screen = renderWithStoreAndRouter(
      <Route component={DateTimeRequestPage} />,
      {
        store,
      },
    );

    // it should display page heading
    expect(
      await screen.findByRole('heading', {
        level: 1,
        name: /Choose an appointment day and time/i,
      }),
    ).to.be.ok;

    expect(
      screen.getByRole('heading', {
        level: 2,
        name: format(addDays(new Date(), 5), 'MMMM yyyy'),
      }),
    ).to.be.ok;

    const dayHeaders = screen
      .getAllByRole('columnheader')
      .map(el => el.querySelector('.sr-only').textContent);
    expect(dayHeaders).to.deep.equal([
      'Monday',
      'Tuesday',
      'Wednesday',
      'Thursday',
      'Friday',
    ]);

    // Find all available appointments for the current month
    let currentMonth = format(addDays(new Date(), 5), 'MMMM');

    let buttons = screen
      .getAllByLabelText(new RegExp(currentMonth))
      .filter(button => button.disabled === false);

    // Towards the end of the month our 4 days out min date will be in the next
    // month, and we need to move the calendar to the next month before selecting a date
    if (!buttons.length) {
      userEvent.click(screen.getByText('Next'));
      await screen.findByRole('heading', {
        name: format(addMonths(1, 'month'), 'MMMM yyyy'),
      });
      currentMonth = format(addMonths(1, 'month'), 'MMMM');

      buttons = screen
        .getAllByLabelText(new RegExp(currentMonth))
        .filter(button => button.disabled === false);
    }

    // Get the first day in the second week of the month, which
    // should always be a Monday
    let mondayInMonth = within(screen.getAllByRole('rowgroup')[2]);
    mondayInMonth = within(mondayInMonth.getAllByRole('row')[2]);
    mondayInMonth = within(mondayInMonth.getAllByRole('cell')[0]);
    mondayInMonth = mondayInMonth.queryAllByRole('button')[0].textContent;

    // Verify the first button in the second week is actually a Monday
    expect(isMonday(setDate(new Date(), mondayInMonth))).to.be.true;

    // it should allow the user to select morning for currently selected date
    userEvent.click(buttons[0]);

    // 2. Simulate user selecting a time
    let checkbox = screen.getByRole('checkbox', {
      name: 'A.M. appointment',
    });
    userEvent.click(checkbox);
    expect(buttons[0].getAttribute('aria-label')).to.contain('AM selected');

    // 3. Simulate user selecting another time
    checkbox = screen.getByRole('checkbox', {
      name: 'P.M. appointment',
    });
    userEvent.click(checkbox);

    expect(buttons[0]).to.contain.text('AM');
    expect(buttons[0]).to.contain.text('PM');
    expect(buttons[0].getAttribute('aria-label')).to.contain(
      'AM and PM selected',
    );
    // checks that the selected day matches the button used
    expect(
      screen.baseElement.querySelector('.vaos-calendar__day--selected'),
    ).to.contain.text(buttons[0].textContent);

    // 4. it should allow the user to submit the form
    let button = screen.getByText(/^Continue/);
    userEvent.click(button);
    await waitFor(() => {
      expect(screen.history.push.called).to.be.true;
    });

    // NOTE: Reset the spy!!!
    screen.history.push.reset();

    // 5. it should allow the user to go to the previous page
    button = screen.getByText(/^Back/);
    userEvent.click(button);
    await waitFor(() => {
      expect(screen.history.push.called).to.be.true;
    });
  });

  it('should allow the user to view different calendar months', async () => {
    const store = createTestStore({
      newAppointment: {
        data: {},
        pages: [],
        eligibility: [],
        appointmentSlotsStatus: FETCH_STATUS.succeeded,
        previousPages: [],
      },
    });

    const screen = renderWithStoreAndRouter(
      <Route component={DateTimeRequestPage} />,
      {
        store,
      },
    );

    // it should not allow the user to view the previous month if viewing the current month
    let button = await screen.findByText('Previous');
    userEvent.click(button);
    await waitFor(() => {
      expect(screen.history.push.called).to.be.false;
    });

    button = screen.getByText('Next');
    userEvent.click(button);
    expect(
      screen.getByRole('heading', {
        level: 2,
        name: format(addMonths(new Date(), 1), 'MMMM yyyy'),
      }),
    ).to.be.ok;

    button = screen.getByText('Previous');
    userEvent.click(button);
    expect(
      screen.getByRole('heading', {
        level: 2,
        name: format(new Date(), 'MMMM yyyy'),
      }),
    ).to.be.ok;
  });

  it('should display an alert when user selects more than 3 dates', async () => {
    const store = createTestStore({
      newAppointment: {
        data: {},
        pages: [],
        eligibility: [],
        appointmentSlotsStatus: FETCH_STATUS.succeeded,
        previousPages: [],
      },
    });

    const screen = renderWithStoreAndRouter(
      <Route component={DateTimeRequestPage} />,
      {
        store,
      },
    );

    // Find all available appointments for the current month
    const currentMonth = format(addDays(new Date(), 5), 'MMMM');
    let buttons = screen
      .getAllByLabelText(new RegExp(currentMonth))
      .filter(button => button.disabled === false);

    if (buttons.length < 4) {
      userEvent.click(screen.getByText(/^Next/));
      const nextMonth = addMonths(addDays(new Date(), 5), 1);
      await screen.findByRole('heading', {
        name: format(nextMonth, 'MMMM yyyy'),
      });
      buttons = screen
        .getAllByLabelText(new RegExp(format(nextMonth, 'MMMM')))
        .filter(button => button.disabled === false);
    }

    // it should display an alert when the users selects more than the allowed dates
    // 1. Simulate user selecting a date
    userEvent.click(buttons[0]);

    // 2. Simulate user selecting AM
    let checkbox = await screen.findByLabelText(/^A\.M\./i);
    userEvent.click(checkbox);

    // 3. Simulate user selecting another date
    userEvent.click(buttons[1]);

    // 3. Simulate user selecting PM
    checkbox = await screen.findByLabelText(/^P\.M\./i);
    userEvent.click(checkbox);

    // 4. Simulate user selecting another date
    userEvent.click(buttons[2]);

    // 5. Simulate user selecting AM
    checkbox = await screen.findByLabelText(/^A\.M\./i);
    userEvent.click(checkbox);

    // 6. Simulate user selecting another date
    userEvent.click(buttons[3]);

    // 7. Simulate user selecting PM which should result in error
    checkbox = await screen.findByLabelText(/^P\.M\./i);
    userEvent.click(checkbox);

    // 8 Simulate user submit the form
    const button = screen.getByText(/^Continue/);
    userEvent.click(button);

    // NOTE: alert doesn't have a name so search for text too
    expect(await screen.findByRole('alert')).to.be.ok;
    expect(screen.getByText(/You can only choose up to 3 dates/i)).to.be.ok;

    // alert goes away after unselecting
    userEvent.click(checkbox);
    await waitFor(() => expect(checkbox.checked).to.be.false);
    await waitFor(() => expect(screen.queryByRole('alert')).not.to.exist);
  });

  it('should display an alert when user selects 2 dates and multiple times', async () => {
    const store = createTestStore({
      newAppointment: {
        data: {},
        pages: [],
        eligibility: [],
        appointmentSlotsStatus: FETCH_STATUS.succeeded,
      },
    });

    const screen = renderWithStoreAndRouter(
      <Route component={DateTimeRequestPage} />,
      {
        store,
      },
    );

    // Find all available appointments for the current month
    const currentMonth = format(addDays(new Date(), 5), 'MMMM');
    let buttons = screen
      .getAllByLabelText(new RegExp(currentMonth))
      .filter(button => button.disabled === false);

    if (buttons.length < 2) {
      userEvent.click(screen.getByText(/^Next/));
      const nextMonth = addMonths(addDays(new Date(), 5), 1);
      await screen.findByRole('heading', {
        name: format(nextMonth, 'MMMM yyyy'),
      });
      buttons = screen
        .getAllByLabelText(new RegExp(format(nextMonth, 'MMMM')))
        .filter(button => button.disabled === false);
    }

    // it should display an alert when the users selects more than the allowed dates
    // 1. Simulate user selecting a date
    userEvent.click(buttons[0]);

    // 2. Simulate user selecting AM
    let checkbox = screen.getByRole('checkbox', {
      name: 'A.M. appointment',
    });
    userEvent.click(checkbox);

    // 3. Simulate user selecting PM
    checkbox = screen.getByRole('checkbox', {
      name: 'P.M. appointment',
    });
    userEvent.click(checkbox);

    // 4. Simulate user selecting another date
    userEvent.click(buttons[1]);

    // 5. Simulate user selecting AM
    checkbox = screen.getByRole('checkbox', {
      name: 'A.M. appointment',
    });
    userEvent.click(checkbox);

    // 6. Simulate user selecting PM which should result in error
    checkbox = await screen.findByRole('checkbox', {
      name: 'P.M. appointment',
    });
    userEvent.click(checkbox);

    // 7. it should not allow the user to submit the form
    const button = screen.getByText(/^Continue/);
    userEvent.click(button);
    await waitFor(() => {
      expect(screen.history.push.called).to.be.false;
    });

    // NOTE: alert doesn't have a name so search for text too
    expect(screen.getByRole('alert')).to.be.ok;
    expect(screen.getByText(/You can only choose up to 3 dates./i)).to.be.ok;
  });

  it('should display an alert when user submits the form with no dates selected', async () => {
    const store = createTestStore({
      newAppointment: {
        data: {},
        pages: [],
        eligibility: [],
        appointmentSlotsStatus: FETCH_STATUS.succeeded,
        previousPages: [],
      },
    });

    const screen = renderWithStoreAndRouter(
      <Route component={DateTimeRequestPage} />,
      {
        store,
      },
    );

    // it should display an alert when users tries to submit the form
    let button = await screen.findByText(/^Continue/);
    userEvent.click(button);

    // NOTE: alert doesn't have a name so search for text too
    expect(screen.getByRole('alert')).to.be.ok;
    expect(
      screen.getByText(
        'Please select at least one preferred date for your appointment. You can select up to three dates.',
      ),
    ).to.be.ok;

    // 1 it should not allow user to submit the form
    button = screen.getByText(/^Continue/);
    userEvent.click(button);
    await waitFor(() => {
      expect(screen.history.push.called).to.be.false;
    });
  });

  it('should not allow selections after max date', async () => {
    const store = createTestStore({
      newAppointment: {
        data: {},
        pages: [],
        eligibility: [],
        appointmentSlotsStatus: FETCH_STATUS.succeeded,
        previousPages: [],
      },
    });

    const screen = renderWithStoreAndRouter(
      <Route component={DateTimeRequestPage} />,
      {
        store,
      },
    );

    // first monday after the max
    const datePastMax = nextMonday(addDays(new Date(), 121));
    const endMonth = format(datePastMax, 'MMMM yyyy');
    let monthHeader = screen.queryByText(endMonth);
    await screen.findByText(/next/i);
    // Doing the normal byText query doesn't grab the button element
    // and doing getAllByRole for buttons with a particular title is slow
    // because of how many buttons there are on the page
    const nextButton = screen
      .getAllByRole('button')
      .find(el => el.textContent.includes('Next'));

    while (!monthHeader && !nextButton.disabled) {
      userEvent.click(nextButton);
      monthHeader = screen.queryByText(endMonth);
    }

    if (monthHeader) {
      // if the max date is within a month we can get to, then make sure the
      // date is disabled
      const dateButton = screen.queryByText(format(datePastMax, 'd'));
      expect(dateButton.disabled).to.be.true;
    } else {
      // if the max date is in a month we can't get to, make sure next button is disabled
      expect(nextButton.disabled).to.be.true;
    }
  });

  describe('community care iterations flag is turned on', () => {
    beforeEach(() => {
      mockFacilitiesApi({
        children: true,
        ids: ['983', '984'],
        response: MockFacilityResponse.createResponses({
          facilityIds: ['983', '984'],
        }),
      });
      mockSchedulingConfigurationsApi({
        isCCEnabled: true,
        response: [
          new MockSchedulingConfigurationResponse({
            facilityId: '983',
            services: [
              new MockServiceConfiguration({
                typeOfCareId: 'primaryCare',
                requestEnabled: true,
              }),
            ],
          }),
          new MockSchedulingConfigurationResponse({
            facilityId: '984',
            services: [
              new MockServiceConfiguration({
                typeOfCareId: 'primaryCare',
                requestEnabled: true,
              }),
            ],
          }),
        ],
      });
    });
    it('should continue to closest city page', async () => {
      // Given the user has two or more supported parent sites
      // And the user is in the community care flow
      const store = await setCommunityCareFlow({
        registeredSites: ['983', '984'],
        parentSites: [{ id: '983' }, { id: '983GC' }],
        supportedSites: ['983', '983GC'],
      });

      // And the page has loaded
      const screen = renderWithStoreAndRouter(<DateTimeRequestPage />, {
        store,
      });

      expect(
        await screen.findByRole('heading', {
          level: 1,
          name: /Choose an appointment day and time/i,
        }),
      ).to.be.ok;

      // And the user has chosen a time slot
      await chooseMorningRequestSlot(screen);

      // When the user continues
      userEvent.click(screen.getByText(/^Continue/));

      // Then they're sent to the closest city selection page
      await waitFor(() => {
        expect(screen.history.push.lastCall.args[0]).to.equal('closest-city');
      });
    });

    it('should skip closest city page for single site', async () => {
      // Given the user has one supported parent site
      // And the user is in the community care flow
      const store = await setCommunityCareFlow({
        registeredSites: ['983'],
        parentSites: [{ id: '983' }, { id: '983GC' }],
        supportedSites: ['983'],
      });

      // And the page has loaded
      const screen = renderWithStoreAndRouter(<DateTimeRequestPage />, {
        store,
      });

      expect(
        await screen.findByRole('heading', {
          level: 1,
          name: /Choose an appointment day and time/i,
        }),
      ).to.be.ok;

      // And the user has chosen a time slot
      await chooseMorningRequestSlot(screen);

      // When the user continues
      userEvent.click(screen.getByText(/^Continue/));

      // Then they're sent to the preferences page
      await waitFor(() => {
        expect(screen.history.push.lastCall.args[0]).to.equal(
          'preferred-provider',
        );
      });
    });
  });
});
