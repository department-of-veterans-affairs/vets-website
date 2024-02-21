/* eslint-disable camelcase */
import React from 'react';
import moment from 'moment';
import { expect } from 'chai';

import userEvent from '@testing-library/user-event';
import { waitFor } from '@testing-library/dom';

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

const initialStateVAOSService = {
  featureToggles: {
    vaOnlineSchedulingCancel: true,
    // eslint-disable-next-line camelcase
    show_new_schedule_view_appointments_page: true,
    vaOnlineSchedulingVAOSServiceRequests: true,
  },
};

describe('VAOS Page: ReviewPage CC request with VAOS service', () => {
  let store;
  const defaultState = {
    ...initialStateVAOSService,
    user: {
      profile: {
        facilities: [{ facilityId: '983', isCerner: false }],
        vapContactInfo: {
          residentialAddress: {
            addressLine1: '123 big sky st',
            city: 'Cincinnati',
            stateCode: 'OH',
            zipCode: '45220',
            latitude: 39.1,
            longitude: -84.6,
          },
        },
      },
    },
    newAppointment: {
      pages: {},
      data: {
        facilityType: FACILITY_TYPES.COMMUNITY_CARE,
        typeOfCareId: '323',
        phoneNumber: '1234567890',
        email: 'joeblow@gmail.com',
        reasonAdditionalInfo: 'I need an appt',
        communityCareSystemId: '983',
        preferredLanguage: 'english',
        hasCommunityCareProvider: true,
        selectedDates: ['2020-05-25T00:00:00.000', '2020-05-26T12:00:00.000'],
        communityCareProvider: {
          resourceType: 'Location',
          identifier: [
            {
              system: 'PPMS',
              value: 'ppmsid',
            },
          ],
          address: {
            line: ['1012 14TH ST NW STE 700'],
            city: 'WASHINGTON',
            state: 'DC',
            postalCode: '20005-3477',
          },
          name: 'CAMPBELL, WILLIAM',
        },
        bestTimeToCall: {
          morning: true,
          afternoon: true,
          evening: true,
        },
      },
      clinics: {},
      ccEnabledSystems: [
        {
          id: '983',
          vistaId: '983',
          name: 'Cheyenne VA Medical Center',
          address: {
            line: ['2360 East Pershing Boulevard'],
            city: 'Cheyenne',
            state: 'WY',
            postalCode: '82001-5356',
          },
        },
      ],
      parentFacilities: [
        {
          id: '983',
          vistaId: '983',
          name: 'Cheyenne VA Medical Center',
          address: {
            line: ['2360 East Pershing Boulevard'],
            city: 'Cheyenne',
            state: 'WY',
            postalCode: '82001-5356',
          },
        },
      ],
      facilities: {},
    },
  };

  beforeEach(() => {
    mockFetch();
    store = createTestStore(defaultState);
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

    await screen.findByText(/requesting a community care appointment/i);

    userEvent.click(screen.getByText(/Request appointment/i));
    await waitFor(() => {
      expect(screen.history.push.lastCall.args[0]).to.equal(
        '/requests/fake_id?confirmMsg=true',
      );
    });

    const submitData = JSON.parse(global.fetch.getCall(0).args[1].body);

    expect(submitData).to.deep.equal({
      kind: 'cc',
      status: 'proposed',
      locationId: '983',
      serviceType: 'primaryCare',
      contact: {
        telecom: [
          {
            type: 'phone',
            value: '1234567890',
          },
          {
            type: 'email',
            value: 'joeblow@gmail.com',
          },
        ],
      },
      reasonCode: {
        text: 'I need an appt',
      },
      requestedPeriods: [
        {
          start: '2020-05-25T06:00:00Z',
          end: '2020-05-25T17:59:00Z',
        },
        {
          start: '2020-05-26T18:00:00Z',
          end: '2020-05-27T05:59:00Z',
        },
      ],
      preferredTimesForPhoneCall: ['Morning', 'Afternoon', 'Evening'],
      preferredLanguage: 'English',
      preferredLocation: {
        city: 'Cincinnati',
        state: 'OH',
      },
      practitioners: [
        {
          identifier: [
            {
              system: 'http://hl7.org/fhir/sid/us-npi',
              value: 'ppmsid',
            },
          ],
          address: {
            line: ['1012 14TH ST NW STE 700'],
            city: 'WASHINGTON',
            state: 'DC',
            postalCode: '20005-3477',
          },
        },
      ],
    });
  });

  it('should record GA tracking events', async () => {
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

    await screen.findByText(/requesting a community care appointment/i);

    userEvent.click(screen.getByText(/Request appointment/i));
    await waitFor(() => {
      expect(screen.history.push.lastCall.args[0]).to.equal(
        '/requests/fake_id?confirmMsg=true',
      );
    });

    expect(global.window.dataLayer[1]).to.deep.include({
      event: 'vaos-community-care-submission-successful',
      flow: 'cc-request',
      'health-TypeOfCare': 'Primary care',
      'health-ReasonForAppointment': undefined,
      'vaos-community-care-preferred-language': 'english',
      'vaos-number-of-preferred-providers': 1,
      'vaos-number-of-days-from-preference': '1-1-null',
      'vaos-preferred-combination': 'afternoon-evening-morning',
    });
  });

  it('should show error message on failure', async () => {
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

    mockFacilityFetchByVersion({
      facility: createMockCheyenneFacilityByVersion({
        version: 0,
      }),
      version: 0,
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

    await screen.findByText(/requesting a community care appointment/i);

    userEvent.click(screen.getByText(/Request appointment/i));

    await screen.findByText('We couldn’t schedule this appointment');

    expect(screen.baseElement).contain.text(
      'Something went wrong when we tried to submit your request. You can try again later, or call your VA medical center to help with your request.',
    );

    expect(screen.baseElement).contain.text('Cheyenne VA Medical Center');
    expect(screen.baseElement).contain.text('2360 East Pershing Boulevard');

    expect(screen.history.push.called).to.be.false;
    waitFor(() => {
      expect(document.activeElement).to.be(alert);
    });
    expect(global.window.dataLayer[1]).to.deep.include({
      event: 'vaos-community-care-submission-failed',
      flow: 'cc-request',
      'health-TypeOfCare': 'Primary care',
      'health-ReasonForAppointment': undefined,
      'vaos-community-care-preferred-language': 'english',
      'vaos-number-of-preferred-providers': 1,
      'vaos-number-of-days-from-preference': '1-1-null',
      'vaos-preferred-combination': 'afternoon-evening-morning',
    });
  });
});
