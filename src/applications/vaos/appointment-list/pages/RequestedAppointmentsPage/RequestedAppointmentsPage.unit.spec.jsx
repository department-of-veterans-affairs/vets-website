import { mockFetch } from '@department-of-veterans-affairs/platform-testing/helpers';
import { within } from '@testing-library/dom';
import { expect } from 'chai';
import { addDays, subDays } from 'date-fns';
import MockDate from 'mockdate';
import React from 'react';
import reducers from '../../../redux/reducer';
import MockAppointmentResponse from '../../../tests/fixtures/MockAppointmentResponse';
import MockFacilityResponse from '../../../tests/fixtures/MockFacilityResponse';
import { mockAppointmentsApi } from '../../../tests/mocks/mockApis';
import {
  getTestDate,
  renderWithStoreAndRouter,
} from '../../../tests/mocks/setup';
import { APPOINTMENT_STATUS, TYPE_OF_CARE_IDS } from '../../../utils/constants';
import RequestedAppointmentsPage from './RequestedAppointmentsPage';

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
    const appointments = MockAppointmentResponse.createVAResponses({
      localStartTime: startDate,
      pending: true,
    });
    appointments[0].setLocation(new MockFacilityResponse());

    // And developer is using the v2 API
    mockAppointmentsApi({
      start: subDays(now, 120),
      end: addDays(now, 2),
      statuses: ['proposed', 'cancelled'],
      response: appointments,
    });

    // When veteran selects the Requested dropdown selection
    const screen = renderWithStoreAndRouter(<RequestedAppointmentsPage />, {
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

    const ccAppointmentRequest = MockAppointmentResponse.createCCResponse({
      pending: true,
      status: APPOINTMENT_STATUS.proposed,
    })
      .setLocation(new MockFacilityResponse())
      .setTypeOfCare(TYPE_OF_CARE_IDS.AUDIOLOGY_ID);

    // And developer is using the v2 API
    mockAppointmentsApi({
      start: subDays(now, 120),
      end: addDays(now, 2),
      statuses: ['proposed', 'cancelled'],
      response: [ccAppointmentRequest],
    });
    // When veteran selects the Requested dropdown selection
    const screen = renderWithStoreAndRouter(<RequestedAppointmentsPage />, {
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
    const appointment = MockAppointmentResponse.createVAResponse({
      pending: true,
    });
    const canceledAppointment = {
      ...appointment,
      attributes: {
        ...appointment.attributes,
        serviceType: '160',
        status: 'cancelled',
      },
    };

    // And developer is using the v2 API
    mockAppointmentsApi({
      start: subDays(now, 120),
      end: addDays(now, 2),
      statuses: ['proposed', 'cancelled'],
      response: [appointment, canceledAppointment],
    });

    // When veteran selects requested appointments
    const screen = renderWithStoreAndRouter(<RequestedAppointmentsPage />, {
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

    const appointments = [
      TYPE_OF_CARE_IDS.OPTOMETRY_ID,
      TYPE_OF_CARE_IDS.AUDIOLOGY_ID,
      TYPE_OF_CARE_IDS.PRIMARY_CARE,
    ].map(type => {
      return MockAppointmentResponse.createVAResponse({
        pending: true,
      }).setTypeOfCare(type);
    });

    // And developer is using the v2 API
    mockAppointmentsApi({
      start: subDays(now, 120),
      end: addDays(now, 2),
      statuses: ['proposed', 'cancelled'],
      response: appointments,
    });

    // When veteran selects the Requested dropdown selection
    const screen = renderWithStoreAndRouter(<RequestedAppointmentsPage />, {
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
    const appointment = MockAppointmentResponse.createVAResponse({
      pending: true,
    });

    // And developer is using the v2 API
    mockAppointmentsApi({
      start: subDays(now, 120),
      end: addDays(now, 2),
      statuses: ['proposed', 'cancelled'],
      response: [appointment],
    });

    // When veteran selects requested appointments
    const screen = renderWithStoreAndRouter(<RequestedAppointmentsPage />, {
      reducers,
    });

    // Then it should display the requested appointments
    expect(await screen.findByText('Primary care')).to.be.ok;

    // And cancelled appointments should not be displayed
    expect(
      screen.queryByRole('heading', { level: 2, name: 'Canceled response' }),
    ).not.to.be.ok;
    expect(screen.queryByText('These appointment response have been canceled.'))
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
    mockAppointmentsApi({
      start: subDays(new Date(), 120),
      end: addDays(new Date(), 2),
      statuses: ['proposed', 'cancelled'],
      response: [],
    });

    // When veteran selects requested appointments
    const screen = renderWithStoreAndRouter(<RequestedAppointmentsPage />, {
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
    const appointment = MockAppointmentResponse.createVAResponse({
      pending: true,
      status: APPOINTMENT_STATUS.cancelled,
    }).setRequestedPeriods([now]);

    // And developer is using the v2 API
    mockAppointmentsApi({
      start: subDays(now, 120),
      end: addDays(now, 2),
      statuses: ['proposed', 'cancelled'],
      response: [appointment],
    });

    // When veteran selects requested appointments
    const screen = renderWithStoreAndRouter(<RequestedAppointmentsPage />, {
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
    mockAppointmentsApi({
      start: subDays(new Date(), 120),
      end: addDays(new Date(), 2),
      statuses: ['proposed', 'cancelled'],
      responseCode: 500,
    });

    const screen = renderWithStoreAndRouter(<RequestedAppointmentsPage />, {
      reducers,
    });

    expect(
      await screen.findByText(
        /We’re having trouble getting your appointment requests/i,
      ),
    ).to.be.ok;
  });
});
