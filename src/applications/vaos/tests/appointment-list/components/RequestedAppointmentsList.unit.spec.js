import React from 'react';
import MockDate from 'mockdate';
import { expect } from 'chai';
import moment from 'moment';
import { mockFetch } from '@department-of-veterans-affairs/platform-testing/helpers';
import { within } from '@testing-library/dom';
import reducers from '../../../redux/reducer';
import { getVAOSRequestMock } from '../../mocks/v2';
import { mockVAOSAppointmentsFetch } from '../../mocks/helpers.v2';
import { renderWithStoreAndRouter, getTestDate } from '../../mocks/setup';
import RequestedAppointmentsList from '../../../appointment-list/components/RequestedAppointmentsList';

const initialState = {
  featureToggles: {
    vaOnlineSchedulingCancel: true,
  },
};

const initialStateVAOSService = {
  featureToggles: {
    vaOnlineSchedulingCancel: true,
    vaOnlineSchedulingVAOSServiceRequests: true,
  },
};

describe('VAOS Component: RequestedAppointmentsList with the VAOS service', () => {
  beforeEach(() => {
    mockFetch();
    MockDate.set(getTestDate());
  });

  afterEach(() => {
    MockDate.reset();
  });

  it('should show va request', async () => {
    // Given a veteran has VA appointment request
    const startDate = moment.utc();
    const appointment = getVAOSRequestMock();
    appointment.id = '1234';
    appointment.attributes = {
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
          start: moment(startDate)
            .add(3, 'days')
            .format('YYYY-MM-DDTHH:mm:ss[Z]'),
        },
        {
          start: moment(startDate)
            .add(4, 'days')
            .format('YYYY-MM-DDTHH:mm:ss[Z]'),
        },
      ],
      serviceType: '323',
      start: null,
      status: 'proposed',
    };
    // And developer is using the v2 API
    mockVAOSAppointmentsFetch({
      start: moment()
        .subtract(120, 'days')
        .format('YYYY-MM-DD'),
      end: moment()
        .add(1, 'days')
        .format('YYYY-MM-DD'),
      statuses: ['proposed', 'cancelled'],
      requests: [appointment],
    });

    // When veteran selects the Requested dropdown selection
    const screen = renderWithStoreAndRouter(<RequestedAppointmentsList />, {
      initialState: initialStateVAOSService,
      reducers,
    });
    // Then it should display the requested appointments
    expect(await screen.findByText('Primary care')).to.be.ok;
    expect(await screen.findByText('Cheyenne VA Medical Center')).to.be.ok;
    expect(screen.queryByText(/You don’t have any appointments/i)).not.to.exist;
    expect(screen.baseElement).to.contain.text(
      'Your appointment requests that haven’t been scheduled yet.',
    );
  });

  it('should show cc request', async () => {
    // Given a veteran has CC appointment request
    // TODO: practitioners.id is same as practitioners.identifier
    const startDate = moment.utc();
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
          start: moment(startDate)
            .add(3, 'days')
            .format('YYYY-MM-DDTHH:mm:ss[Z]'),
        },
        {
          start: moment(startDate)
            .add(4, 'days')
            .format('YYYY-MM-DDTHH:mm:ss[Z]'),
        },
      ],
      serviceType: '203',
      status: 'proposed',
    };
    // And developer is using the v2 API
    mockVAOSAppointmentsFetch({
      start: moment()
        .subtract(120, 'days')
        .format('YYYY-MM-DD'),
      end: moment()
        .add(1, 'days')
        .format('YYYY-MM-DD'),
      statuses: ['proposed', 'cancelled'],
      requests: [ccAppointmentRequest],
    });
    // When veteran selects the Requested dropdown selection
    const screen = renderWithStoreAndRouter(<RequestedAppointmentsList />, {
      initialState: initialStateVAOSService,
      reducers,
    });

    expect(await screen.findByText('Audiology and speech')).to.be.ok;
    expect(screen.baseElement).to.contain.text('Community care');
    expect(screen.queryByText(/You don’t have any appointments/i)).not.to.exist;
    expect(screen.baseElement).to.contain.text(
      'Your appointment requests that haven’t been scheduled yet.',
    );
  });

  // Then it should display the requested appointments
  it('should show error message when request fails', async () => {
    mockVAOSAppointmentsFetch({ error: true });

    const screen = renderWithStoreAndRouter(<RequestedAppointmentsList />, {
      initialState: initialStateVAOSService,
      reducers,
    });

    expect(
      await screen.findByText(
        /We’re having trouble getting your appointment requests/i,
      ),
    ).to.be.ok;
  });

  it('should display request sorted by create date in decending order', async () => {
    // Given a veteran has VA appointment request
    const startDate = moment.utc();
    const appointment = getVAOSRequestMock();
    appointment.id = '1234';
    appointment.attributes = {
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
          start: moment(startDate)
            .add(3, 'days')
            .format('YYYY-MM-DDTHH:mm:ss[Z]'),
        },
        {
          start: moment(startDate)
            .add(4, 'days')
            .format('YYYY-MM-DDTHH:mm:ss[Z]'),
        },
      ],
      serviceType: '323',
      start: null,
      status: 'proposed',
      created: moment()
        .subtract(2, 'months')
        .format('YYYY-MM-DDTHH:mm:ss'),
    };
    const appointment2 = {
      ...appointment,
      attributes: {
        ...appointment.attributes,
        created: moment()
          .clone()
          .subtract(1, 'month')
          .format('YYYY-MM-DDTHH:mm:ss'),
        serviceType: '160',
      },
    };
    const appointment3 = {
      ...appointment,
      attributes: {
        ...appointment.attributes,
        created: moment().format('YYYY-MM-DDTHH:mm:ss'),
        serviceType: '408',
      },
    };

    // And developer is using the v2 API
    mockVAOSAppointmentsFetch({
      start: moment()
        .subtract(120, 'days')
        .format('YYYY-MM-DD'),
      end: moment()
        .add(1, 'days')
        .format('YYYY-MM-DD'),
      statuses: ['proposed', 'cancelled'],
      requests: [appointment, appointment2, appointment3],
    });

    // When veteran selects the Requested dropdown selection
    const screen = renderWithStoreAndRouter(<RequestedAppointmentsList />, {
      initialState: initialStateVAOSService,
      reducers,
    });

    // Then it should display the requested appointments sorted by create date in decending order.
    expect(await screen.findByText('Primary care')).to.be.ok;

    const links = screen.getAllByRole('listitem');
    expect(links.length).to.equal(3);
    expect(within(links[0]).getByText('Optometry')).to.be.ok;
    expect(within(links[1]).getByText('Pharmacy')).to.be.ok;
    expect(within(links[2]).getByText('Primary care')).to.be.ok;
  });

  it('should show cc request and provider facility name if available', async () => {
    const appointment = getVAOSRequestMock();
    appointment.id = '1';
    appointment.attributes = {
      id: '1',
      kind: 'cc',
      locationId: '983',
      requestedPeriods: [{}],
      serviceType: 'audiology',
      status: 'pending',
    };

    mockVAOSAppointmentsFetch({
      start: moment()
        .subtract(1, 'month')
        .format('YYYY-MM-DD'),
      end: moment()
        .add(395, 'days')
        .format('YYYY-MM-DD'),
      statuses: ['booked', 'arrived', 'fulfilled', 'cancelled'],
      requests: [appointment],
    });
    mockVAOSAppointmentsFetch({
      start: moment()
        .subtract(120, 'days')
        .format('YYYY-MM-DD'),
      end: moment().format('YYYY-MM-DD'),
      statuses: ['proposed', 'cancelled'],
      requests: [appointment],
    });

    const screen = renderWithStoreAndRouter(<RequestedAppointmentsList />, {
      initialState,
      reducers,
    });

    expect(await screen.findByText('Audiology and speech')).to.be.ok;
    expect(screen.baseElement).to.contain.text('Community care');
    expect(screen.queryByText(/You don’t have any appointments/i)).not.to.exist;
  });

  it('should not show resolved requests', async () => {
    const appointment = getVAOSRequestMock();
    appointment.id = '1';
    appointment.attributes = {
      id: '1',
      kind: 'clinic',
      locationId: '983',
      requestedPeriods: [{}],
      serviceType: 'primaryCare',
      status: 'fulfilled',
    };

    mockVAOSAppointmentsFetch({
      start: moment()
        .subtract(1, 'month')
        .format('YYYY-MM-DD'),
      end: moment()
        .add(395, 'days')
        .format('YYYY-MM-DD'),
      statuses: ['booked', 'arrived', 'fulfilled', 'cancelled'],
      requests: [appointment],
    });
    mockVAOSAppointmentsFetch({
      start: moment()
        .subtract(120, 'days')
        .format('YYYY-MM-DD'),
      end: moment().format('YYYY-MM-DD'),
      statuses: ['proposed', 'cancelled'],
      requests: [appointment],
    });

    const screen = renderWithStoreAndRouter(<RequestedAppointmentsList />, {
      initialState,
      reducers,
    });

    expect(await screen.findByText(/You don’t have any appointment requests/i))
      .to.exist;
  });
});
