import { mockFetch } from '@department-of-veterans-affairs/platform-testing/helpers';
import { expect } from 'chai';
import MockDate from 'mockdate';
import { within } from '@testing-library/dom';
import { format, addDays, subDays } from 'date-fns';
import React from 'react';
import reducers from '../../../redux/reducer';
import { mockVAOSAppointmentsFetch } from '../../../tests/mocks/helpers';
import { getVAOSRequestMock } from '../../../tests/mocks/mock';
import {
  getTestDate,
  renderWithStoreAndRouter,
} from '../../../tests/mocks/setup';
import RequestedAppointmentsPage from './RequestedAppointmentsPage';

const initialStateVAOSService = {
  featureToggles: {
    vaOnlineSchedulingCancel: true,
    vaOnlineSchedulingVAOSServiceRequests: true,
    vaOnlineSchedulingFeSourceOfTruth: true,
    vaOnlineSchedulingFeSourceOfTruthVA: true,
  },
};

describe('VAOS Component: RequestedAppointmentsPage', () => {
  beforeEach(() => {
    mockFetch();
    MockDate.set(getTestDate());
  });

  afterEach(() => {
    MockDate.reset();
  });
  const now = new Date();
  const startDate = now;
  it('should show va request', async () => {
    // Given a veteran has VA appointment request

    const appointment = getVAOSRequestMock();
    appointment.id = '1234';
    appointment.attributes = {
      ...appointment.attributes,
      comment: 'A message from the patient',
      contact: {
        telecom: [
          { type: 'phone', value: '2125551212' },
          { type: 'email', value: 'veteranemailtest@va.gov' },
        ],
      },
      kind: 'clinic',
      locationId: '983',
      location: {
        id: '983',
        type: 'appointments',
        attributes: {
          id: '983',
          vistaSite: '983',
          name: 'Cheyenne VA Medical Center',
          lat: 39.744507,
          long: -104.830956,
          phone: { main: '307-778-7550' },
        },
      },
      id: '1234',
      preferredTimesForPhoneCall: ['Morning'],
      reasonCode: {
        coding: [{ code: 'Routine Follow-up' }],
        text: 'A message from the patient',
      },
      requestedPeriods: [
        {
          start: format(addDays(startDate, 3), "yyyy-MM-dd'T'HH:mm:ssXXX"),
        },
        {
          start: format(addDays(startDate, 4), "yyyy-MM-dd'T'HH:mm:ssXXX"),
        },
      ],
      serviceType: '323',
      start: null,
      status: 'proposed',
      pending: true,
    };

    // And developer is using the v2 API
    mockVAOSAppointmentsFetch({
      start: format(subDays(now, 120), 'yyyy-MM-dd'),
      end: format(addDays(now, 2), 'yyyy-MM-dd'),
      statuses: ['proposed', 'cancelled'],
      requests: [appointment],
    });

    // When veteran selects the Requested dropdown selection
    const screen = renderWithStoreAndRouter(<RequestedAppointmentsPage />, {
      initialState: initialStateVAOSService,
      reducers,
    });
    // Then it should display the requested appointments
    expect(await screen.findByText('Primary care')).to.be.ok;
    expect(await screen.findByText('Cheyenne VA Medical Center')).to.be.ok;
    expect(screen.queryByText(/You don’t have any appointments/i)).not.to.exist;
    expect(screen.baseElement).to.contain.text(
      'Appointments that you request will show here until staff review and schedule them.',
    );
  });

  it('should show cc request', async () => {
    // Given a veteran has CC appointment request
    // practitioners.id is same as practitioners.identifier

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
      locationId: '983GC',
      id: '1234',
      practitioners: [{ id: [{ value: '123' }] }],
      preferredTimesForPhoneCall: ['Morning'],
      reasonCode: {
        coding: [{ code: 'Routine Follow-up' }],
        text: 'A message from the patient',
      },
      requestedPeriods: [
        {
          start: format(addDays(startDate, 3), "yyyy-MM-dd'T'HH:mm:ssXXX"),
        },
        {
          start: format(addDays(startDate, 4), "yyyy-MM-dd'T'HH:mm:ssXXX"),
        },
      ],
      serviceType: '203',
      status: 'proposed',
      pending: true,
    };

    // And developer is using the v2 API
    mockVAOSAppointmentsFetch({
      start: format(subDays(now, 120), 'yyyy-MM-dd'),
      end: format(addDays(now, 2), 'yyyy-MM-dd'),
      statuses: ['proposed', 'cancelled'],
      requests: [ccAppointmentRequest],
    });
    // When veteran selects the Requested dropdown selection
    const screen = renderWithStoreAndRouter(<RequestedAppointmentsPage />, {
      initialState: initialStateVAOSService,
      reducers,
    });

    expect(await screen.findByText('Audiology and speech')).to.be.ok;
    expect(screen.baseElement).to.contain.text('Community care');
    expect(screen.queryByText(/You don’t have any appointments/i)).not.to.exist;
    expect(screen.baseElement).to.contain.text(
      'Appointments that you request will show here until staff review and schedule them.',
    );
  });
  it('should display pending and canceled appointments grouped', async () => {
    // And a veteran has VA appointment request
    const appointment = getVAOSRequestMock();
    appointment.id = '1234';
    appointment.attributes = {
      ...appointment.attributes,
      comment: 'A message from the patient',
      contact: {
        telecom: [
          { type: 'phone', value: '2125551212' },
          { type: 'email', value: 'veteranemailtest@va.gov' },
        ],
      },
      kind: 'clinic',
      locationId: '983',
      location: {
        id: '983',
        type: 'appointments',
        attributes: {
          id: '983',
          vistaSite: '983',
          name: 'Cheyenne VA Medical Center',
          lat: 39.744507,
          long: -104.830956,
          phone: { main: '307-778-7550' },
          physicalAddress: {
            line: ['2360 East Pershing Boulevard'],
            city: 'Cheyenne',
            state: 'WY',
            postalCode: '82001-5356',
          },
        },
      },

      id: '1234',
      preferredTimesForPhoneCall: ['Morning'],
      reasonCode: {
        coding: [{ code: 'Routine Follow-up' }],
        text: 'A message from the patient',
      },
      requestedPeriods: [
        {
          start: format(addDays(startDate, 3), "yyyy-MM-dd'T'HH:mm:ssXXX"),
        },
        {
          start: format(addDays(startDate, 4), "yyyy-MM-dd'T'HH:mm:ssXXX"),
        },
      ],
      serviceType: '323',
      start: null,
      status: 'proposed',
      pending: true,
    };
    const canceledAppointment = {
      ...appointment,
      attributes: {
        ...appointment.attributes,
        serviceType: '160',
        status: 'cancelled',
      },
    };

    // And developer is using the v2 API
    mockVAOSAppointmentsFetch({
      start: format(subDays(now, 120), 'yyyy-MM-dd'),
      end: format(addDays(now, 2), 'yyyy-MM-dd'),
      statuses: ['proposed', 'cancelled'],
      requests: [appointment, canceledAppointment],
    });

    // When veteran selects requested appointments
    const screen = renderWithStoreAndRouter(<RequestedAppointmentsPage />, {
      initialState: {
        ...initialStateVAOSService,
      },
      reducers,
    });

    // Then it should display the requested appointments
    expect(await screen.findByText('Primary care')).to.be.ok;

    // And it should display the cancelled appointments
    expect(screen.getByRole('heading', { level: 2, name: 'Canceled requests' }))
      .to.be.ok;
    expect(screen.getByText('These appointment requests have been canceled.'))
      .to.be.ok;
  });
  it('should display request sorted by create date in descending order', async () => {
    // Given a veteran has VA appointment request

    const appointment = getVAOSRequestMock();
    appointment.id = '1234';
    appointment.attributes = {
      ...appointment.attributes,
      comment: 'A message from the patient',
      contact: {
        telecom: [
          { type: 'phone', value: '2125551212' },
          { type: 'email', value: 'veteranemailtest@va.gov' },
        ],
      },
      kind: 'clinic',
      locationId: '983',
      location: {
        id: '983',
        type: 'appointments',
        attributes: {
          id: '983',
          vistaSite: '983',
          name: 'Cheyenne VA Medical Center',
          lat: 39.744507,
          long: -104.830956,
          phone: { main: '307-778-7550' },
          physicalAddress: {
            line: ['2360 East Pershing Boulevard'],
            city: 'Cheyenne',
            state: 'WY',
            postalCode: '82001-5356',
          },
        },
      },

      id: '1234',
      preferredTimesForPhoneCall: ['Morning'],
      reasonCode: {
        coding: [{ code: 'Routine Follow-up' }],
        text: 'A message from the patient',
      },
      requestedPeriods: [
        {
          start: format(addDays(now, 3), "yyyy-MM-dd'T'HH:mm:ssXXX"),
        },
        {
          start: format(addDays(now, 4), "yyyy-MM-dd'T'HH:mm:ssXXX"),
        },
      ],
      serviceType: 'primaryCare',
      start: null,
      status: 'proposed',
      created: format(subDays(now, 60), "yyyy-MM-dd'T'HH:mm:ss"),
      pending: true,
    };
    const appointment2 = {
      ...appointment,
      attributes: {
        ...appointment.attributes,
        created: format(subDays(now, 30), "yyyy-MM-dd'T'HH:mm:ss"),
        serviceType: 'audiology',
      },
    };
    const appointment3 = {
      ...appointment,
      attributes: {
        ...appointment.attributes,
        created: format(now, "yyyy-MM-dd'T'HH:mm:ss"),
        serviceType: 'optometry',
      },
    };

    // And developer is using the v2 API
    mockVAOSAppointmentsFetch({
      start: format(subDays(now, 120), 'yyyy-MM-dd'),
      end: format(addDays(now, 2), 'yyyy-MM-dd'),
      statuses: ['proposed', 'cancelled'],
      requests: [appointment, appointment2, appointment3],
    });

    // When veteran selects the Requested dropdown selection
    const screen = renderWithStoreAndRouter(<RequestedAppointmentsPage />, {
      initialState: initialStateVAOSService,
      reducers,
    });

    // Then it should display the requested appointments sorted by create date in decending order.
    expect(await screen.findByText('Primary care')).to.be.ok;

    const links = screen.getAllByRole('listitem');
    expect(links.length).to.equal(3);
    expect(within(links[0]).getByText('Optometry')).to.be.ok;
    expect(within(links[1]).getByText('Audiology and speech')).to.be.ok;
    expect(within(links[2]).getByText('Primary care')).to.be.ok;
  });

  it('should display pending appointments when there are no canceled appointments', async () => {
    // And a veteran has VA appointment request
    const appointment = getVAOSRequestMock();
    appointment.id = '1234';
    appointment.attributes = {
      ...appointment.attributes,
      comment: 'A message from the patient',
      contact: {
        telecom: [
          { type: 'phone', value: '2125551212' },
          { type: 'email', value: 'veteranemailtest@va.gov' },
        ],
      },
      kind: 'clinic',
      locationId: '983',
      location: {
        id: '983',
        type: 'appointments',
        attributes: {
          id: '983',
          vistaSite: '983',
          name: 'Cheyenne VA Medical Center',
          lat: 39.744507,
          long: -104.830956,
          phone: { main: '307-778-7550' },
          physicalAddress: {
            line: ['2360 East Pershing Boulevard'],
            city: 'Cheyenne',
            state: 'WY',
            postalCode: '82001-5356',
          },
        },
      },

      id: '1234',
      preferredTimesForPhoneCall: ['Morning'],
      reasonCode: {
        coding: [{ code: 'Routine Follow-up' }],
        text: 'A message from the patient',
      },
      requestedPeriods: [
        {
          start: format(addDays(now, 3), "yyyy-MM-dd'T'HH:mm:ssXXX"),
        },
        {
          start: format(addDays(now, 4), "yyyy-MM-dd'T'HH:mm:ssXXX"),
        },
      ],
      serviceType: '323',
      start: null,
      status: 'proposed',
      pending: true,
    };

    // And developer is using the v2 API
    mockVAOSAppointmentsFetch({
      start: format(subDays(now, 120), 'yyyy-MM-dd'),
      end: format(addDays(now, 2), 'yyyy-MM-dd'),
      statuses: ['proposed', 'cancelled'],
      requests: [appointment],
    });

    // When veteran selects requested appointments
    const screen = renderWithStoreAndRouter(<RequestedAppointmentsPage />, {
      initialState: {
        ...initialStateVAOSService,
      },
      reducers,
    });

    // Then it should display the requested appointments
    expect(await screen.findByText('Primary care')).to.be.ok;

    // And cancelled appointments should not be displayed
    expect(
      screen.queryByRole('heading', { level: 2, name: 'Canceled requests' }),
    ).not.to.be.ok;
    expect(screen.queryByText('These appointment requests have been canceled.'))
      .not.to.be.ok;

    // And the no appointments alert message should not be displayed
    expect(
      screen.queryByRole('heading', {
        level: 3,
        name: /You don’t have any/,
      }),
    ).not.to.be.ok;
  });

  it('should display no appointments alert when there are no pending or cancelled appointments', async () => {
    // And a veteran has no pending or canceled appointment request
    // And developer is using the v2 API
    mockVAOSAppointmentsFetch({
      start: format(subDays(new Date(), 120), 'yyyy-MM-dd'),
      end: format(addDays(new Date(), 2), 'yyyy-MM-dd'),
      statuses: ['proposed', 'cancelled'],
      requests: [{}],
    });

    // When veteran selects requested appointments
    const screen = renderWithStoreAndRouter(<RequestedAppointmentsPage />, {
      initialState: {
        ...initialStateVAOSService,
      },
      reducers,
    });

    // Then it should display the no appointments alert message
    expect(
      await screen.findByRole('heading', {
        level: 2,
        name: /You don’t have any/,
      }),
    ).to.be.ok;
  });

  it('should display no appointments alert when there are no pending but cancelled appointments', async () => {
    // And a veteran has VA appointment request
    const appointment = getVAOSRequestMock();
    appointment.id = '1234';
    appointment.attributes = {
      ...appointment.attributes,
      comment: 'A message from the patient',
      contact: {
        telecom: [
          { type: 'phone', value: '2125551212' },
          { type: 'email', value: 'veteranemailtest@va.gov' },
        ],
      },
      kind: 'clinic',
      locationId: '983',
      location: {
        id: '983',
        type: 'appointments',
        attributes: {
          id: '983',
          vistaSite: '983',
          name: 'Cheyenne VA Medical Center',
          lat: 39.744507,
          long: -104.830956,
          phone: { main: '307-778-7550' },
          physicalAddress: {
            line: ['2360 East Pershing Boulevard'],
            city: 'Cheyenne',
            state: 'WY',
            postalCode: '82001-5356',
          },
        },
      },

      id: '1234',
      preferredTimesForPhoneCall: ['Morning'],
      reasonCode: {
        coding: [{ code: 'Routine Follow-up' }],
        text: 'A message from the patient',
      },
      requestedPeriods: [
        {
          start: format(addDays(now, 3), "yyyy-MM-dd'T'HH:mm:ssXXX"),
        },
        {
          start: format(addDays(now, 4), "yyyy-MM-dd'T'HH:mm:ssXXX"),
        },
      ],
      serviceType: '323',
      start: null,
      status: 'cancelled',
      pending: true,
    };

    // And developer is using the v2 API
    mockVAOSAppointmentsFetch({
      start: format(subDays(now, 120), 'yyyy-MM-dd'),
      end: format(addDays(now, 2), 'yyyy-MM-dd'),
      statuses: ['proposed', 'cancelled'],
      requests: [appointment],
    });

    // When veteran selects requested appointments
    const screen = renderWithStoreAndRouter(<RequestedAppointmentsPage />, {
      initialState: {
        ...initialStateVAOSService,
      },
      reducers,
    });

    // Then it should display the requested appointments
    expect(
      await screen.findByRole('heading', {
        level: 2,
        name: 'Canceled requests',
      }),
    ).to.be.ok;
    expect(screen.getByText('These appointment requests have been canceled.'))
      .to.be.ok;

    // And it should display the no appointments alert message
    expect(
      screen.getByRole('heading', {
        level: 2,
        name: /You don’t have any/,
      }),
    ).to.be.ok;
  });
  it('should show error message when request fails', async () => {
    mockVAOSAppointmentsFetch({ error: true });

    const screen = renderWithStoreAndRouter(<RequestedAppointmentsPage />, {
      initialState: initialStateVAOSService,
      reducers,
    });

    expect(
      await screen.findByText(
        /We’re having trouble getting your appointment requests/i,
      ),
    ).to.be.ok;
  });

  describe('When FE Source of Truth is off', () => {
    const defaultState = {
      featureToggles: {
        ...initialStateVAOSService.featureToggles,
        vaOnlineSchedulingFeSourceOfTruth: false,
        vaOnlineSchedulingFeSourceOfTruthVA: true,
      },
    };

    it('should show va request', async () => {
      // Given a veteran has VA appointment request
      const appointment = getVAOSRequestMock();
      appointment.id = '1234';
      appointment.attributes = {
        ...appointment.attributes,
        comment: 'A message from the patient',
        contact: {
          telecom: [
            { type: 'phone', value: '2125551212' },
            { type: 'email', value: 'veteranemailtest@va.gov' },
          ],
        },
        kind: 'clinic',
        locationId: '983',
        location: {
          id: '983',
          type: 'appointments',
          attributes: {
            id: '983',
            vistaSite: '983',
            name: 'Cheyenne VA Medical Center',
            lat: 39.744507,
            long: -104.830956,
            phone: { main: '307-778-7550' },
          },
        },
        id: '1234',
        preferredTimesForPhoneCall: ['Morning'],
        reasonCode: {
          coding: [{ code: 'Routine Follow-up' }],
          text: 'A message from the patient',
        },
        requestedPeriods: [
          {
            start: format(addDays(startDate, 3), "yyyy-MM-dd'T'HH:mm:ssXXX"),
          },
          {
            start: format(addDays(startDate, 4), "yyyy-MM-dd'T'HH:mm:ssXXX"),
          },
        ],
        serviceType: '323',
        start: null,
        status: 'proposed',
      };
      // And developer is using the v2 API
      mockVAOSAppointmentsFetch({
        start: format(subDays(new Date(), 120), 'yyyy-MM-dd'),
        end: format(addDays(new Date(), 2), 'yyyy-MM-dd'),
        statuses: ['proposed', 'cancelled'],
        requests: [appointment],
      });

      // When veteran selects the Requested dropdown selection
      const screen = renderWithStoreAndRouter(<RequestedAppointmentsPage />, {
        initialState: defaultState,
        reducers,
      });
      // Then it should display the requested appointments
      expect(await screen.findByText('Primary care')).to.be.ok;
      expect(await screen.findByText('Cheyenne VA Medical Center')).to.be.ok;
      expect(screen.queryByText(/You don’t have any appointments/i)).not.to
        .exist;
      expect(screen.baseElement).to.contain.text(
        'Appointments that you request will show here until staff review and schedule them.',
      );
    });
  });
});
