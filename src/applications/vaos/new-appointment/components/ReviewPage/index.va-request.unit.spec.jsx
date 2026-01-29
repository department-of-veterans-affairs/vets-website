/* eslint-disable camelcase */
import { expect } from 'chai';
import React from 'react';

import { waitFor, within } from '@testing-library/dom';
import userEvent from '@testing-library/user-event';

import {
  mockFetch,
  setFetchJSONFailure,
} from '@department-of-veterans-affairs/platform-testing/helpers';
import environment from '@department-of-veterans-affairs/platform-utilities/environment';

import {
  createTestStore,
  renderWithStoreAndRouter,
} from '../../../tests/mocks/setup';
import { FACILITY_TYPES, TYPE_OF_CARE_IDS } from '../../../utils/constants';

import ReviewPage from '.';
import MockAppointmentResponse from '../../../tests/fixtures/MockAppointmentResponse';
import {
  mockAppointmentSubmitApi,
  mockFacilityApi,
} from '../../../tests/mocks/mockApis';

const initialState = {
  featureToggles: {
    vaOnlineSchedulingCancel: true,
  },
};

describe('VAOS Page: ReviewPage VA request with VAOS service', () => {
  let store;

  const defaultState = {
    ...initialState,
    newAppointment: {
      pages: {},
      data: {
        facilityType: FACILITY_TYPES.VAMC.id,
        typeOfCareId: TYPE_OF_CARE_IDS.PRIMARY_CARE,
        phoneNumber: '1234567890',
        email: 'joeblow@gmail.com',
        reasonForAppointment: 'routine-follow-up',
        reasonAdditionalInfo: 'I need an appt',
        vaFacility: '983',
        visitType: 'telehealth',
        selectedDates: ['2020-05-25T00:00:00.000', '2020-05-26T12:00:00.000'],
        bestTimeToCall: { morning: true, afternoon: true, evening: true },
      },
      clinics: {},
      parentFacilities: [],
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
    },
  };

  beforeEach(() => {
    mockFetch();
  });

  it('should submit successfully', async () => {
    store = createTestStore(defaultState);
    mockAppointmentSubmitApi({
      response: new MockAppointmentResponse({ id: 'fake_id' }),
    });

    const screen = renderWithStoreAndRouter(<ReviewPage />, {
      store,
    });

    await screen.findByText(/Review and submit your request/i);

    userEvent.click(screen.getByText(/Submit request/i));
    await waitFor(() => {
      expect(screen.history.push.lastCall.args[0]).to.equal(
        '/pending/fake_id?confirmMsg=true',
      );
    });

    const submitData = JSON.parse(global.fetch.getCall(0).args[1].body);
    expect(submitData).to.deep.equal({
      kind: 'telehealth',
      status: 'proposed',
      locationId: '983',
      serviceType: 'primaryCare',
      reasonCode: {
        text:
          'station id: 983|preferred modality: VIDEO|phone number: 1234567890|email: joeblow@gmail.com|preferred dates:05/25/2020 AM,05/26/2020 PM|comments:I need an appt',
      },
      requestedPeriods: [
        {
          start: '2020-05-25T00:00:00Z',
          end: '2020-05-25T11:59:00Z',
        },
      ],
      preferredTimesForPhoneCall: ['Morning', 'Afternoon', 'Evening'],
    });
  });

  it('should submit successfully - with Other reason code', async () => {
    store = createTestStore({
      ...defaultState,
      newAppointment: {
        ...defaultState.newAppointment,
        data: {
          ...defaultState.newAppointment.data,
          reasonForAppointment: 'other',
          reasonAdditionalInfo: 'I need an appt',
        },
      },
    });
    mockAppointmentSubmitApi({
      response: new MockAppointmentResponse({ id: 'fake_id' }),
    });

    const screen = renderWithStoreAndRouter(<ReviewPage />, {
      store,
    });

    await screen.findByText(/Review and submit your request/i);

    userEvent.click(screen.getByText(/Submit request/i));
    await waitFor(() => {
      expect(screen.history.push.lastCall.args[0]).to.equal(
        '/pending/fake_id?confirmMsg=true',
      );
    });

    const submitData = JSON.parse(global.fetch.getCall(0).args[1].body);
    expect(submitData).to.deep.equal({
      kind: 'telehealth',
      status: 'proposed',
      locationId: '983',
      serviceType: 'primaryCare',
      reasonCode: {
        text:
          'station id: 983|preferred modality: VIDEO|phone number: 1234567890|email: joeblow@gmail.com|preferred dates:05/25/2020 AM,05/26/2020 PM|comments:I need an appt',
      },
      requestedPeriods: [
        {
          start: '2020-05-25T00:00:00Z',
          end: '2020-05-25T11:59:00Z',
        },
      ],
      preferredTimesForPhoneCall: ['Morning', 'Afternoon', 'Evening'],
    });
  });

  // Skipped test: https://github.com/department-of-veterans-affairs/va.gov-team/issues/119526
  it.skip('should record GA tracking event', async () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    store = createTestStore({
      ...defaultState,
      newAppointment: {
        ...defaultState.newAppointment,
        data: {
          ...defaultState.newAppointment.data,
          selectedDates: [tomorrow, tomorrow],
        },
      },
    });
    mockAppointmentSubmitApi({
      response: new MockAppointmentResponse({ id: 'fake_id' }),
    });

    const screen = renderWithStoreAndRouter(<ReviewPage />, {
      store,
    });

    await screen.findByText(/Review and submit your request/i);

    userEvent.click(screen.getByText(/Submit request/i));
    await waitFor(() => {
      expect(screen.history.push.lastCall.args[0]).to.equal(
        '/pending/fake_id?confirmMsg=true',
      );
    });

    expect(window.dataLayer[1]).to.deep.equal({
      event: 'vaos-request-submission-successful',
      flow: 'va-request',
      'health-TypeOfCare': 'Primary care',
      'vaos-preferred-combination': 'afternoon-evening-morning',
      'vaos-number-of-days-from-preference': '1-1-null',
    });
  });

  it('should show error message on failure', async () => {
    store = createTestStore(defaultState);
    mockFacilityApi({
      id: '983',
      responseCode: 404,
    });
    setFetchJSONFailure(
      global.fetch.withArgs(`${environment.API_URL}/vaos/v2/appointments`),
      {
        errors: [{}],
      },
    );

    const screen = renderWithStoreAndRouter(<ReviewPage />, {
      store,
    });

    await screen.findByText(/Review and submit your request/i);

    userEvent.click(screen.getByText(/Submit request/i));

    await screen.findByText('We can’t submit your request right now');

    expect(screen.baseElement).contain.text(
      'We’re sorry. There’s a problem with appointments. Refresh this page or try again later.',
    );
    expect(screen.baseElement).contain.text(
      'If you need to schedule now, call your facility.',
    );

    expect(screen.baseElement).contain.text('Cheyenne VA Medical Center');

    const alert = document.querySelector('va-alert');
    expect(within(alert).getByTestId('facility-telephone')).to.be.ok;

    expect(screen.history.push.called).to.be.false;
    waitFor(() => {
      expect(document.activeElement).to.be(alert);
    });
    expect(window.dataLayer[1]).to.deep.include({
      event: 'vaos-request-submission-failed',
      flow: 'va-request',
      'health-TypeOfCare': 'Primary care',
      'vaos-preferred-combination': 'afternoon-evening-morning',
    });
  });
});
