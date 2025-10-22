import React from 'react';
import { expect } from 'chai';
import { axeCheck } from 'platform/forms-system/test/config/helpers';
import { renderWithStoreAndRouter } from '../tests/mocks/setup';
import AppointmentClinicInfo from './AppointmentClinicInfo';

const apptId = '123';
const clinicLocationInfo = {
  name: 'Test Clinic',
  location: 'East Hallway, 3rd Floor, Room 301',
};

describe('VAOS Component: AppointmentClinicInfo', () => {
  const initialState = {};
  it('axe check', async () => {
    // Act
    axeCheck(
      <AppointmentClinicInfo
        show
        apptId="123"
        clinicLocationInfo={clinicLocationInfo}
      />,
    );
  });
  it('should not show appointment clinic info', async () => {
    // Act
    const screen = renderWithStoreAndRouter(
      <AppointmentClinicInfo
        show={false}
        apptId="123"
        clinicLocationInfo={clinicLocationInfo}
      />,
      {
        initialState,
      },
    );

    // Assert
    expect(screen.queryByTestId(`vaos-appts__clinic-namelocation-${apptId}`))
      .not.to.exist;
  });
  it('should not show', async () => {
    // Act
    const screen = renderWithStoreAndRouter(
      <AppointmentClinicInfo
        show
        apptId="123"
        clinicLocationInfo={clinicLocationInfo}
      />,
      {
        initialState,
      },
    );

    // Assert
    expect(screen.queryByTestId(`vaos-appts__clinic-namelocation-${apptId}`)).to
      .exist;
    expect(
      screen.getByTestId(`vaos-appts__clinic-name-${apptId}`),
    ).to.have.text('Clinic: Test Clinic');
    expect(
      screen.getByTestId(`vaos-appts__clinic-location-${apptId}`),
    ).to.have.text('Location: East Hallway, 3rd Floor, Room 301');
  });

  it('should show with line-through all text when canceled', async () => {
    // Act
    const screen = renderWithStoreAndRouter(
      <AppointmentClinicInfo
        show
        apptId="123"
        clinicLocationInfo={clinicLocationInfo}
        isCanceled
      />,
      {
        initialState,
      },
    );

    // Assert
    expect(screen.queryByTestId(`vaos-appts__clinic-namelocation-${apptId}`)).to
      .exist;
    expect(
      screen.getByTestId(`vaos-appts__clinic-name-${apptId}`),
    ).to.have.text('Clinic: Test Clinic');
    expect(
      screen.getByTestId(`vaos-appts__clinic-location-${apptId}`),
    ).to.have.text('Location: East Hallway, 3rd Floor, Room 301');
    expect(
      screen.getByTestId(`vaos-appts__clinic-name-${apptId}`),
    ).to.have.attribute('style', 'text-decoration: line-through;');
    expect(
      screen.getByTestId(`vaos-appts__clinic-location-${apptId}`),
    ).to.have.attribute('style', 'text-decoration: line-through;');
  });
  it('should show without name when not provided, but show location when it is', async () => {
    // Arrange
    const locationModified = { ...clinicLocationInfo };
    locationModified.name = undefined;
    // Act
    const screen = renderWithStoreAndRouter(
      <AppointmentClinicInfo
        show
        apptId="123"
        clinicLocationInfo={locationModified}
        isCanceled={false}
      />,
      {
        initialState,
      },
    );

    // Assert
    expect(screen.queryByTestId(`vaos-appts__clinic-namelocation-${apptId}`)).to
      .exist;
    expect(screen.queryByTestId(`vaos-appts__clinic-name-${apptId}`)).not.to
      .exist;
    expect(
      screen.getByTestId(`vaos-appts__clinic-location-${apptId}`),
    ).to.have.text('Location: East Hallway, 3rd Floor, Room 301');
    expect(
      screen.getByTestId(`vaos-appts__clinic-location-${apptId}`),
    ).to.have.attribute('style', 'text-decoration: none;');
  });
  it('should show without location when not provided, but show clinic name when it is', async () => {
    // Arrange
    const locationModified = { ...clinicLocationInfo };
    locationModified.location = undefined;
    // Act
    const screen = renderWithStoreAndRouter(
      <AppointmentClinicInfo
        show
        apptId="123"
        clinicLocationInfo={locationModified}
        isCanceled={false}
      />,
      {
        initialState,
      },
    );

    // Assert
    expect(screen.queryByTestId(`vaos-appts__clinic-namelocation-${apptId}`)).to
      .exist;
    expect(
      screen.getByTestId(`vaos-appts__clinic-name-${apptId}`),
    ).to.have.text('Clinic: Test Clinic');
    expect(screen.queryByTestId(`vaos-appts__clinic-location-${apptId}`)).not.to
      .exist;
    expect(
      screen.getByTestId(`vaos-appts__clinic-name-${apptId}`),
    ).to.have.attribute('style', 'text-decoration: none;');
  });
});
