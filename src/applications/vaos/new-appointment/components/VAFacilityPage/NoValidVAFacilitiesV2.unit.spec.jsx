import React from 'react';
import { expect } from 'chai';
import { renderWithStoreAndRouter } from '../../../tests/mocks/setup';
import NoValidVAFacilities from './NoValidVAFacilitiesV2';

describe('VAOS Component: NoValidVAFacilitiesV2', () => {
  const createFacility = (
    id,
    {
      directEnabled = false,
      requestEnabled = false,
      bookedAppointments = false,
      apptRequests = false,
    } = {},
  ) => ({
    id,
    name: `Facility ${id}`,
    address: {
      city: 'Test City',
      state: 'TC',
    },
    telecom: [{ system: 'phone', value: '555-555-5555' }],
    legacyVAR: {
      distanceFromResidentialAddress: 10,
      settings: {
        primaryCare: {
          direct: { enabled: directEnabled },
          request: { enabled: requestEnabled },
          bookedAppointments,
          apptRequests,
        },
      },
    },
  });

  const typeOfCare = {
    id: 'primaryCare',
    name: 'Primary care',
  };

  it('should filter unsupported facilities using direct.enabled and request.enabled when useVpg is false', () => {
    const facilities = [
      createFacility('983', {
        directEnabled: false,
        requestEnabled: false,
        bookedAppointments: true,
        apptRequests: true,
      }),
      createFacility('984', {
        directEnabled: true,
        requestEnabled: false,
        bookedAppointments: false,
        apptRequests: false,
      }),
    ];

    const screen = renderWithStoreAndRouter(
      <NoValidVAFacilities
        facilities={facilities}
        sortMethod="distanceFromResidentialAddress"
        typeOfCare={typeOfCare}
        address={null}
      />,
      {
        initialState: {
          featureToggles: {
            vaOnlineSchedulingUseVpg: false,
          },
        },
      },
    );

    // Facility 983 should be shown (unsupported because direct and request are false)
    expect(screen.getByText('Facility 983')).to.exist;
    // Facility 984 should NOT be shown (supported because direct.enabled is true)
    expect(screen.queryByText('Facility 984')).to.be.null;
  });

  it('should filter unsupported facilities using bookedAppointments and apptRequests when useVpg is true', () => {
    const facilities = [
      createFacility('983', {
        directEnabled: true,
        requestEnabled: true,
        bookedAppointments: false,
        apptRequests: false,
      }),
      createFacility('984', {
        directEnabled: false,
        requestEnabled: false,
        bookedAppointments: true,
        apptRequests: false,
      }),
    ];

    const screen = renderWithStoreAndRouter(
      <NoValidVAFacilities
        facilities={facilities}
        sortMethod="distanceFromResidentialAddress"
        typeOfCare={typeOfCare}
        address={null}
      />,
      {
        initialState: {
          featureToggles: {
            vaOnlineSchedulingUseVpg: true,
          },
        },
      },
    );

    // Facility 983 should be shown (unsupported because bookedAppointments and apptRequests are false)
    expect(screen.getByText('Facility 983')).to.exist;
    // Facility 984 should NOT be shown (supported because bookedAppointments is true)
    expect(screen.queryByText('Facility 984')).to.be.null;
  });

  it('should show up to 5 facilities when no address is provided', () => {
    const facilities = [
      createFacility('1', { directEnabled: false, requestEnabled: false }),
      createFacility('2', { directEnabled: false, requestEnabled: false }),
      createFacility('3', { directEnabled: false, requestEnabled: false }),
      createFacility('4', { directEnabled: false, requestEnabled: false }),
      createFacility('5', { directEnabled: false, requestEnabled: false }),
      createFacility('6', { directEnabled: false, requestEnabled: false }),
    ];

    const screen = renderWithStoreAndRouter(
      <NoValidVAFacilities
        facilities={facilities}
        sortMethod="distanceFromResidentialAddress"
        typeOfCare={typeOfCare}
        address={null}
      />,
      {
        initialState: {
          featureToggles: {
            vaOnlineSchedulingUseVpg: false,
          },
        },
      },
    );

    // Should show first 5 facilities
    expect(screen.getByText('Facility 1')).to.exist;
    expect(screen.getByText('Facility 5')).to.exist;
    // 6th facility should NOT be shown
    expect(screen.queryByText('Facility 6')).to.be.null;
  });

  it('should show up to 2 facilities when address is provided', () => {
    const facilities = [
      createFacility('1', { directEnabled: false, requestEnabled: false }),
      createFacility('2', { directEnabled: false, requestEnabled: false }),
      createFacility('3', { directEnabled: false, requestEnabled: false }),
    ];

    const screen = renderWithStoreAndRouter(
      <NoValidVAFacilities
        facilities={facilities}
        sortMethod="distanceFromResidentialAddress"
        typeOfCare={typeOfCare}
        address={{ addressLine1: '123 Main St' }}
      />,
      {
        initialState: {
          featureToggles: {
            vaOnlineSchedulingUseVpg: false,
          },
        },
      },
    );

    // Should show first 2 facilities
    expect(screen.getByText('Facility 1')).to.exist;
    expect(screen.getByText('Facility 2')).to.exist;
    // 3rd facility should NOT be shown
    expect(screen.queryByText('Facility 3')).to.be.null;
  });

  it('should display warning message about not being able to schedule online', () => {
    const facilities = [
      createFacility('983', { directEnabled: false, requestEnabled: false }),
    ];

    const screen = renderWithStoreAndRouter(
      <NoValidVAFacilities
        facilities={facilities}
        sortMethod="distanceFromResidentialAddress"
        typeOfCare={typeOfCare}
        address={null}
      />,
      {
        initialState: {
          featureToggles: {
            vaOnlineSchedulingUseVpg: false,
          },
        },
      },
    );

    expect(screen.getByRole('heading', { level: 2 })).to.exist;
    expect(
      screen.getByText(/None of your VA facilities have online scheduling/i),
    ).to.exist;
  });
});
