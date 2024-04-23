import React from 'react';
import { expect } from 'chai';
import moment from 'moment-timezone';
import { mockFetch } from '@department-of-veterans-affairs/platform-testing/helpers';
import CanceledAppointmentsList from '../../../appointment-list/components/CanceledAppointmentsList';
import { renderWithStoreAndRouter } from '../../mocks/setup';
import { getVAOSRequestMock } from '../../mocks/v2';
import { mockVAOSAppointmentsFetch } from '../../mocks/helpers.v2';
import { APPOINTMENT_STATUS, VIDEO_TYPES } from '../../../utils/constants';
import { createMockFacilityByVersion } from '../../mocks/data';

describe('VAOS Component: CanceledAppointmentsList', () => {
  beforeEach(() => {
    mockFetch();
  });

  const initialState = {
    featureToggles: {
      vaOnlineSchedulingCancel: true,
      vaOnlineSchedulingVAOSServiceVAAppointments: true,
    },
  };

  // This function creates a baseline canceled appointment
  function mockBaseCanceledAppointment(start) {
    const appointment = getVAOSRequestMock();
    appointment.id = '1234';
    appointment.attributes = {
      id: '1234',
      status: APPOINTMENT_STATUS.cancelled,
      kind: 'clinic',
      clinic: '308',
      localStartTime: start.format('YYYY-MM-DDTHH:mm:ss.000ZZ'),
      locationId: '983GC',
    };
    return appointment;
  }

  // This function mocks the behavior of fetchFutureAppointments
  // which fetches appointments and appointment requests
  function mockFetchFutureAppointments(appointment) {
    mockVAOSAppointmentsFetch({
      start: moment()
        .subtract(30, 'days')
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
  }

  it('should show information without facility name', async () => {
    // Arrange
    const startDate = moment();
    const appointment = mockBaseCanceledAppointment(startDate);
    mockFetchFutureAppointments(appointment);

    // Act
    const screen = renderWithStoreAndRouter(<CanceledAppointmentsList />, {
      initialState,
    });

    // Assert
    await screen.findByText(new RegExp(startDate.format('dddd, MMMM D'), 'i'));

    const timeHeader = screen.getByText(
      new RegExp(startDate.format('h:mm'), 'i'),
    );

    expect(screen.queryByText(/You don’t have any appointments/i)).not.to.exist;
    expect(screen.baseElement).to.contain.text('Canceled');
    expect(screen.baseElement).to.contain.text('VA appointment');

    expect(timeHeader).to.contain.text('MT');
    expect(timeHeader).to.contain.text('Mountain time');
  });

  it('should show information with facility name', async () => {
    // Arrange
    const startDate = moment();
    const appointment = getVAOSRequestMock();
    appointment.id = '1234';
    appointment.attributes = {
      id: '1234',
      status: APPOINTMENT_STATUS.cancelled,
      kind: 'clinic',
      clinic: '308',
      localStartTime: startDate.format('YYYY-MM-DDTHH:mm:ss.000ZZ'),
      locationId: '983GC',
      location: createMockFacilityByVersion({
        id: '983GC',
        name: 'Cheyenne VA Medical Center',
        address: {
          postalCode: '82001-5356',
          city: 'Cheyenne',
          state: 'WY',
          line: ['2360 East Pershing Boulevard'],
        },
        phone: '970-224-1550',
      }),
    };

    mockFetchFutureAppointments(appointment);

    // Act
    const screen = renderWithStoreAndRouter(<CanceledAppointmentsList />, {
      initialState,
    });

    // Assert
    await screen.findByText(new RegExp(startDate.format('dddd, MMMM D'), 'i'));
    expect(screen.getByText(new RegExp(startDate.format('h:mm'), 'i'))).to
      .exist;
    expect(await screen.findByText(/Cheyenne VA Medical Center/i)).to.exist;
    expect(screen.baseElement).not.to.contain.text('VA appointment');
    expect(screen.baseElement).to.contain.text('Canceled');
  });

  it('should not display when they have hidden statuses', () => {
    // Arrange
    const startDate = moment();
    const appointment = mockBaseCanceledAppointment(startDate);
    appointment.attributes.status = APPOINTMENT_STATUS.noshow;
    mockFetchFutureAppointments(appointment);

    // Act
    const screen = renderWithStoreAndRouter(<CanceledAppointmentsList />, {
      initialState,
    });

    // Assert
    return expect(
      screen.findByText(/You don’t have any canceled appointments/i),
    ).to.eventually.be.ok;
  });

  it('should show error message when request fails', async () => {
    // Mock a fetch failure
    mockVAOSAppointmentsFetch({
      start: moment()
        .subtract(30, 'days')
        .format('YYYY-MM-DD'),
      end: moment()
        .add(395, 'days')
        .format('YYYY-MM-DD'),
      statuses: ['booked', 'arrived', 'fulfilled', 'cancelled'],
      requests: [],
      error: true,
    });

    const screen = renderWithStoreAndRouter(<CanceledAppointmentsList />, {
      initialState,
    });

    expect(
      await screen.findByText(
        /We’re having trouble getting your canceled appointments/i,
      ),
    ).to.be.ok;
  });

  it('should show at home video appointment text', async () => {
    // Arrange
    const startDate = moment();
    const appointment = mockBaseCanceledAppointment(startDate);
    appointment.attributes.kind = 'telehealth';
    appointment.attributes.telehealth = { vvsKind: VIDEO_TYPES.adhoc };
    mockFetchFutureAppointments(appointment);

    // Act
    const screen = renderWithStoreAndRouter(<CanceledAppointmentsList />, {
      initialState,
    });

    // Assert
    await screen.findByText(new RegExp(startDate.format('dddd, MMMM D'), 'i'));

    const timeHeader = screen.getByText(
      new RegExp(startDate.format('h:mm'), 'i'),
    );
    expect(timeHeader).to.contain.text('MT');
    expect(timeHeader).to.contain.text('Mountain time');

    expect(screen.queryByText(/You don’t have any appointments/i)).not.to.exist;
    expect(screen.baseElement).to.contain.text('VA Video Connect at home');
    expect(screen.baseElement).to.contain.text('Canceled');
  });

  it('should show ATLAS video appointment text', async () => {
    // Arrange
    const startDate = moment();
    const appointment = mockBaseCanceledAppointment(startDate);
    appointment.attributes.kind = 'telehealth';
    appointment.attributes.currentStatus = 'CANCELLED BY CLINIC';
    appointment.attributes.telehealth = {
      vvsKind: VIDEO_TYPES.adhoc,
      atlas: {
        siteCode: '9931',
        slotId: 'Slot8',
        confirmationCode: '7VBBCA',
        address: {
          streetAddress: '114 Dewey Ave',
          city: 'Eureka',
          state: 'MT',
          zipCode: '59917',
          country: 'USA',
          longitude: null,
          latitude: null,
          additionalDetails: '',
        },
      },
    };

    mockFetchFutureAppointments(appointment);

    // Act
    const screen = renderWithStoreAndRouter(<CanceledAppointmentsList />, {
      initialState,
    });

    // Assert
    await screen.findByText(new RegExp(startDate.format('dddd, MMMM D'), 'i'));

    const timeHeader = screen.getByText(
      new RegExp(startDate.format('h:mm'), 'i'),
    );
    expect(timeHeader).to.contain.text('MT');
    expect(timeHeader).to.contain.text('Mountain time');

    expect(screen.queryByText(/You don’t have any appointments/i)).not.to.exist;
    expect(screen.baseElement).to.contain.text(
      'VA Video Connect at an ATLAS location',
    );
    expect(screen.baseElement).to.contain.text('Canceled');
  });

  it('should show video appointment on gfe text', async () => {
    // Arrange
    const startDate = moment();
    const appointment = mockBaseCanceledAppointment(startDate);
    appointment.attributes.kind = 'telehealth';
    appointment.attributes.currentStatus = 'CANCELLED BY CLINIC';
    appointment.attributes.telehealth = { vvsKind: VIDEO_TYPES.adhoc };
    appointment.attributes.extension = { patientHasMobileGfe: true };
    mockFetchFutureAppointments(appointment);

    // Act
    const screen = renderWithStoreAndRouter(<CanceledAppointmentsList />, {
      initialState,
    });

    // Assert
    await screen.findByText(new RegExp(startDate.format('dddd, MMMM D'), 'i'));

    const timeHeader = screen.getByText(
      new RegExp(startDate.format('h:mm'), 'i'),
    );
    expect(timeHeader).to.contain.text('MT');
    expect(timeHeader).to.contain.text('Mountain time');

    expect(screen.queryByText(/You don’t have any appointments/i)).not.to.exist;
    expect(screen.baseElement).to.contain.text(
      'VA Video Connect using a VA device',
    );
    expect(screen.baseElement).to.contain.text('Canceled');
  });

  it('should show video appointment at VA location text', async () => {
    // Arrange
    const startDate = moment();
    const appointment = mockBaseCanceledAppointment(startDate);
    appointment.attributes.kind = 'telehealth';
    appointment.attributes.currentStatus = 'CANCELLED BY CLINIC';
    appointment.attributes.telehealth = { vvsKind: VIDEO_TYPES.clinic };
    mockFetchFutureAppointments(appointment);

    // Act
    const screen = renderWithStoreAndRouter(<CanceledAppointmentsList />, {
      initialState,
    });

    // Assert
    await screen.findByText(new RegExp(startDate.format('dddd, MMMM D'), 'i'));

    const timeHeader = screen.getByText(
      new RegExp(startDate.format('h:mm'), 'i'),
    );
    expect(timeHeader).to.contain.text('MT');
    expect(timeHeader).to.contain.text('Mountain time');

    expect(screen.queryByText(/You don’t have any appointments/i)).not.to.exist;
    expect(screen.baseElement).to.contain.text(
      'VA Video Connect at a VA location',
    );
    expect(screen.baseElement).to.contain.text('Canceled');
  });

  it('should show phone call appointment text', async () => {
    // Arrange
    const startDate = moment();
    const appointment = mockBaseCanceledAppointment(startDate);
    appointment.attributes.kind = 'phone';
    appointment.attributes.currentStatus = 'CANCELLED BY CLINIC';
    appointment.attributes.telehealth = { vvsKind: VIDEO_TYPES.clinic };
    mockFetchFutureAppointments(appointment);

    // Act
    const screen = renderWithStoreAndRouter(<CanceledAppointmentsList />, {
      initialState,
    });

    // Assert
    await screen.findByText(new RegExp(startDate.format('dddd, MMMM D'), 'i'));

    expect(screen.queryByText(/You don’t have any appointments/i)).not.to.exist;
    expect(screen.baseElement).to.contain.text('Phone call');
    expect(screen.baseElement).to.contain.text('Canceled');
  });

  it('should show canceled appointment from past if less than 30 days ago', async () => {
    // Arrange
    const startDate = moment().subtract(28, 'days');
    const appointment = mockBaseCanceledAppointment(startDate);
    mockFetchFutureAppointments(appointment);

    // Act
    const screen = renderWithStoreAndRouter(<CanceledAppointmentsList />, {
      initialState,
    });

    // Assert
    await screen.findByText(new RegExp(startDate.format('dddd, MMMM D'), 'i'));

    const timeHeader = screen.getByText(
      new RegExp(startDate.format('h:mm'), 'i'),
    );

    expect(screen.queryByText(/You don’t have any appointments/i)).not.to.exist;
    expect(screen.baseElement).to.contain.text('Canceled');
    expect(screen.baseElement).to.contain.text('VA appointment');

    expect(timeHeader).to.contain.text('MT');
    expect(timeHeader).to.contain.text('Mountain time');
  });

  it('should show canceled appointment from past if less than 395 days ahead', async () => {
    // Arrange
    const startDate = moment().add(393, 'days');
    const appointment = mockBaseCanceledAppointment(startDate);
    mockFetchFutureAppointments(appointment);

    // Act
    const screen = renderWithStoreAndRouter(<CanceledAppointmentsList />, {
      initialState,
    });

    // Assert
    await screen.findByText(new RegExp(startDate.format('dddd, MMMM D'), 'i'));

    const timeHeader = screen.getByText(
      new RegExp(startDate.format('h:mm'), 'i'),
    );

    expect(screen.queryByText(/You don’t have any appointments/i)).not.to.exist;
    expect(screen.baseElement).to.contain.text('Canceled');
    expect(screen.baseElement).to.contain.text('VA appointment');

    expect(timeHeader).to.contain.text('MT');
    expect(timeHeader).to.contain.text('Mountain time');
  });

  it('should not show canceled appointment from past if more than 30 days ago', async () => {
    // Arrange
    const startDate = moment().subtract(32, 'days');
    const appointment = mockBaseCanceledAppointment(startDate);
    mockFetchFutureAppointments(appointment);

    // Act
    const screen = renderWithStoreAndRouter(<CanceledAppointmentsList />, {
      initialState,
    });

    // Assert
    return expect(
      screen.findByText(/You don’t have any canceled appointments/i),
    ).to.eventually.be.ok;
  });

  it('should not show canceled appointment if more than 395 days ahead', async () => {
    // Arrange
    const startDate = moment().subtract(393, 'days');
    const appointment = mockBaseCanceledAppointment(startDate);
    mockFetchFutureAppointments(appointment);

    // Act
    const screen = renderWithStoreAndRouter(<CanceledAppointmentsList />, {
      initialState,
    });

    // Assert
    return expect(
      screen.findByText(/You don’t have any canceled appointments/i),
    ).to.eventually.be.ok;
  });
});
