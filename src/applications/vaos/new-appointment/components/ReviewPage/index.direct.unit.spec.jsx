import { waitFor, within } from '@testing-library/dom';
import userEvent from '@testing-library/user-event';
import { expect } from 'chai';
import React from 'react';
import { Route } from 'react-router-dom';

import {
  mockFetch,
  setFetchJSONFailure,
} from '@department-of-veterans-affairs/platform-testing/helpers';
import environment from '@department-of-veterans-affairs/platform-utilities/environment';

import { addMinutes } from 'date-fns';
import { formatInTimeZone } from 'date-fns-tz';
import {
  createTestStore,
  renderWithStoreAndRouter,
} from '../../../tests/mocks/setup';

import ReviewPage from '.';
import MockAppointmentResponse from '../../../tests/fixtures/MockAppointmentResponse';
import MockFacilityResponse from '../../../tests/fixtures/MockFacilityResponse';
import {
  mockAppointmentSubmitApi,
  mockFacilityApi,
} from '../../../tests/mocks/mockApis';
import { DATE_FORMATS, TYPE_OF_CARE_IDS } from '../../../utils/constants';
import { onCalendarChange, startDirectScheduleFlow } from '../../redux/actions';

const initialState = {
  featureToggles: {
    vaOnlineSchedulingCancel: true,
  },
};

