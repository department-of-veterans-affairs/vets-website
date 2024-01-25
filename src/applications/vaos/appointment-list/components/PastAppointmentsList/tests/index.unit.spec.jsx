import React from 'react';
import MockDate from 'mockdate';
import { expect } from 'chai';
import moment from 'moment';

import { mockFetch } from '@department-of-veterans-affairs/platform-testing/helpers';
import userEvent from '@testing-library/user-event';
import { mockVAOSAppointmentsFetch } from '../../../../tests/mocks/helpers.v2';
import PastAppointmentsList from '..';
import {
  renderWithStoreAndRouter,
  getTestDate,
} from '../../../../tests/mocks/setup';
import { getVAOSAppointmentMock } from '../../../../tests/mocks/v2';
import { mockFacilitiesFetchByVersion } from '../../../../tests/mocks/fetch';

const initialState = {
  featureToggles: {
    vaOnlineSchedulingCancel: true,
    vaOnlineSchedulingPast: true,
    vaOnlineSchedulingVAOSServiceVAAppointments: true,
    vaOnlineSchedulingVAOSServiceCCAppointments: true,
    vaOnlineSchedulingStatusImprovement: true,
    vaOnlineSchedulingBreadcrumbUrlUpdate: true,
  },
};

const testDates = () => {
  const now = moment().startOf('day');
  const start = moment(now).subtract(3, 'months');
  const end = moment(now)
    .minutes(0)
    .add(30, 'minutes');

  return {
    now,
    start,
    end,
  };
};
const yesterday = moment(testDates().now)
  .utc()
  .subtract(1, 'day');

const appointment = getVAOSAppointmentMock();
appointment.id = '123';
appointment.attributes = {
  ...appointment.attributes,
  minutesDuration: 30,
  status: 'booked',
  localStartTime: yesterday.format('YYYY-MM-DDTHH:mm:ss.000ZZ'),
  start: yesterday.format(),
  locationId: '983',
  location: {
    id: '983',
    type: 'appointments',
    attributes: {
      id: '983',
      vistaSite: '983',
      name: 'Cheyenne VA Medical Center',
      lat: 39.744507,
      long: -104.830956,
      phone: { main: '307-778-7550' },
      physicalAddress: {
        line: ['2360 East Pershing Boulevard'],
        city: 'Cheyenne',
        state: 'WY',
        postalCode: '82001-5356',
      },
    },
  },
};

describe('PastAppointmentList component', () => {
  beforeEach(() => {
    mockFetch();
    MockDate.set(getTestDate());
    mockFacilitiesFetchByVersion({ version: 0 });
  });

  afterEach(() => {
    MockDate.reset();
  });
  it('should show focus on dropdown at initial render', async () => {
    mockVAOSAppointmentsFetch({
      start: testDates().start.format('YYYY-MM-DD'),
      end: testDates().end.format('YYYY-MM-DD'),
      requests: [appointment],
      statuses: ['booked', 'arrived', 'fulfilled', 'cancelled'],
    });

    const screen = renderWithStoreAndRouter(
      <PastAppointmentsList hasTypeChanged />,
      {
        initialState,
      },
    );
    await screen.findAllByLabelText(
      new RegExp(yesterday.format('dddd, MMMM D'), 'i'),
    );
    expect(screen.getByText(/appointments in/i));

    expect(document.activeElement.id).to.equal('date-dropdown');
    const selectDate = screen.getByTestId('vaosSelect');
    expect(selectDate.value).to.equal('0');
  });

  it('should show show focus on h3 when new date range is selected', async () => {
    mockVAOSAppointmentsFetch({
      start: testDates().start.format('YYYY-MM-DD'),
      end: testDates().end.format('YYYY-MM-DD'),
      requests: [appointment],
      statuses: ['booked', 'arrived', 'fulfilled', 'cancelled'],
    });

    const screen = renderWithStoreAndRouter(
      <PastAppointmentsList hasTypeChanged />,
      {
        initialState,
      },
    );
    await screen.findAllByLabelText(
      new RegExp(yesterday.format('dddd, MMMM D'), 'i'),
    );
    expect(screen.getByText(/appointments in/i));
    expect(document.activeElement.id).to.equal('date-dropdown');
    const selectDate = screen.getByTestId('vaosSelect');
    // select a new range for all of current year
    userEvent.selectOptions(selectDate, ['4']);
    // this is failing -  expected to have value 4 but actual is 0
    expect(selectDate).to.have.value('4');
    // this is failing
    expect(document.activeElement.id).to.equal('h3');
  });
});
