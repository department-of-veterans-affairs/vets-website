import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';

import FacilityAddress from '../../components/FacilityAddress';

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

describe('VAOS <FacilityAddress>', () => {
  it('should render address for va facility', () => {
    const address = facility.address;
    const screen = render(<FacilityAddress facility={facility} />);

    expect(screen.getByText(new RegExp(`${address.line[0]}`))).to.exist;
    expect(screen.baseElement).to.contain.text(
      `${address.city}, ${address.state} ${address.postalCode}`,
    );
    expect(screen.getByRole('link', { name: '8 5 8. 6 8 9. 2 2 4 1.' })).to
      .exist;

    expect(screen.queryByText('Directions')).not.to.exist;
  });

  it('should show directions link if showDirectionsLink === true', () => {
    const address = facility.address;
    const screen = render(
      <FacilityAddress facility={facility} showDirectionsLink />,
    );

    expect(screen.getByText(new RegExp(`${address.line[0]}`))).to.exist;
    expect(screen.baseElement).to.contain.text(
      `${address.city}, ${address.state} ${address.postalCode}`,
    );
    expect(screen.getByRole('link', { name: '8 5 8. 6 8 9. 2 2 4 1.' })).to
      .exist;

    expect(screen.getByText(/^Directions/)).to.exist;
  });
});