describe('VAOS Page: ReviewPage direct scheduling', () => {
  let store;
  let start;

  beforeEach(() => {
    mockFetch();
    mockFacilityApi({
      id: '983',
    });
    start = new Date();
    store = createTestStore({
      ...initialState,
      newAppointment: {
        pages: {},
        data: {
          typeOfCareId: TYPE_OF_CARE_IDS.PRIMARY_CARE,
          phoneNumber: '2234567890',
          email: 'joeblow@gmail.com',
          reasonForAppointment: 'routine-follow-up',
          reasonAdditionalInfo: 'I need an appt',
          vaParent: '983',
          vaFacility: '983',
          clinicId: '983_455',
          preferredDate: '2021-05-06',
        },
        facilityDetails: {
          983: {
            id: '983',
            name: 'Cheyenne VA Medical Center',
            address: {
              postalCode: '82001-5356',
              city: 'Cheyenne',
              state: 'WY',
              line: ['2360 East Pershing Boulevard'],
            },
          },
        },
        facilities: {
          323: [
            {
              id: '983',
              name: 'Cheyenne VA Medical Center',
              identifier: [
                { system: 'urn:oid:2.16.840.1.113883.6.233', value: '983' },
              ],
              address: {
                postalCode: '82001-5356',
                city: 'Cheyenne',
                state: 'WY',
                line: ['2360 East Pershing Boulevard'],
              },
              telecom: [{ system: 'phone', value: '307-778-7550' }],
            },
          ],
        },
        availableSlots: [
          {
            id: 'slot-id',
            start: formatInTimeZone(start, 'UTC', DATE_FORMATS.ISODateTimeUTC),
            end: formatInTimeZone(
              addMinutes(start, 30),
              'UTC',
              DATE_FORMATS.ISODateTimeUTC,
            ),
          },
        ],
        clinics: {
          '983_323': [
            {
              id: '983_455',
              serviceName: 'Some VA clinic',
              stationId: '983',
              stationName: 'Cheyenne VA Medical Center',
            },
          ],
        },
      },
    });
    store.dispatch(startDirectScheduleFlow());
  });

  it('should show form information for review', async () => {
    store.dispatch(
      onCalendarChange([
        formatInTimeZone(
          start,
          'America/Denver',
          DATE_FORMATS.ISODateTimeLocal,
        ),
      ]),
    );

    const screen = renderWithStoreAndRouter(<ReviewPage />, {
      store,
    });

    await screen.findByText('Primary care');
    expect(screen.getByText('Primary care')).to.have.tagName('span');
    const [
      pageHeading,
      typeOfCareHeading,
      facilityHeading,
      dateHeading,
      reasonHeading,
      contactHeading,
    ] = screen.getAllByRole('heading');
    expect(pageHeading).to.contain.text(
      'Review and confirm your appointment details',
    );
    expect(typeOfCareHeading).to.contain.text('Type of care');
    expect(screen.baseElement).to.contain.text('Primary care');

    expect(facilityHeading).to.contain.text('Facility');
    expect(screen.baseElement).to.contain.text('Cheyenne VA Medical Center');
    expect(screen.baseElement).to.contain.text('Cheyenne, WyomingWY');
    expect(screen.baseElement).to.contain.text('Clinic: Some VA clinic');

    expect(dateHeading).to.contain.text('Date and time');
    expect(screen.baseElement).to.contain.text(
      formatInTimeZone(
        start,
        'America/Denver',
        DATE_FORMATS.friendlyWeekdayDate,
      ),
    );
    expect(screen.baseElement).to.contain.text(
      formatInTimeZone(start, 'America/Denver', 'h:mm aaaa'),
    );

    expect(reasonHeading).to.contain.text(
      'Details to share with your provider',
    );
    expect(screen.baseElement).to.contain.text('Routine/Follow-up');
    expect(screen.baseElement).to.contain.text('I need an appt');

    expect(contactHeading).to.contain.text('Your contact information');
    expect(screen.baseElement).to.contain.text('Email: joeblow@gmail.com');
    expect(screen.getByTestId('patient-telephone')).to.exist;
    expect(screen.baseElement).to.not.contain.text(
      'Call anytime during the day',
    );

    const editLinks = screen.getAllByTestId('edit-new-appointment');
    const uniqueLinks = new Set();
    editLinks.forEach(link => {
      expect(link).to.have.attribute('aria-label');
      uniqueLinks.add(link.getAttribute('aria-label'));
    });
    expect(uniqueLinks.size).to.equal(editLinks.length);
  });

  it('should submit successfully', async () => {
    store.dispatch(
      onCalendarChange([
        formatInTimeZone(
          start,
          'America/Denver',
          DATE_FORMATS.ISODateTimeLocal,
        ),
      ]),
    );

    mockAppointmentSubmitApi({
      response: new MockAppointmentResponse({ id: 'fake_id' }),
    });
    const screen = renderWithStoreAndRouter(<ReviewPage />, {
      store,
    });

    await screen.findByText('Primary care');

    userEvent.click(screen.getByText(/Confirm appointment/i));
    await waitFor(() => {
      expect(screen.history.push.lastCall.args[0]).to.equal(
        '/fake_id?confirmMsg=true',
      );
    });

    const submitData = JSON.parse(global.fetch.getCall(0).args[1].body);

    expect(submitData).to.deep.equal({
      kind: 'clinic',
      status: 'booked',
      locationId: '983',
      clinic: '455',
      reasonCode: {
        text: 'reason code:ROUTINEVISIT|comments:I need an appt',
      },
      extension: {
        desiredDate: '2021-05-06T00:00:00+00:00',
      },
      slot: store.getState().newAppointment.availableSlots[0],
    });
  });

  it('should show error message on failure', async () => {
    store.dispatch(
      onCalendarChange([
        formatInTimeZone(
          start,
          'America/Denver',
          DATE_FORMATS.ISODateTimeLocal,
        ),
      ]),
    );

    mockFacilityApi({
      response: new MockFacilityResponse(),
    });

    setFetchJSONFailure(
      global.fetch.withArgs(`${environment.API_URL}/vaos/v2/appointments`),
      {
        errors: [{ code: 'VAOS_500' }],
      },
    );

    const screen = renderWithStoreAndRouter(<ReviewPage />, {
      store,
    });

    await screen.findByText('Primary care');

    userEvent.click(screen.getByText(/Confirm appointment/i));

    await screen.findByText('We can’t schedule your appointment right now');

    expect(screen.baseElement).contain.text(
      'We’re sorry. There’s a problem with our system. Refresh this page to start over or try again later.',
    );
    expect(screen.baseElement).contain.text(
      'If you need to schedule now, call your VA facility.',
    );

    expect(
      screen.getByRole('heading', {
        level: 3,
        name: /Cheyenne VA Medical Center/i,
      }),
    );

    const alert = document.querySelector('va-alert');
    expect(within(alert).getByText(/2360 East Pershing Boulevard/i)).to.be.ok;
    expect(alert).to.contain.text('Cheyenne, WyomingWY');
    expect(within(alert).getByText(/82001-5356/)).to.be.ok;
    expect(within(alert).getByTestId('facility-telephone')).to.exist;
    // expect(screen.getByTestId('patient-telephone')).to.exist;
    expect(screen.history.push.called).to.be.false;
    waitFor(() => {
      expect(document.activeElement).to.be(alert);
    });
  });

  it('should show appropriate message on bad 400 request submit error', async () => {
    store.dispatch(
      onCalendarChange([
        formatInTimeZone(
          start,
          'America/Denver',
          DATE_FORMATS.ISODateTimeLocal,
        ),
      ]),
    );

    mockFacilityApi({
      response: new MockFacilityResponse(),
    });
    setFetchJSONFailure(
      global.fetch.withArgs(`${environment.API_URL}/vaos/v2/appointments`),
      {
        errors: [
          {
            code: 'VAOS_400',
          },
        ],
      },
    );

    const screen = renderWithStoreAndRouter(<Route component={ReviewPage} />, {
      store,
    });

    await screen.findByText('Primary care');

    userEvent.click(screen.getByText(/Confirm appointment/i));

    await screen.findByText('We can’t schedule your appointment right now');

    expect(screen.baseElement).contain.text(
      'Something went wrong when we tried to submit your appointment. Call your VA medical center to schedule this appointment.',
    );

    // Not sure of a better way to search for test just within the alert
    const alert = screen.baseElement.querySelector('va-alert');
    expect(alert).contain.text('Cheyenne VA Medical Center');
    expect(alert).contain.text('2360 East Pershing Boulevard');
    expect(alert).contain.text('Cheyenne, WyomingWY 82001-5356');
    expect(screen.getByTestId('facility-telephone')).to.exist;

    expect(screen.history.push.called).to.be.false;
    waitFor(() => {
      expect(document.activeElement).to.be(alert);
    });
  });

  it('should show appropriate message on overbooked 409 error', async () => {
    store.dispatch(
      onCalendarChange([
        formatInTimeZone(
          start,
          'America/Denver',
          DATE_FORMATS.ISODateTimeLocal,
        ),
      ]),
    );
    mockFacilityApi({
      response: new MockFacilityResponse(),
    });
    setFetchJSONFailure(
      global.fetch.withArgs(`${environment.API_URL}/vaos/v2/appointments`),
      {
        errors: [
          {
            code: 'VAOS_409',
          },
        ],
      },
    );

    const screen = renderWithStoreAndRouter(<Route component={ReviewPage} />, {
      store,
    });

    await screen.findByText('Primary care');

    userEvent.click(screen.getByText(/Confirm appointment/i));

    await screen.findByText('We can’t schedule your appointment right now');

    expect(screen.baseElement).contain.text(
      'You already have an overlapping booked appointment. Please schedule for a different day.',
    );

    expect(screen.getByTestId('facility-telephone')).to.exist;

    // Not sure of a better way to search for test just within the alert
    const alert = screen.baseElement.querySelector('va-alert');
    expect(alert).contain.text('Cheyenne VA Medical Center');
    expect(alert).contain.text('2360 East Pershing Boulevard');
    expect(alert).contain.text('Cheyenne, WyomingWY 82001-5356');
    expect(screen.history.push.called).to.be.false;
    waitFor(() => {
      expect(document.activeElement).to.be(alert);
    });
  });

  it('should show appropriate message on bad 500 request submit error', async () => {
    store.dispatch(
      onCalendarChange([
        formatInTimeZone(
          start,
          'America/Denver',
          DATE_FORMATS.ISODateTimeLocal,
        ),
      ]),
    );
    mockFacilityApi({
      response: new MockFacilityResponse(),
    });
    setFetchJSONFailure(
      global.fetch.withArgs(`${environment.API_URL}/vaos/v2/appointments`),
      {
        errors: [
          {
            code: '500',
          },
        ],
      },
    );

    const screen = renderWithStoreAndRouter(<Route component={ReviewPage} />, {
      store,
    });

    await screen.findByText('Primary care');

    userEvent.click(screen.getByText(/Confirm appointment/i));

    await screen.findByText('We can’t schedule your appointment right now');

    expect(screen.baseElement).contain.text(
      'We’re sorry. There’s a problem with our system. Refresh this page to start over or try again later.',
    );
    expect(screen.baseElement).contain.text(
      'If you need to schedule now, call your VA facility.',
    );

    expect(screen.getByTestId('facility-telephone')).to.exist;

    // Not sure of a better way to search for test just within the alert
    const alert = screen.baseElement.querySelector('va-alert');
    expect(alert).contain.text('Cheyenne VA Medical Center');
    expect(alert).contain.text('2360 East Pershing Boulevard');
    expect(alert).contain.text('Cheyenne, WyomingWY 82001-5356');
    expect(screen.history.push.called).to.be.false;
    waitFor(() => {
      expect(document.activeElement).to.be(alert);
    });
  });
});
