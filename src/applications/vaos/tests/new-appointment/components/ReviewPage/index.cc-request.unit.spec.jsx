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
  mockFacilityFetch,
  mockMessagesFetch,
  mockPreferences,
  mockRequestSubmit,
} from '../../../mocks/helpers';
import { getVAFacilityMock } from '../../../mocks/v0';

const initialState = {
  featureToggles: {
    vaOnlineSchedulingCancel: true,
    // eslint-disable-next-line camelcase
    show_new_schedule_view_appointments_page: true,
  },
};

describe('VAOS <ReviewPage> CC request', () => {
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
          facilityType: FACILITY_TYPES.COMMUNITY_CARE,
          typeOfCareId: '323',
          phoneNumber: '1234567890',
          email: 'joeblow@gmail.com',
          reasonAdditionalInfo: 'I need an appt',
          communityCareSystemId: '983',
          preferredLanguage: 'english',
          hasCommunityCareProvider: true,
          communityCareProvider: {
            practiceName: 'Community medical center',
            firstName: 'Jane',
            lastName: 'Doe',
            address: {
              street: '123 big sky st',
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
            identifier: [
              { system: 'urn:oid:2.16.840.1.113883.6.233', value: '983' },
              {
                system: 'http://med.va.gov/fhir/urn',
                value: 'urn:va:facility:983',
              },
            ],
          },
        ],
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
        facilities: {},
      },
    });
    store.dispatch(startRequestAppointmentFlow());
    store.dispatch(
      onCalendarChange([start.format('YYYY-MM-DD[T00:00:00.000]')]),
    );
  });
  afterEach(() => resetFetch());

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
    expect(screen.baseElement).to.contain.text('Jane Doe');
    expect(screen.baseElement).to.contain.text('123 big sky st');
    expect(screen.baseElement).to.contain.text('Bozeman, MT 59715');

    expect(additionalHeading).to.contain.text('Additional details');
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
        '/new-appointment/confirmation',
      );
    });
    const submitData = JSON.parse(global.fetch.getCall(0).args[1].body);

    expect(submitData.facility.facilityCode).to.equal('983');
    expect(submitData.facility.parentSiteCode).to.equal('983');
    expect(submitData.typeOfCareId).to.equal('CCPRMYRTNE');

    const messageData = JSON.parse(global.fetch.getCall(1).args[1].body);
    expect(messageData.messageText).to.equal('I need an appt');

    const preferences = JSON.parse(global.fetch.getCall(3).args[1].body);
    expect(preferences.emailAddress).to.equal('joeblow@gmail.com');

    const dataLayer = global.window.dataLayer;
    expect(dataLayer[1]).to.deep.equal({
      event: 'vaos-community-care-submission',
      'health-TypeOfCare': 'Primary care',
      'health-ReasonForAppointment': undefined,
      'vaos-number-of-preferred-providers': 1,
      'vaos-community-care-preferred-language': 'english',
      flow: 'cc-request',
    });
  });

  it('should show error message on failure', async () => {
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
      'Something went wrong when we tried to submit your request and you’ll need to start over. We suggest you wait a day',
    );

    expect(screen.history.push.called).to.be.false;
  });
});

describe('VAOS <ReviewPage> CC request with provider selection', () => {
  let store;
  let start;

  beforeEach(() => {
    mockFetch();
    start = moment();
    store = createTestStore({
      featureToggles: {
        vaOnlineSchedulingProviderSelection: true,
      },
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
            identifier: [
              { system: 'urn:oid:2.16.840.1.113883.6.233', value: '983' },
              {
                system: 'http://med.va.gov/fhir/urn',
                value: 'urn:va:facility:983',
              },
            ],
          },
        ],
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
  afterEach(() => resetFetch());

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
    expect(screen.baseElement).to.contain.text('WASHINGTON, DC 20005-3477');

    expect(additionalHeading).to.contain.text('Additional details');
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
        '/new-appointment/confirmation',
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
      'Something went wrong when we tried to submit your request and you’ll need to start over. We suggest you wait a day',
    );

    expect(screen.history.push.called).to.be.false;
  });
});
