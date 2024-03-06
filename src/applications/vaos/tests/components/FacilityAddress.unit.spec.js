import React from 'react';
import { expect } from 'chai';
import { renderWithStoreAndRouter } from '~/platform/testing/unit/react-testing-library-helpers';
import { stateNames } from '../../components/State';

import FacilityAddress from '../../components/FacilityAddress';

const initialState = {};
const facility = {
  id: '377c',
  name: 'Marine Corp Air Station Miramar Pre-Discharge Claims Intake Site',
  position: {
    latitude: 32.88772959,
    longitude: -117.1329899,
  },
  address: {
    postalCode: '92145',
    city: 'San Diego',
    state: 'CA',
    line: ['Marine Corps Air Station Miramar, 535 Miramar Way'],
  },
  telecom: [{ system: 'phone', value: '858-689-2241' }],
  hoursOfOperation: [],
};

const location = {
  clinicName: 'Friendly name',
  clinicPhysicalLocation: 'Physical location',
};

describe('VAOS Component: FacilityAddress', () => {
  it('should render address for va facility', () => {
    const { address } = facility;
    const screen = renderWithStoreAndRouter(
      <FacilityAddress facility={facility} clinicName={location.clinicName} />,
      {
        initialState,
      },
    );
    expect(screen.getByText(new RegExp(`${address.line[0]}`))).to.exist;
    expect(screen.baseElement).to.contain.text(
      `${address.city}, ${stateNames[address.state]}${address.state} ${
        address.postalCode
      }`,
    );
    expect(screen.getByTestId('facility-telephone')).to.exist;

    expect(screen.queryByText('Directions')).not.to.exist;
    expect(screen.queryByText(/Friendly name/)).to.exist;
    expect(screen.queryByText(/Physical location/)).not.to.exist;
  });

  it('should show directions link if showDirectionsLink === true', () => {
    const { address } = facility;
    const screen = renderWithStoreAndRouter(
      <FacilityAddress facility={facility} showDirectionsLink />,
      {
        initialState,
      },
    );

    expect(screen.getByText(new RegExp(`${address.line[0]}`))).to.exist;
    expect(screen.baseElement).to.contain.text(
      `${address.city}, ${stateNames[address.state]}${address.state} ${
        address.postalCode
      }`,
    );
    expect(screen.getByTestId('facility-telephone')).to.exist;

    expect(screen.getByText(/^Directions/)).to.exist;
  });

  it('should render COVID vaccine phone line for va facility', () => {
    const { address } = facility;
    const facilityWithCovidLine = {
      ...facility,
      telecom: [
        {
          system: 'covid',
          value: '858-689-2222',
        },
      ],
    };
    const screen = renderWithStoreAndRouter(
      <FacilityAddress facility={facilityWithCovidLine} showCovidPhone />,
      {
        initialState,
      },
    );

    expect(screen.getByText(new RegExp(`${address.line[0]}`))).to.exist;
    expect(screen.baseElement).to.contain.text(
      `${address.city}, ${stateNames[address.state]}${address.state} ${
        address.postalCode
      }`,
    );
    expect(screen.getByTestId('facility-telephone')).to.exist;

    expect(screen.queryByText('Directions')).to.be.null;
  });

  it('should render clinic physical location when vaOnlineSchedulingPhysicalLocation is on', () => {
    const { address } = facility;
    const screen = renderWithStoreAndRouter(
      <FacilityAddress
        facility={facility}
        clinicName={location.clinicName}
        clinicPhysicalLocation={location.clinicPhysicalLocation}
      />,
      {
        initialState: {
          ...initialState,
          featureToggles: {
            vaOnlineSchedulingPhysicalLocation: true,
          },
        },
      },
    );
    expect(screen.getByText(new RegExp(`${address.line[0]}`))).to.exist;
    expect(screen.baseElement).to.contain.text(
      `${address.city}, ${stateNames[address.state]}${address.state} ${
        address.postalCode
      }`,
    );
    expect(screen.queryByText(/Friendly name/)).to.exist;
    expect(screen.queryByText(/Physical location/)).to.exist;
  });
});
