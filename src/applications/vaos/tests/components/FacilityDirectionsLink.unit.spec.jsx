import React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';

import FacilityDirectionsLink from '../../components/FacilityDirectionsLink';

const location = {
  id: 'var377c',
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
};

const ccAppt = {
  appointmentRequestId: '8a4885896a22f88f016a2c8834b1005d',
  distanceEligibleConfirmed: true,
  providerPractice: 'Atlantic Medical Care',
  providerPhone: '(407) 555-1212',
  address: {
    street: '123 Main Street',
    city: 'Orlando',
    state: 'FL',
    zipCode: '32826',
  },
  instructionsToVeteran: 'Please arrive 15 minutes ahead of appointment.',
  appointmentTime: '01/25/2020 13:30:00',
  timeZone: '-04:00 EDT',
  id: '8a4885896a22f88f016a2c8834b1005d',
};

describe('VAOS <FacilityDirectionsLink>', () => {
  it('should render directions for va facility', () => {
    const tree = shallow(<FacilityDirectionsLink location={location} />);
    expect(tree.find('a').props().href).to.equal(
      'https://maps.google.com?saddr=Current+Location&daddr=Marine Corps Air Station Miramar, 535 Miramar Way, San Diego, CA 92145',
    );
    tree.unmount();
  });

  it('should render directions from cc appointment', () => {
    const tree = shallow(<FacilityDirectionsLink location={ccAppt} />);
    expect(tree.find('a').props().href).to.equal(
      'https://maps.google.com?saddr=Current+Location&daddr=123 Main Street, Orlando, FL 32826',
    );
    tree.unmount();
  });
});
