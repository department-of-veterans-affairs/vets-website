import React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';

import FacilityDirectionsLink from '../../components/FacilityDirectionsLink';

const location = {
  id: 'vba_377c',
  type: 'va_facilities',
  attributes: {
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
  },
};

describe('VAOS <FacilityDirectionsLink>', () => {
  it('should render', () => {
    const tree = shallow(<FacilityDirectionsLink location={location} />);
    expect(tree.find('a').props().href).to.equal(
      'https://maps.google.com?saddr=Current+Location&daddr=Marine Corps Air Station Miramar, 535 Miramar Way, San Diego, CA 92145',
    );
    tree.unmount();
  });
});
