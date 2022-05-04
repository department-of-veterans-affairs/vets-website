import React from 'react';
import moment from 'moment';
import { expect } from 'chai';

import userEvent from '@testing-library/user-event';
import { waitFor } from '@testing-library/dom';
import { Route } from 'react-router-dom';

import { setFetchJSONFailure, mockFetch } from 'platform/testing/unit/helpers';
import environment from 'platform/utilities/environment';

import { FACILITY_TYPES } from '../../../../utils/constants';
import {
  createTestStore,
  renderWithStoreAndRouter,
} from '../../../mocks/setup';

import ReviewPage from '../../../../new-appointment/components/ReviewPage';
import {
  onCalendarChange,
  startRequestAppointmentFlow,
} from '../../../../new-appointment/redux/actions';
import {
  mockMessagesFetch,
  mockPreferences,
  mockRequestSubmit,
} from '../../../mocks/helpers';

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

const initialStateVAOSService = {
  featureToggles: {
    vaOnlineSchedulingCancel: true,
    // eslint-disable-next-line camelcase
    show_new_schedule_view_appointments_page: true,
    vaOnlineSchedulingVAOSServiceRequests: true,
  },
};

describe('VAOS <ReviewPage> CC request', () => {
  let store;
  let start;

  beforeEach(() => {
    const featureState = { ...initialState };
    mockFetch();

    start = moment();
    store = createTestStore({
      ...featureState,
      newAppointment: {
        pages: {},
        data: {
          facilityType: FACILITY_TYPES.COMMUNITY_CARE,
          typeOfCareId: '323',
          phoneNumber: '2345678909',
          email: 'joeblow@gmail.com',
          reasonAdditionalInfo: 'I need an appt',
          communityCareSystemId: '983',
          preferredLanguage: 'english',
          hasCommunityCareProvider: true,
          communityCareProvider: {
            name: 'Community medical center',
            firstName: 'Jane',
            lastName: 'Doe',
            address: {
              line: ['123 big sky st'],
              city: 'Bozeman',
              state: 'MT',
              postalCode: '59715',
            },
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
          },
        ],
        facilities: {},
      },
    });
    store.dispatch(startRequestAppointmentFlow());
    store.dispatch(
      onCalendarChange([start.format('YYYY-MM-DD[T00:00:00.000]')]),
    );
  });

  it('should submit successfully', async () => {
    mockRequestSubmit('cc', {
      id: 'fake_id',
    });
    mockPreferences(null);
    mockMessagesFetch('fake_id', {});

    const screen = renderWithStoreAndRouter(<Route component={ReviewPage} />, {
      store,
    });

    await screen.findByText(/requesting a community care appointment/i);

    userEvent.click(screen.getByText(/Request appointment/i));
    await waitFor(() => {
      expect(screen.history.push.lastCall.args[0]).to.equal(
        '/requests/fake_id?confirmMsg=true',
      );
    });
  });

  it('should show form information for review', async () => {
    const screen = renderWithStoreAndRouter(<ReviewPage />, {
      store,
    });

    await screen.findByText(/requesting a community care appointment/i);
    expect(screen.getByText('Primary care')).to.have.tagName('h2');
    const [
      pageHeading,
      descHeading,
      typeOfCareHeading,
      dateHeading,
      providerHeading,
      additionalHeading,
      contactHeading,
    ] = screen.getAllByRole('heading');
    expect(pageHeading).to.contain.text('Review your appointment details');
    expect(descHeading).to.contain.text(
      'requesting a community care appointment',
    );
    expect(typeOfCareHeading).to.contain.text('Primary care');
    expect(screen.baseElement).to.contain.text('Community Care');

    expect(dateHeading).to.contain.text('Preferred date and time');
    expect(screen.baseElement).to.contain.text(
      `${start.format('MMMM DD, YYYY')} in the morning`,
    );

    expect(providerHeading).to.contain.text('Preferred provider');
    expect(screen.baseElement).to.contain.text('Community medical center');
    expect(screen.baseElement).to.contain.text('123 big sky st');
    expect(screen.baseElement).to.contain.text('Bozeman, MontanaMT 59715');
    expect(screen.baseElement).to.contain.text(
      'Prefers provider to speak English',
    );

    expect(additionalHeading).to.contain.text('Additional details');
    expect(screen.baseElement).to.contain.text('I need an appt');

    expect(contactHeading).to.contain.text('Your contact details');
    expect(screen.baseElement).to.contain.text('joeblow@gmail.com');
    expect(screen.getByTestId('patient-telephone')).to.exist;
    expect(screen.baseElement).to.contain.text('Call anytime during the day');

    const editLinks = screen.getAllByText(/^Edit/, { selector: 'a' });
    const uniqueLinks = new Set();
    editLinks.forEach(link => {
      expect(link).to.have.attribute('aria-label');
      uniqueLinks.add(link.getAttribute('aria-label'));
    });
    expect(uniqueLinks.size).to.equal(editLinks.length);
  });

  it('should show error message on failure', async () => {
    mockFacilityFetchByVersion({
      facility: createMockCheyenneFacilityByVersion({
        version: 0,
      }),
      version: 0,
    });
    setFetchJSONFailure(
      global.fetch.withArgs(
        `${environment.API_URL}/vaos/v0/appointment_requests?type=cc`,
      ),
      {
        errors: [{}],
      },
    );

    const screen = renderWithStoreAndRouter(<Route component={ReviewPage} />, {
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
  });
});

describe('VAOS <ReviewPage> CC request with provider selection', () => {
  let store;
  let start;

  beforeEach(() => {
    const featureState = { ...initialState };

    mockFetch();
    start = moment();
    store = createTestStore({
      ...featureState,
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
          phoneNumber: '2234567890',
          email: 'joeblow@gmail.com',
          reasonAdditionalInfo: 'I need an appt',
          communityCareSystemId: '983',
          hasCommunityCareProvider: true,
          communityCareProvider: {
            resourceType: 'Location',
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
          '323_983': [
            {
              id: '983',
              name: 'Cheyenne VA Medical Center',
              identifier: [
                { system: 'urn:oid:2.16.840.1.113883.6.233', value: '983' },
              ],
            },
          ],
        },
      },
    });
    store.dispatch(startRequestAppointmentFlow());
    store.dispatch(
      onCalendarChange([start.format('YYYY-MM-DD[T00:00:00.000]')]),
    );
  });

  it('should show form information for review', async () => {
    const screen = renderWithStoreAndRouter(<ReviewPage />, {
      store,
    });

    await screen.findByText(/requesting a community care appointment/i);
    expect(screen.getByText('Primary care')).to.have.tagName('h2');
    const [
      pageHeading,
      descHeading,
      typeOfCareHeading,
      dateHeading,
      providerHeading,
      additionalHeading,
      contactHeading,
    ] = screen.getAllByRole('heading');
    expect(pageHeading).to.contain.text('Review your appointment details');
    expect(descHeading).to.contain.text(
      'requesting a community care appointment',
    );
    expect(typeOfCareHeading).to.contain.text('Primary care');
    expect(screen.baseElement).to.contain.text('Community Care');

    expect(dateHeading).to.contain.text('Preferred date and time');
    expect(screen.baseElement).to.contain.text(
      `${start.format('MMMM DD, YYYY')} in the morning`,
    );

    expect(providerHeading).to.contain.text('Preferred provider');
    expect(screen.baseElement).to.contain.text('CAMPBELL, WILLIAM');
    expect(screen.baseElement).to.contain.text('1012 14TH ST NW STE 700');
    expect(screen.baseElement).to.contain.text(
      'WASHINGTON, District of ColumbiaDC 20005-3477',
    );

    expect(additionalHeading).to.contain.text('Additional details');
    expect(screen.baseElement).to.contain.text('I need an appt');

    expect(contactHeading).to.contain.text('Your contact details');
    expect(screen.baseElement).to.contain.text('joeblow@gmail.com');
    expect(screen.getByTestId('patient-telephone')).to.exist;
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
    mockRequestSubmit('cc', {
      id: 'fake_id',
    });
    mockPreferences(null);
    mockMessagesFetch('fake_id', {});

    const screen = renderWithStoreAndRouter(<Route component={ReviewPage} />, {
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

    expect(submitData.facility.facilityCode).to.equal('983');
    expect(submitData.facility.parentSiteCode).to.equal('983');
    expect(submitData.typeOfCareId).to.equal('CCPRMYRTNE');
    expect(submitData.preferredProviders[0].practiceName).to.equal(
      'CAMPBELL, WILLIAM',
    );
    expect(submitData.preferredProviders[0].address).to.deep.equal({
      street: '1012 14TH ST NW STE 700',
      city: 'WASHINGTON',
      state: 'DC',
      zipCode: '20005-3477',
    });

    const messageData = JSON.parse(global.fetch.getCall(1).args[1].body);
    expect(messageData.messageText).to.equal('I need an appt');

    const preferences = JSON.parse(global.fetch.getCall(3).args[1].body);
    expect(preferences.emailAddress).to.equal('joeblow@gmail.com');
  });

  it('should show error message on failure', async () => {
    mockFacilityFetchByVersion({
      facility: createMockCheyenneFacilityByVersion({
        version: 0,
      }),
      version: 0,
    });
    setFetchJSONFailure(
      global.fetch.withArgs(
        `${environment.API_URL}/vaos/v0/appointment_requests?type=cc`,
      ),
      {
        errors: [{}],
      },
    );

    const screen = renderWithStoreAndRouter(<Route component={ReviewPage} />, {
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
  });
});

describe('VAOS <ReviewPage> CC request with VAOS service', () => {
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
    });
    mockPreferences(null);

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
      comment: 'I need an appt',
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
    });
    mockPreferences(null);

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
