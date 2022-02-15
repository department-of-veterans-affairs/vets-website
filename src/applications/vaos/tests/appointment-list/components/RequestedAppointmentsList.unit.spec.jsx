import React from 'react';
import MockDate from 'mockdate';
import { expect } from 'chai';
import moment from 'moment';
import environment from 'platform/utilities/environment';
import { mockFetch, setFetchJSONFailure } from 'platform/testing/unit/helpers';
import { within } from '@testing-library/dom';
import reducers from '../../../redux/reducer';
import { getVARequestMock } from '../../mocks/v0';
import { getVAOSRequestMock } from '../../mocks/v2';
import { mockAppointmentInfo } from '../../mocks/helpers';
import { mockVAOSAppointmentsFetch } from '../../mocks/helpers.v2';
import {
  renderWithStoreAndRouter,
  getTimezoneTestDate,
} from '../../mocks/setup';
import { createMockFacilityByVersion } from '../../mocks/data';
import RequestedAppointmentsList from '../../../appointment-list/components/RequestedAppointmentsList';
import { mockFacilitiesFetchByVersion } from '../../mocks/fetch';

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

describe('VAOS <RequestedAppointmentsList>', () => {
  beforeEach(() => {
    mockFetch();
    MockDate.set(getTimezoneTestDate());
    mockFacilitiesFetchByVersion({ version: 0 });
  });
  afterEach(() => {
    MockDate.reset();
  });
  it('should show va request', async () => {
    // Given a veteran has VA appointment request
    const startDate = moment.utc();
    const appointment = getVARequestMock();
    appointment.attributes = {
      ...appointment.attributes,
      status: 'Submitted',
      optionDate1: startDate,
      optionTime1: 'AM',
      purposeOfVisit: 'New Issue',
      bestTimetoCall: ['Morning'],
      email: 'patient.test@va.gov',
      phoneNumber: '5555555566',
      typeOfCareId: '323',
      reasonForVisit: 'Back pain',
      friendlyLocationName: 'Some VA medical center',
      comment: 'loss of smell',
      facility: {
        ...appointment.attributes.facility,
        facilityCode: '983GC',
      },
    };
    appointment.id = '1234';
    mockAppointmentInfo({ requests: [appointment] });

    const facility = createMockFacilityByVersion({
      id: '442GC',
      name: 'Cheyenne VA Medical Center',
      address: {
        postalCode: '82001-5356',
        city: 'Cheyenne',
        state: 'WY',
        line: ['2360 East Pershing Boulevard'],
      },
      phone: '307-778-7550',
      version: 0,
    });
    mockFacilitiesFetchByVersion({ facilities: [facility], version: 0 });

    // When the veteran selects the Requested dropdown selection
    const screen = renderWithStoreAndRouter(<RequestedAppointmentsList />, {
      initialState,
      reducers,
    });

    // Then it should display the requested appointments
    expect(await screen.findByText('Primary care')).to.be.ok;
    expect(await screen.findByText(facility.attributes.name)).to.be.ok;
    expect(screen.queryByText(/You don’t have any appointments/i)).not.to.exist;
    expect(screen.baseElement).to.contain.text(
      'Below is your list of appointment requests that haven’t been scheduled yet.',
    );
  });

  it('should show cc request', async () => {
    // Given a veteran has CC appointment request

    const startDate = moment.utc();
    const appointment = getVARequestMock();
    appointment.attributes = {
      ...appointment.attributes,
      status: 'Submitted',
      optionDate1: startDate,
      optionTime1: 'AM',
      purposeOfVisit: 'New Issue',
      bestTimetoCall: ['Morning'],
      email: 'patient.test@va.gov',
      phoneNumber: '5555555566',
      typeOfCareId: 'CCAUDHEAR',
      reasonForVisit: 'Back pain',
      friendlyLocationName: 'Some VA medical center',
      appointmentType: 'Audiology (hearing aid support)',
      comment: 'loss of smell',
      ccAppointmentRequest: {
        preferredProviders: [],
      },
    };
    appointment.id = '1234';
    mockAppointmentInfo({ requests: [appointment] });
    // When the veteran selects the Requested dropdown selection
    const screen = renderWithStoreAndRouter(<RequestedAppointmentsList />, {
      initialState,
      reducers,
    });
    // Then it should display the requested appointment
    expect(await screen.findByText('Hearing aid support')).to.be.ok;
    expect(screen.baseElement).to.contain.text('Community care');
    expect(screen.queryByText(/You don’t have any appointments/i)).not.to.exist;
    expect(screen.baseElement).to.contain.text(
      'Below is your list of appointment requests that haven’t been scheduled yet.',
    );
  });

  it('should show cc request and provider facility name if available', async () => {
    const startDate = moment.utc();
    const appointment = getVARequestMock();
    appointment.attributes = {
      ...appointment.attributes,
      status: 'Submitted',
      optionDate1: startDate,
      optionTime1: 'AM',
      purposeOfVisit: 'New Issue',
      bestTimetoCall: ['Morning'],
      email: 'patient.test@va.gov',
      phoneNumber: '5555555566',
      typeOfCareId: 'CCAUDHEAR',
      reasonForVisit: 'Back pain',
      friendlyLocationName: 'Some VA medical center',
      appointmentType: 'Audiology (hearing aid support)',
      comment: 'loss of smell',
      ccAppointmentRequest: {
        preferredProviders: [
          {
            firstName: 'Test',
            lastName: 'User',
            practiceName: 'Scripps Health Clinic',
            address: {
              zipCode: '01060',
            },
            preferredOrder: 0,
            providerZipCode: '01060',
            objectType: 'Provider',
            link: [],
          },
        ],
      },
    };
    appointment.id = '1234';
    mockAppointmentInfo({ requests: [appointment] });

    const screen = renderWithStoreAndRouter(<RequestedAppointmentsList />, {
      initialState,
      reducers,
    });

    expect(await screen.findByText('Hearing aid support')).to.be.ok;
    expect(screen.baseElement).to.contain.text('Scripps Health Clinic');
    expect(screen.baseElement).not.to.contain.text('Community care');
    expect(screen.queryByText(/You don’t have any appointments/i)).not.to.exist;
  });

  it('should show error message when request fails', async () => {
    mockAppointmentInfo({});
    setFetchJSONFailure(
      global.fetch.withArgs(
        `${
          environment.API_URL
        }/vaos/v0/appointment_requests?start_date=${moment()
          .add(-120, 'days')
          .format('YYYY-MM-DD')}&end_date=${moment().format('YYYY-MM-DD')}`,
      ),
      { errors: [] },
    );

    const screen = renderWithStoreAndRouter(<RequestedAppointmentsList />, {
      initialState,
      reducers,
    });

    expect(
      await screen.findByText(
        /We’re having trouble getting your appointment requests/i,
      ),
    ).to.be.ok;
  });

  it('should not show resolved requests', async () => {
    const startDate = moment.utc();
    const appointment = getVARequestMock();
    appointment.attributes = {
      ...appointment.attributes,
      status: 'Resolved',
      optionDate1: startDate,
      optionTime1: 'AM',
      purposeOfVisit: 'New Issue',
      bestTimetoCall: ['Morning'],
      email: 'patient.test@va.gov',
      phoneNumber: '5555555566',
      typeOfCareId: '323',
      reasonForVisit: 'Back pain',
      friendlyLocationName: 'Some VA medical center',
      comment: 'loss of smell',
      facility: {
        ...appointment.attributes.facility,
        facilityCode: '983GC',
      },
    };
    appointment.id = '1234';
    mockAppointmentInfo({ requests: [appointment] });

    const screen = renderWithStoreAndRouter(<RequestedAppointmentsList />, {
      initialState,
      reducers,
    });

    expect(await screen.findByText(/You don’t have any appointment requests/i))
      .to.exist;
  });
});

describe('VAOS <RequestedAppointmentsList> with the VAOS service', () => {
  beforeEach(() => {
    mockFetch();
    MockDate.set(getTimezoneTestDate());
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
      reason: 'Routine Follow-up',
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
      'Below is your list of appointment requests that haven’t been scheduled yet.',
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
      reason: 'Routine Follow-up',
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
      'Below is your list of appointment requests that haven’t been scheduled yet.',
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
      reason: 'Routine Follow-up',
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
});
