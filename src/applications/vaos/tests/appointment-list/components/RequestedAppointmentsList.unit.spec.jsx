import React from 'react';
import MockDate from 'mockdate';
import { expect } from 'chai';
import moment from 'moment';
import environment from 'platform/utilities/environment';
import {
  mockFetch,
  resetFetch,
  setFetchJSONFailure,
} from 'platform/testing/unit/helpers';
import reducers from '../../../redux/reducer';
import { getVAFacilityMock, getVARequestMock } from '../../mocks/v0';
import { mockAppointmentInfo, mockFacilitiesFetch } from '../../mocks/helpers';
import {
  renderWithStoreAndRouter,
  getTimezoneTestDate,
} from '../../mocks/setup';
import RequestedAppointmentsList from '../../../appointment-list/components/RequestedAppointmentsList';

const initialState = {
  featureToggles: {
    vaOnlineSchedulingCancel: true,
    vaExpressCare: true,
    vaExpressCareNew: true,
    vaOnlineSchedulingHomepageRefresh: true,
  },
};

describe('VAOS <RequestedAppointmentsList>', () => {
  beforeEach(() => {
    mockFetch();
    MockDate.set(getTimezoneTestDate());
  });
  afterEach(() => {
    resetFetch();
    MockDate.reset();
  });
  it('should show va request', async () => {
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
      appointmentType: 'Primary Care',
      comment: 'loss of smell',
      facility: {
        ...appointment.attributes.facility,
        facilityCode: '983GC',
      },
    };
    appointment.id = '1234';
    mockAppointmentInfo({ requests: [appointment], isHomepageRefresh: true });

    const facility = {
      id: 'vha_442GC',
      attributes: {
        ...getVAFacilityMock().attributes,
        uniqueId: '442GC',
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
    };
    mockFacilitiesFetch('vha_442GC', [facility]);

    const screen = renderWithStoreAndRouter(<RequestedAppointmentsList />, {
      initialState,
      reducers,
    });

    expect(await screen.findByText('Primary care')).to.be.ok;
    expect(await screen.findByText(facility.attributes.name)).to.be.ok;
    expect(screen.queryByText(/You don’t have any appointments/i)).not.to.exist;
  });

  it('should show cc request', async () => {
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
    mockAppointmentInfo({ requests: [appointment], isHomepageRefresh: true });

    const screen = renderWithStoreAndRouter(<RequestedAppointmentsList />, {
      initialState,
      reducers,
    });

    expect(await screen.findByText('Audiology (hearing aid support)')).to.be.ok;
    expect(screen.baseElement).to.contain.text('Community care');
    expect(screen.queryByText(/You don’t have any appointments/i)).not.to.exist;
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
    mockAppointmentInfo({ requests: [appointment], isHomepageRefresh: true });

    const screen = renderWithStoreAndRouter(<RequestedAppointmentsList />, {
      initialState,
      reducers,
    });

    expect(await screen.findByText('Audiology (hearing aid support)')).to.be.ok;
    expect(screen.baseElement).to.contain.text('Scripps Health Clinic');
    expect(screen.baseElement).not.to.contain.text('Community care');
    expect(screen.queryByText(/You don’t have any appointments/i)).not.to.exist;
  });

  it('should not show express care appointment request', async () => {
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
      typeOfCareId: 'CR1',
      reasonForVisit: 'Back pain',
      friendlyLocationName: 'Some VA medical center',
      appointmentType: 'Express Care',
      comment: 'loss of smell',
      facility: {
        ...appointment.attributes.facility,
        facilityCode: '983GC',
      },
    };
    appointment.id = '1234';
    mockAppointmentInfo({ requests: [appointment], isHomepageRefresh: true });

    const facility = {
      id: 'vha_442GC',
      attributes: {
        ...getVAFacilityMock().attributes,
        uniqueId: '442GC',
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
    };
    mockFacilitiesFetch('vha_442GC', [facility]);

    const screen = renderWithStoreAndRouter(<RequestedAppointmentsList />, {
      initialState,
      reducers,
    });

    expect(await screen.findByText(/You don’t have any appointments/i)).to.be
      .ok;
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
});
