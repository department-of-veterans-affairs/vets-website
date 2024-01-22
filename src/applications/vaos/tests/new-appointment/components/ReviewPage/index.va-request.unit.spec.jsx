/* eslint-disable camelcase */
import React from 'react';
import moment from 'moment';
import { expect } from 'chai';

import userEvent from '@testing-library/user-event';
import { waitFor, within } from '@testing-library/dom';

import {
  setFetchJSONFailure,
  mockFetch,
} from '@department-of-veterans-affairs/platform-testing/helpers';
import environment from '@department-of-veterans-affairs/platform-utilities/environment';

import { FACILITY_TYPES } from '../../../../utils/constants';
import {
  createTestStore,
  renderWithStoreAndRouter,
} from '../../../mocks/setup';

import ReviewPage from '../../../../new-appointment/components/ReviewPage';
import { mockAppointmentSubmitV2 } from '../../../mocks/helpers.v2';
import { createMockCheyenneFacilityByVersion } from '../../../mocks/data';
import { mockFacilityFetchByVersion } from '../../../mocks/fetch';

const initialState = {
  featureToggles: {
    vaOnlineSchedulingCancel: true,
    // eslint-disable-next-line camelcase
    show_new_schedule_view_appointments_page: true,
  },
};

// describe('VAOS <ReviewPage> VA request', () => {
//   let store;
//   let start;

//   const defaultState = {
//     ...initialState,
//     newAppointment: {
//       pages: {},
//       data: {
//         facilityType: FACILITY_TYPES.VAMC,
//         typeOfCareId: '323',
//         phoneNumber: '1234567890',
//         email: 'joeblow@gmail.com',
//         reasonForAppointment: 'routine-follow-up',
//         reasonAdditionalInfo: 'I need an appt',
//         vaParent: '983',
//         vaFacility: '983',
//         visitType: 'telehealth',
//         selectedDates: ['2020-05-25T00:00:00.000', '2020-05-26T12:00:00.000'],
//         bestTimeToCall: {
//           morning: true,
//           afternoon: true,
//           evening: true,
//         },
//       },
//       clinics: {},
//       parentFacilities: [
//         {
//           id: '983',
//           identifier: [
//             { system: 'urn:oid:2.16.840.1.113883.6.233', value: '983' },
//             {
//               system: 'http://med.va.gov/fhir/urn',
//               value: 'urn:va:facility:983',
//             },
//           ],
//         },
//       ],
//       facilities: {
//         '323': [
//           {
//             id: '983',
//             name: 'Cheyenne VA Medical Center',
//             identifier: [
//               { system: 'urn:oid:2.16.840.1.113883.6.233', value: '983' },
//             ],
//             address: {
//               postalCode: '82001-5356',
//               city: 'Cheyenne',
//               state: 'WY',
//               line: ['2360 East Pershing Boulevard'],
//             },
//             telecom: [{ system: 'phone', value: '307-778-7550' }],
//           },
//         ],
//       },
//     },
//   };

//   beforeEach(() => {
//     mockFetch();
//     start = moment();
//   });

// });

describe('VAOS <ReviewPage> VA request with VAOS service', () => {
  let store;

  const defaultState = {
    ...initialState,
    featureToggles: { vaOnlineSchedulingVAOSServiceRequests: true },
    newAppointment: {
      pages: {},
      data: {
        facilityType: FACILITY_TYPES.VAMC,
        typeOfCareId: '323',
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
    },
  };

  beforeEach(() => {
    mockFetch();
  });

  it('should submit successfully', async () => {
    store = createTestStore(defaultState);
    mockAppointmentSubmitV2({
      id: 'fake_id',
      attributes: {
        reasonCode: {},
      },
    });

    const screen = renderWithStoreAndRouter(<ReviewPage />, {
      store,
    });

    await screen.findByText(/requesting a primary care appointment/i);

    userEvent.click(screen.getByText(/Request appointment/i));
    await waitFor(() => {
      expect(screen.history.push.lastCall.args[0]).to.equal(
        '/requests/fake_id?confirmMsg=true',
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
          'station id: 983|preferred modality: VIDEO|phone number: 1234567890|email: joeblow@gmail.com|preferred dates:05/25/2020 AM,05/26/2020 PM|reason code:ROUTINEVISIT|comments:I need an appt',
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
    mockAppointmentSubmitV2({
      id: 'fake_id',
      attributes: {
        reasonCode: {},
      },
    });

    const screen = renderWithStoreAndRouter(<ReviewPage />, {
      store,
    });

    await screen.findByText(/requesting a primary care appointment/i);

    userEvent.click(screen.getByText(/Request appointment/i));
    await waitFor(() => {
      expect(screen.history.push.lastCall.args[0]).to.equal(
        '/requests/fake_id?confirmMsg=true',
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
          'station id: 983|preferred modality: VIDEO|phone number: 1234567890|email: joeblow@gmail.com|preferred dates:05/25/2020 AM,05/26/2020 PM|reason code:OTHER_REASON|comments:I need an appt',
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

  it('should record GA tracking event', async () => {
    const tomorrow = moment().add(1, 'days');
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
    mockAppointmentSubmitV2({
      id: 'fake_id',
      attributes: {
        reasonCode: {},
      },
    });

    const screen = renderWithStoreAndRouter(<ReviewPage />, {
      store,
    });

    await screen.findByText(/requesting a primary care appointment/i);

    userEvent.click(screen.getByText(/Request appointment/i));
    await waitFor(() => {
      expect(screen.history.push.lastCall.args[0]).to.equal(
        '/requests/fake_id?confirmMsg=true',
      );
    });

    expect(window.dataLayer[1]).to.deep.equal({
      event: 'vaos-request-submission-successful',
      flow: 'va-request',
      'health-TypeOfCare': 'Primary care',
      'health-ReasonForAppointment': 'routine-follow-up',
      'vaos-preferred-combination': 'afternoon-evening-morning',
      'vaos-number-of-days-from-preference': '1-1-null',
    });
  });

  it('should show error message on failure', async () => {
    store = createTestStore(defaultState);
    mockFacilityFetchByVersion({
      facility: createMockCheyenneFacilityByVersion({}),
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

    await screen.findByText(/requesting a primary care appointment/i);

    userEvent.click(screen.getByText(/Request appointment/i));

    await screen.findByText('We couldn’t schedule this appointment');

    expect(screen.baseElement).contain.text(
      'Something went wrong when we tried to submit your request. You can try again later, or call your VA medical center to help with your request.',
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
    expect(within(alert).getByTestId('facility-telephone')).to.be.ok;

    expect(screen.history.push.called).to.be.false;
    waitFor(() => {
      expect(document.activeElement).to.be(alert);
    });
    expect(window.dataLayer[1]).to.deep.include({
      event: 'vaos-request-submission-failed',
      flow: 'va-request',
      'health-TypeOfCare': 'Primary care',
      'health-ReasonForAppointment': 'routine-follow-up',
      'vaos-preferred-combination': 'afternoon-evening-morning',
    });
  });
});
