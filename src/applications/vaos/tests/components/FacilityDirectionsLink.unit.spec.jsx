import React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';

import FacilityDirectionsLink from '../../components/FacilityDirectionsLink';

const location = {
  id: 'vba_377c',
  type: 'va_facilities',
  uniqueId: '377c',
  name: 'Marine Corp Air Station Miramar Pre-Discharge Claims Intake Site',
  facilityType: 'va_benefits_facility',
  classification: null,
  website: 'NULL',
  lat: 32.88772959,
  long: -117.1329899,
  address: {
    mailing: {},
    physical: {
      zip: '92145',
      city: 'San Diego',
      state: 'CA',
      address1: 'Marine Corps Air Station Miramar, 535 Miramar Way',
      address2: null,
      address3: null,
    },
  },
  phone: { fax: null, main: '858-689-2241' },
  hours: {
    monday: '8:00AM-4:00PM',
    tuesday: '8:00AM-4:00PM',
    wednesday: '8:00AM-4:00PM',
    thursday: '8:00AM-4:00PM',
    friday: '8:00AM-4:00PM',
    saturday: 'Closed',
    sunday: 'Closed',
  },
  services: { benefits: { other: null, standard: [] } },
  feedback: {},
  access: {},
};

const ccLocation = {
  id: 'ccp_1669699724',
  type: 'cc_provider',
  uniqueId: '1669699724',
  name: 'Ziad A Tomimi MD A Professional Medical Corporation',
  address: {
    street: '4445 Eastgate Mall',
    city: 'San Diego',
    state: 'CA',
    zip: '92121',
  },
  email: 'unknown@unknown.com',
  phone: null,
  fax: null,
  lat: 32.878391,
  long: -117.210539,
  prefContact: null,
  accNewPatients: null,
  gender: null,
  specialty: [
    { name: 'Clinic/Center - Primary Care', desc: 'Definition to come...' },
  ],
  caresitePhone: null,
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

  it('should render directions for cc facility', () => {
    const tree = shallow(<FacilityDirectionsLink location={ccLocation} />);
    expect(tree.find('a').props().href).to.equal(
      'https://maps.google.com?saddr=Current+Location&daddr=4445 Eastgate Mall, San Diego, CA 92121',
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
