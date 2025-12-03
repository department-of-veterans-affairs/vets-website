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
        apptId="123"
        clinicLocationInfo={clinicLocationInfo}
      />,
    );
  });
  it('renders clinic name and location', async () => {
    // Act
    const screen = renderWithStoreAndRouter(
      <AppointmentClinicInfo
        apptId="123"
        clinicLocationInfo={clinicLocationInfo}
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
    expect(
      screen.getByTestId(`vaos-appts__clinic-location-${apptId}`),
    ).to.have.text('Location: East Hallway, 3rd Floor, Room 301');
  });
  it('cancelled has line through all displayed text', async () => {
    // Act
    const screen = renderWithStoreAndRouter(
      <AppointmentClinicInfo
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
  it('does not have name, but does have location', async () => {
    // Arrange
    const locationModified = { ...clinicLocationInfo };
    locationModified.name = undefined;
    // Act
    const screen = renderWithStoreAndRouter(
      <AppointmentClinicInfo
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
  it('does not have location, but does have clinic name', async () => {
    // Arrange
    const locationModified = { ...clinicLocationInfo };
    locationModified.location = undefined;
    // Act
    const screen = renderWithStoreAndRouter(
      <AppointmentClinicInfo
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
