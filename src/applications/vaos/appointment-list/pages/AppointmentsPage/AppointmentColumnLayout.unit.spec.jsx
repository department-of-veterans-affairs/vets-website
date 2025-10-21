import { expect } from 'chai';
import React from 'react';
import { renderWithStoreAndRouter } from '../../../tests/mocks/setup';
import AppointmentColumnLayout from './AppointmentColumnLayout';
import MockAppointmentResponse from '../../../tests/fixtures/MockAppointmentResponse';

describe('VAOS Component: AppointmentColumnLayout.', () => {
  const initialState = {
    featureToggles: {
      vaOnlineSchedulingListViewClinicInfo: true,
    },
  };

  it('should display both clinic name and physical location', async () => {
    // Arrange
    const appointment = MockAppointmentResponse.createClinicResponse()
      .setPhysicalLocation('Clinic physical location')
      .setServiceName('Clinic name');
    const transformed = MockAppointmentResponse.getTransformedResponse(
      appointment,
    );

    // Act
    const screen = renderWithStoreAndRouter(
      <AppointmentColumnLayout data={transformed} first grouped link="" />,
      {
        initialState,
      },
    );

    // Assert
    expect(screen.getByText(/Clinic: Clinic name/));
    expect(screen.getByText(/Location: Clinic physical location/));
  });

  it('should display clinic name only', async () => {
    // Arrange
    const appointment = MockAppointmentResponse.createClinicResponse().setServiceName(
      'Clinic name',
    );
    const transformed = MockAppointmentResponse.getTransformedResponse(
      appointment,
    );

    // Act
    const screen = renderWithStoreAndRouter(
      <AppointmentColumnLayout data={transformed} first grouped link="" />,
      {
        initialState,
      },
    );

    // Assert
    expect(screen.getByText(/Clinic: Clinic name/));
    expect(screen.queryByText(/Location: Clinic physical location/)).not.to
      .exist;
  });

  it('should display clinic physical location only', async () => {
    // Arrange
    const appointment = MockAppointmentResponse.createClinicResponse().setPhysicalLocation(
      'Clinic physical location',
    );
    const transformed = MockAppointmentResponse.getTransformedResponse(
      appointment,
    );

    // Act
    const screen = renderWithStoreAndRouter(
      <AppointmentColumnLayout data={transformed} first grouped link="" />,
      {
        initialState,
      },
    );

    // Assert
    expect(screen.getByText(/Location: Clinic physical location/));
    expect(screen.queryByText(/Clinic: Clinic name/)).not.to.exist;
  });

  it('should not display clinic name or clinic physical location', async () => {
    // Arrange
    const appointment = MockAppointmentResponse.createClinicResponse();
    const transformed = MockAppointmentResponse.getTransformedResponse(
      appointment,
    );

    // Act
    const screen = renderWithStoreAndRouter(
      <AppointmentColumnLayout data={transformed} first grouped link="" />,
      {
        initialState,
      },
    );

    // Assert
    expect(screen.queryByText(/Clinic: Clinic name/)).not.to.exist;
    expect(screen.queryByText(/Location: Clinic physical location/)).not.to
      .exist;
  });

  it('should display appointment locality as a link', async () => {
    // Arrange
    const appointment = MockAppointmentResponse.createClinicResponse();
    const transformed = MockAppointmentResponse.getTransformedResponse(
      appointment,
    );

    // Act
    const screen = renderWithStoreAndRouter(
      <AppointmentColumnLayout
        data={transformed}
        first
        grouped
        link="http://va.go"
      />,
      {
        initialState,
      },
    );

    // Assert
    screen.getByRole('link', { name: /Primary care/ }); // TODO: Verify what the aria text should be
  });

  it('should not display details link', async () => {
    // Arrange
    const appointment = MockAppointmentResponse.createClinicResponse();
    const transformed = MockAppointmentResponse.getTransformedResponse(
      appointment,
    );

    // Act
    const screen = renderWithStoreAndRouter(
      <AppointmentColumnLayout
        data={transformed}
        first
        grouped
        link="http://va.go"
      />,
      {
        initialState,
      },
    );

    // Assert
    expect(screen.queryByRole('link', { name: /Details for/ })).not.to.exist;
  });
});
