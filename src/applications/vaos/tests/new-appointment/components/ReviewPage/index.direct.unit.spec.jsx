import React from 'react';
import moment from 'moment';
import { expect } from 'chai';
import userEvent from '@testing-library/user-event';
import { waitFor } from '@testing-library/dom';
import { Route } from 'react-router-dom';

import {
  setFetchJSONFailure,
  mockFetch,
  resetFetch,
} from 'platform/testing/unit/helpers';
import environment from 'platform/utilities/environment';

import {
  createTestStore,
  renderWithStoreAndRouter,
} from '../../../mocks/setup';

import ReviewPage from '../../../../new-appointment/components/ReviewPage';
import {
  onCalendarChange,
  startDirectScheduleFlow,
} from '../../../../new-appointment/redux/actions';
import {
  mockAppointmentSubmit,
  mockFacilityFetch,
} from '../../../mocks/helpers';
import { getVAFacilityMock } from '../../../mocks/v0';

const initialState = {
  featureToggles: {
    vaOnlineSchedulingCancel: true,
    // eslint-disable-next-line camelcase
    show_new_schedule_view_appointments_page: true,
  },
};

describe('VAOS <ReviewPage> direct scheduling', () => {
  let store;
  let start;

  beforeEach(() => {
    mockFetch();
    start = moment();
    store = createTestStore({
      ...initialState,
      newAppointment: {
        pages: {},
        data: {
          typeOfCareId: '323',
          phoneNumber: '1234567890',
          email: 'joeblow@gmail.com',
          reasonForAppointment: 'routine-follow-up',
          reasonAdditionalInfo: 'I need an appt',
          vaParent: '983',
          vaFacility: '983',
          clinicId: '455',
        },
        parentFacilities: [
          {
            id: '983',
            identifier: [
              { system: 'urn:oid:2.16.840.1.113883.6.233', value: '983' },
              {
                system: 'http://med.va.gov/fhir/urn',
                value: 'urn:va:facility:983',
              },
            ],
          },
        ],
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
              id: '455',
              serviceName: 'Some VA clinic',
              characteristic: [
                {
                  text: 'clinicFriendlyLocationName',
                  value: 'Some VA clinic',
                },
                {
                  text: 'institutionName',
                  value: 'Cheyenne VA Medical Center',
                },
                {
                  text: 'institutionCode',
                  value: '983',
                },
              ],
              identifier: [
                {
                  system: 'http://med.va.gov/fhir/urn',
                  value: 'urn:va:facility:983:983:455',
                },
              ],
            },
          ],
        },
      },
    });
    store.dispatch(startDirectScheduleFlow());
    store.dispatch(onCalendarChange([start.format()]));
  });
  afterEach(() => resetFetch());

  it('should show form information for review', async () => {
    const screen = renderWithStoreAndRouter(<ReviewPage />, {
      store,
    });

    await screen.findByText(/scheduling a primary care appointment/i);
    expect(screen.getByText('Primary care')).to.have.tagName('h2');
    const [
      pageHeading,
      descHeading,
      typeOfCareHeading,
      dateHeading,
      clinicHeading,
      reasonHeading,
      contactHeading,
    ] = screen.getAllByRole('heading');
    expect(pageHeading).to.contain.text('Review your appointment details');
    expect(descHeading).to.contain.text(
      'scheduling a primary care appointment',
    );
    expect(typeOfCareHeading).to.contain.text('Primary care');
    expect(screen.baseElement).to.contain.text('VA Appointment');

    expect(dateHeading).to.contain.text(
      start.format('dddd, MMMM DD, YYYY [at] h:mm a'),
    );

    expect(clinicHeading).to.contain.text('Some VA clinic');
    expect(screen.baseElement).to.contain.text('Cheyenne VA Medical Center');

    expect(reasonHeading).to.contain.text('Follow-up/Routine');
    expect(screen.baseElement).to.contain.text('I need an appt');

    expect(contactHeading).to.contain.text('Your contact details');
    expect(screen.baseElement).to.contain.text('joeblow@gmail.com');
    expect(screen.baseElement).to.contain.text('1234567890');
    expect(screen.baseElement).to.contain.text('Call anytime during the day');

    const editLinks = screen.getAllByText(/^Edit/, { selector: 'a' });
    const uniqueLinks = new Set();
    editLinks.forEach(link => {
      expect(link).to.have.attribute('aria-label');
      uniqueLinks.add(link.getAttribute('aria-label'));
    });
    expect(uniqueLinks.size).to.equal(editLinks.length);
  });

  it('should submit successfully', async () => {
    mockAppointmentSubmit({});

    const screen = renderWithStoreAndRouter(<Route component={ReviewPage} />, {
      store,
    });

    await screen.findByText(/scheduling a primary care appointment/i);

    userEvent.click(screen.getByText(/Confirm appointment/i));
    await waitFor(() => {
      expect(screen.history.push.lastCall.args[0]).to.equal(
        '/new-appointment/confirmation',
      );
    });
    const submitData = JSON.parse(global.fetch.getCall(0).args[1].body);

    expect(submitData.clinic.siteCode).to.equal('983');
    expect(submitData.clinic.clinicId).to.equal('455');
    expect(submitData.dateTime).to.equal(`${start.format()}+00:00`);
  });

  it('should show appropriate message on bad request submit error', async () => {
    mockFacilityFetch('vha_442', {
      id: 'vha_442',
      attributes: {
        ...getVAFacilityMock().attributes,
        uniqueId: '442',
        name: 'Cheyenne VA Medical Center',
        address: {
          physical: {
            zip: '82001-5356',
            city: 'Cheyenne',
            state: 'WY',
            address1: '2360 East Pershing Boulevard',
          },
        },
        phone: {
          main: '307-778-7550',
        },
      },
    });
    setFetchJSONFailure(
      global.fetch.withArgs(`${environment.API_URL}/vaos/v0/appointments`),
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

    await screen.findByText(/scheduling a primary care appointment/i);

    userEvent.click(screen.getByText(/Confirm appointment/i));

    await screen.findByText('We couldn’t schedule this appointment');

    expect(screen.baseElement).contain.text(
      'Something went wrong when we tried to submit your appointment. You’ll',
    );

    await screen.findByText('307-778-7550');

    // Not sure of a better way to search for test just within the alert
    const alert = screen.baseElement.querySelector('.usa-alert');
    expect(alert).contain.text('Cheyenne VA Medical Center');
    expect(alert).contain.text('2360 East Pershing Boulevard');
    expect(alert).contain.text('Cheyenne, WY 82001-5356');
    expect(screen.history.push.called).to.be.false;
  });
});
