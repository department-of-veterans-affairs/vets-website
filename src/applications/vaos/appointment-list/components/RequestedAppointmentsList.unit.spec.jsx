import { mockFetch } from '@department-of-veterans-affairs/platform-testing/helpers';
import { within } from '@testing-library/dom';
import { expect } from 'chai';
import { addDays, subDays, subMonths } from 'date-fns';
import MockDate from 'mockdate';
import React from 'react';
import reducers from '../../redux/reducer';
import MockAppointmentResponse from '../../tests/fixtures/MockAppointmentResponse';
import MockFacilityResponse from '../../tests/fixtures/MockFacilityResponse';
import { mockAppointmentsApi } from '../../tests/mocks/mockApis';
import { getTestDate, renderWithStoreAndRouter } from '../../tests/mocks/setup';
import {
  APPOINTMENT_STATUS,
  OPTOMETRY_ID,
  PHARMACY_ID,
  PRIMARY_CARE,
} from '../../utils/constants';
import RequestedAppointmentsList from './RequestedAppointmentsList';

const initialState = {
  featureToggles: {
    vaOnlineSchedulingCancel: true,
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
    const startDate = new Date();
    const appointment = new MockAppointmentResponse({
      localStartTime: startDate,
      status: APPOINTMENT_STATUS.proposed,
    }).setLocation(new MockFacilityResponse());

    // And developer is using the v2 API
    mockAppointmentsApi({
      start: subDays(new Date(), 120),
      end: addDays(new Date(), 2),
      statuses: ['proposed', 'cancelled'],
      response: [appointment],
    });

    // When veteran selects the Requested dropdown selection
    const screen = renderWithStoreAndRouter(<RequestedAppointmentsList />, {
      initialState,
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

  it('should show cc request, vaOnlineSchedulingFeSourceOfTruthCC=false', async () => {
    // Given a veteran has CC appointment request
    // TODO: practitioners.id is same as practitioners.identifier
    const ccAppointmentRequest = MockAppointmentResponse.createCCResponse().setTypeOfCare(
      '203',
    );

    // And developer is using the v2 API
    mockAppointmentsApi({
      start: subDays(new Date(), 120),
      end: addDays(new Date(), 2),
      statuses: ['proposed', 'cancelled'],
      response: [ccAppointmentRequest],
    });
    // When veteran selects the Requested dropdown selection
    const screen = renderWithStoreAndRouter(<RequestedAppointmentsList />, {
      initialState,
      reducers,
    });

    expect(await screen.findByText('Audiology and speech')).to.be.ok;
    expect(screen.baseElement).to.contain.text('Community care');
    expect(screen.queryByText(/You don’t have any appointments/i)).not.to.exist;
    expect(screen.baseElement).to.contain.text(
      'Appointments that you request will show here until staff review and schedule them.',
    );
  });

  it('should show cc request, vaOnlineSchedulingFeSourceOfTruthCC=true', async () => {
    // Given a veteran has CC appointment request
    // TODO: practitioners.id is same as practitioners.identifier
    const ccAppointmentRequest = MockAppointmentResponse.createCCResponse({
      pending: true,
    })
      .setType('COMMUNITY_CARE_REQUEST')
      .setTypeOfCare('203');

    // And developer is using the v2 API
    mockAppointmentsApi({
      start: subDays(new Date(), 120),
      end: addDays(new Date(), 2),
      statuses: ['proposed', 'cancelled'],
      response: [ccAppointmentRequest],
    });
    // When veteran selects the Requested dropdown selection
    const screen = renderWithStoreAndRouter(<RequestedAppointmentsList />, {
      initialState: {
        ...initialState,
        featureToggles: {
          ...initialState.featureToggles,
          vaOnlineSchedulingFeSourceOfTruthCC: true,
        },
      },
      reducers,
    });

    expect(await screen.findByText('Audiology and speech')).to.be.ok;
    expect(screen.baseElement).to.contain.text('Community care');
    expect(screen.queryByText(/You don’t have any appointments/i)).not.to.exist;
    expect(screen.baseElement).to.contain.text(
      'Appointments that you request will show here until staff review and schedule them.',
    );
  });

  // Then it should display the requested appointments
  it('should show error message when request fails', async () => {
    // Arrange
    mockAppointmentsApi({
      end: addDays(new Date(), 2),
      start: subDays(new Date(), 120),
      statuses: ['proposed', 'cancelled'],
      responseCode: 500,
    });

    // Act
    const screen = renderWithStoreAndRouter(<RequestedAppointmentsList />, {
      initialState,
      reducers,
    });

    // Assert
    expect(
      await screen.findByText(
        /We’re having trouble getting your appointment requests/i,
      ),
    ).to.be.ok;
  });

  it('should display request sorted by create date in descending order', async () => {
    // Given a veteran has VA appointment request
    const appointments = [OPTOMETRY_ID, PHARMACY_ID, PRIMARY_CARE].map(type => {
      return new MockAppointmentResponse({
        status: APPOINTMENT_STATUS.proposed,
      }).setTypeOfCare(type);
    });

    // And developer is using the v2 API
    mockAppointmentsApi({
      start: subDays(new Date(), 120),
      end: addDays(new Date(), 2),
      statuses: ['proposed', 'cancelled'],
      response: appointments,
    });

    // When veteran selects the Requested dropdown selection
    const screen = renderWithStoreAndRouter(<RequestedAppointmentsList />, {
      initialState,
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

  it('should show cc request and provider facility name if available, vaOnlineSchedulingFeSourceOfTruthCC=false', async () => {
    // Arrange
    const appointment = MockAppointmentResponse.createCCResponse().setTypeOfCare(
      'audiology',
    );

    mockAppointmentsApi({
      start: subMonths(new Date(), 1),
      end: addDays(new Date(), 395),
      statuses: ['booked', 'arrived', 'fulfilled', 'cancelled'],
      response: [appointment],
    });
    mockAppointmentsApi({
      start: subDays(new Date(), 120),
      end: addDays(new Date(), 2),
      statuses: ['proposed', 'cancelled'],
      response: [appointment],
    });

    // Act
    const screen = renderWithStoreAndRouter(<RequestedAppointmentsList />, {
      initialState,
      reducers,
    });

    // Assert
    expect(await screen.findByText('Audiology and speech')).to.be.ok;
    expect(screen.baseElement).to.contain.text('Community care');
    expect(screen.queryByText(/You don’t have any appointments/i)).not.to.exist;
  });

  it('should show cc request and provider facility name if available, vaOnlineSchedulingFeSourceOfTruthCC=true', async () => {
    // Arrange
    const appointment = MockAppointmentResponse.createCCResponse({
      pending: true,
    }).setTypeOfCare('audiology');

    mockAppointmentsApi({
      start: subMonths(new Date(), 1),
      end: addDays(new Date(), 395),
      statuses: ['booked', 'arrived', 'fulfilled', 'cancelled'],
      response: [appointment],
    });
    mockAppointmentsApi({
      start: subDays(new Date(), 120),
      end: addDays(new Date(), 2),
      statuses: ['proposed', 'cancelled'],
      response: [appointment],
    });

    // Act
    const screen = renderWithStoreAndRouter(<RequestedAppointmentsList />, {
      initialState: {
        ...initialState,
        featureToggles: {
          ...initialState.featureToggles,
          vaOnlineSchedulingFeSourceOfTruthCC: true,
        },
      },
      reducers,
    });

    // Assert
    expect(await screen.findByText('Audiology and speech')).to.be.ok;
    expect(screen.baseElement).to.contain.text('Community care');
    expect(screen.queryByText(/You don’t have any appointments/i)).not.to.exist;
  });

  it('should not show resolved requests', async () => {
    // Arrange
    const appointments = MockAppointmentResponse.createVAResponses({
      status: APPOINTMENT_STATUS.fulfilled,
    });

    mockAppointmentsApi({
      start: subMonths(new Date(), 1),
      end: addDays(new Date(), 395),
      statuses: ['booked', 'arrived', 'fulfilled', 'cancelled'],
      response: appointments,
    });
    mockAppointmentsApi({
      start: subDays(new Date(), 120),
      end: addDays(new Date(), 2),
      statuses: ['proposed', 'cancelled'],
      response: appointments,
    });

    // Act
    const screen = renderWithStoreAndRouter(<RequestedAppointmentsList />, {
      initialState,
      reducers,
    });

    // Assert
    expect(await screen.findByText(/You don’t have any appointment requests/i))
      .to.exist;
  });
});
