import React from 'react';
import MockDate from 'mockdate';
import { expect } from 'chai';
import moment from 'moment';
import { fireEvent, waitFor } from '@testing-library/react';
import { mockFetch } from '@department-of-veterans-affairs/platform-testing/helpers';

import { mockCCSingleProviderFetch } from '../../../tests/mocks/helpers';
import { mockSingleVAOSRequestFetch } from '../../../tests/mocks/helpers.v2';

import { AppointmentList } from '../..';
import {
  getTestDate,
  renderWithStoreAndRouter,
} from '../../../tests/mocks/setup';
import { getVAOSRequestMock } from '../../../tests/mocks/v2';
import { createMockFacilityByVersion } from '../../../tests/mocks/data';
import { mockFacilityFetchByVersion } from '../../../tests/mocks/fetch';

const testDate = getTestDate();

const initialStateVAOSService = {
  featureToggles: {
    vaOnlineSchedulingVAOSServiceRequests: true,
    vaOnlineSchedulingVAOSServiceCCAppointments: true,
  },
};

describe('VAOS <RequestedAppointmentDetailsPage> with VAOS service', () => {
  beforeEach(() => {
    mockFetch();
    MockDate.set(testDate);
  });

  afterEach(() => {
    MockDate.reset();
  });

  it('should display new appointment confirmation alert for VA request', async () => {
    const appointment = getVAOSRequestMock();
    appointment.id = '1234';
    appointment.attributes = {
      contact: {
        telecom: [
          { type: 'phone', value: '2125551212' },
          { type: 'email', value: 'veteranemailtest@va.gov' },
        ],
      },
      kind: 'clinic',
      locationId: '983GC',
      id: '1234',
      preferredTimesForPhoneCall: ['Morning'],
      reasonCode: {
        coding: [{ code: 'New Problem' }],
        text: 'A message from the patient',
      },
      requestedPeriods: [
        {
          start: moment(testDate)
            .add(3, 'days')
            .format('YYYY-MM-DDTHH:mm:ss[Z]'),
        },
        {
          start: moment(testDate)
            .add(4, 'days')
            .format('YYYY-MM-DDTHH:mm:ss[Z]'),
        },
      ],
      serviceType: '323',
      start: null,
      status: 'proposed',
    };

    // mock using vaos service
    mockSingleVAOSRequestFetch({ request: appointment });

    const facility = createMockFacilityByVersion({
      id: '983GC',
      name: 'Cheyenne VA Medical Center',
      address: {
        postalCode: '82001-5356',
        city: 'Cheyenne',
        state: 'WY',
        line: ['2360 East Pershing Boulevard'],
      },
      phone: '307-778-7550',
    });

    mockFacilityFetchByVersion({ facility });

    const screen = renderWithStoreAndRouter(<AppointmentList />, {
      initialState: initialStateVAOSService,
      path: `/requests/${appointment.id}?confirmMsg=true`,
    });
    await waitFor(() => {
      expect(global.document.title).to.equal(
        `Pending VA primary care appointment`,
      );
    });
    expect(screen.baseElement).to.contain('.usa-alert-success');
    expect(screen.baseElement).to.contain.text(
      'Your appointment request has been submitted. We will review your request and contact you to schedule the first available appointment.',
    );

    expect(screen.queryByTestId('review-appointments-link')).to.exist;
    expect(screen.queryByTestId('schedule-appointment-link')).to.exist;

    fireEvent.click(screen.queryByTestId('review-appointments-link'));
    expect(window.dataLayer[0]).to.deep.equal({
      event: 'vaos-view-your-appointments-button-clicked',
    });
  });
  it('should display appointment cancellation alert for VA request', async () => {
    const appointment = getVAOSRequestMock();
    appointment.id = '1234';
    appointment.attributes = {
      contact: {
        telecom: [
          { type: 'phone', value: '2125551212' },
          { type: 'email', value: 'veteranemailtest@va.gov' },
        ],
      },
      kind: 'clinic',
      locationId: '983GC',
      id: '1234',
      preferredTimesForPhoneCall: ['Morning'],
      reasonCode: {
        coding: [{ code: 'New Problem' }],
        text: 'A message from the patient',
      },
      requestedPeriods: [
        {
          start: moment(testDate)
            .add(3, 'days')
            .format('YYYY-MM-DDTHH:mm:ss[Z]'),
        },
        {
          start: moment(testDate)
            .add(4, 'days')
            .format('YYYY-MM-DDTHH:mm:ss[Z]'),
        },
      ],
      serviceType: '323',
      start: null,
      status: 'cancelled',
      cancelationReason: {
        coding: [
          {
            code: 'pat',
          },
        ],
      },
    };

    // mock using vaos service
    mockSingleVAOSRequestFetch({ request: appointment });

    const facility = createMockFacilityByVersion({
      id: '983GC',
      name: 'Cheyenne VA Medical Center',
      address: {
        postalCode: '82001-5356',
        city: 'Cheyenne',
        state: 'WY',
        line: ['2360 East Pershing Boulevard'],
      },
      phone: '307-778-7550',
    });

    mockFacilityFetchByVersion({ facility });

    const screen = renderWithStoreAndRouter(<AppointmentList />, {
      initialState: initialStateVAOSService,
      path: `/requests/${appointment.id}`,
    });
    await waitFor(() => {
      expect(screen.baseElement).to.contain('.usa-alert-error');
    });
    expect(screen.baseElement).to.contain.text('You canceled this request');

    expect(screen.queryByTestId('review-appointments-link')).to.not.exist;
    expect(screen.queryByTestId('schedule-appointment-link')).to.not.exist;
  });
  it('should display new appointment confirmation alert for CC request', async () => {
    const ccAppointmentRequest = getVAOSRequestMock();
    ccAppointmentRequest.id = '1234';
    ccAppointmentRequest.attributes = {
      comment: 'A message from the patient',
      contact: {
        telecom: [
          { type: 'phone', value: '2125551212' },
          { type: 'email', value: 'veteranemailtest@va.gov' },
        ],
      },
      kind: 'cc',
      locationId: '983',
      id: '1234',
      practitioners: [{ identifier: [{ value: '123' }] }],
      preferredTimesForPhoneCall: ['Morning'],
      reasonCode: {
        coding: [{ code: 'New Problem' }],
        text: 'A message from the patient',
      },
      requestedPeriods: [
        {
          start: moment(testDate)
            .add(3, 'days')
            .format('YYYY-MM-DDTHH:mm:ss[Z]'),
        },
        {
          start: moment(testDate)
            .add(4, 'days')
            .format('YYYY-MM-DDTHH:mm:ss[Z]'),
        },
      ],
      serviceType: '323',
      start: null,
      status: 'proposed',
    };

    mockSingleVAOSRequestFetch({ request: ccAppointmentRequest });

    const ccProvider = {
      id: '123',
      type: 'provider',
      attributes: {
        address: {},
        caresitePhone: null,
        name: 'Atlantic Medical Care',
        lat: null,
        long: null,
        uniqueId: '123',
      },
    };

    mockCCSingleProviderFetch(ccProvider);

    const screen = renderWithStoreAndRouter(<AppointmentList />, {
      initialStateVAOSService,
      path: `/requests/${ccAppointmentRequest.id}?confirmMsg=true`,
    });

    await waitFor(() => {
      expect(global.document.title).to.equal(
        `Pending Community care primary care appointment`,
      );
    });
    expect(screen.baseElement).to.contain('.usa-alert-success');
    expect(screen.baseElement).to.contain.text(
      'Your appointment request has been submitted. We will review your request and contact you to schedule the first available appointment.',
    );
    expect(screen.queryByTestId('review-appointments-link')).to.exist;
    expect(screen.queryByTestId('schedule-appointment-link')).to.exist;

    fireEvent.click(screen.queryByTestId('schedule-appointment-link'));
    expect(window.dataLayer[1]).to.deep.equal({
      event: 'vaos-schedule-appointment-button-clicked',
    });
  });
});
