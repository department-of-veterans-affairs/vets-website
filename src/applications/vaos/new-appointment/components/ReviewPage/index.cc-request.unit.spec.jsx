/* eslint-disable camelcase */
import { expect } from 'chai';
import React from 'react';

import { waitFor } from '@testing-library/dom';
import userEvent from '@testing-library/user-event';

import {
  mockFetch,
  setFetchJSONFailure,
} from '@department-of-veterans-affairs/platform-testing/helpers';
import environment from '@department-of-veterans-affairs/platform-utilities/environment';

import { addDays, format, startOfDay } from 'date-fns';
import {
  createTestStore,
  renderWithStoreAndRouter,
} from '../../../tests/mocks/setup';
import {
  DATE_FORMATS,
  FACILITY_TYPES,
  TYPE_OF_CARE_IDS,
} from '../../../utils/constants';

import ReviewPage from '.';
import MockAppointmentResponse from '../../../tests/fixtures/MockAppointmentResponse';
import { mockAppointmentSubmitApi } from '../../../tests/mocks/mockApis';

const initialStateVAOSService = {
  featureToggles: {
    vaOnlineSchedulingCancel: true,
  },
};

describe('VAOS Page: ReviewPage CC request with VAOS service', () => {
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
        facilityType: FACILITY_TYPES.COMMUNITY_CARE.id,
        typeOfCareId: TYPE_OF_CARE_IDS.PRIMARY_CARE,
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
  });

  it('should submit successfully', async () => {
    const store = createTestStore(defaultState);

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
          start: '2020-05-25T00:00:00Z',
          end: '2020-05-25T11:59:00Z',
        },
        {
          start: '2020-05-26T12:00:00Z',
          end: '2020-05-26T23:59:00Z',
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
    const tomorrow = addDays(startOfDay(new Date()), 2);
    const store = createTestStore({
      ...defaultState,
      newAppointment: {
        ...defaultState.newAppointment,
        data: {
          ...defaultState.newAppointment.data,
          selectedDates: [
            format(tomorrow, DATE_FORMATS.ISODateTime),
            format(tomorrow, DATE_FORMATS.ISODateTime),
          ],
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

    expect(global.window.dataLayer[1]).to.deep.include({
      event: 'vaos-community-care-submission-successful',
      flow: 'cc-request',
      'health-TypeOfCare': 'Primary care',
      'vaos-community-care-preferred-language': 'english',
      'vaos-number-of-preferred-providers': 1,
      'vaos-number-of-days-from-preference': '1-1-null',
      'vaos-preferred-combination': 'afternoon-evening-morning',
    });
  });

  it('should show error message on failure', async () => {
    const tomorrow = addDays(startOfDay(new Date()), 2);
    const store = createTestStore({
      ...defaultState,
      newAppointment: {
        ...defaultState.newAppointment,
        data: {
          ...defaultState.newAppointment.data,
          selectedDates: [
            format(tomorrow, DATE_FORMATS.ISODateTime),
            format(tomorrow, DATE_FORMATS.ISODateTime),
          ],
        },
      },
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
      'We’re sorry. There’s a problem with our system. Refresh this page to start over or try again later.',
    );
    expect(screen.baseElement).contain.text(
      'If you need to schedule now, call your VA facility.',
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
      'vaos-community-care-preferred-language': 'english',
      'vaos-number-of-preferred-providers': 1,
      'vaos-number-of-days-from-preference': '1-1-null',
      'vaos-preferred-combination': 'afternoon-evening-morning',
    });
  });
});
