import React from 'react';
import moment from 'moment';
import { expect } from 'chai';
import userEvent from '@testing-library/user-event';
import { waitFor, within } from '@testing-library/dom';
import { Route } from 'react-router-dom';

import {
  setFetchJSONFailure,
  mockFetch,
} from '@department-of-veterans-affairs/platform-testing/helpers';
import environment from '@department-of-veterans-affairs/platform-utilities/environment';

import {
  createTestStore,
  renderWithStoreAndRouter,
} from '../../../tests/mocks/setup';

import ReviewPage from '.';
import { onCalendarChange, startDirectScheduleFlow } from '../../redux/actions';
import { mockAppointmentSubmit } from '../../../tests/mocks/helpers';
import { createMockCheyenneFacility } from '../../../tests/mocks/data';
import { mockFacilityFetch } from '../../../tests/mocks/fetch';

const initialState = {
  featureToggles: {
    vaOnlineSchedulingCancel: true,
    // eslint-disable-next-line camelcase
    show_new_schedule_view_appointments_page: true,
  },
};

describe('VAOS Page: ReviewPage direct scheduling', () => {
  let store;
  let start;

  beforeEach(() => {
    mockFetch();
    start = moment.tz();
    store = createTestStore({
      ...initialState,
      featureToggles: {
        vaOnlineSchedulingVAOSServiceVAAppointments: true,
      },
      newAppointment: {
        pages: {},
        data: {
          typeOfCareId: '323',
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
          '983': {
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
          '323': [
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
            start: start.format(),
            end: start
              .clone()
              .add(30, 'minutes')
              .format(),
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
    store.dispatch(onCalendarChange([start.format()]));
  });

  it('should show form information for review', async () => {
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
      start.tz('America/Denver').format('dddd, MMMM D, YYYY'),
    );
    expect(screen.baseElement).to.contain.text(
      start.tz('America/Denver').format('h:mm a'),
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
    mockAppointmentSubmit({
      id: 'fake_id',
      attributes: {
        reasonCode: {},
      },
    });

    const screen = renderWithStoreAndRouter(<ReviewPage />, {
      store,
    });

    await screen.findByText('Primary care');

    userEvent.click(screen.getByText(/Confirm appointment/i));
    await waitFor(() => {
      expect(screen.history.push.lastCall.args[0]).to.equal(
        '/va/fake_id?confirmMsg=true',
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
    mockFacilityFetch({
      facility: createMockCheyenneFacility({}),
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

    await screen.findByText('We couldn’t schedule this appointment');

    expect(screen.baseElement).contain.text(
      'Something went wrong when we tried to submit your appointment. You can try again later, or call your VA medical center to help with your appointment.',
    );

    expect(
      screen.getByRole('heading', {
        level: 4,
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

    await screen.findByText('We couldn’t schedule this appointment');

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

    await screen.findByText('We couldn’t schedule this appointment');

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

    await screen.findByText('We couldn’t schedule this appointment');

    expect(screen.baseElement).contain.text(
      `Something went wrong when we tried to submit your appointment. You can try again later, or call your VA medical center to help with your appointment`,
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
