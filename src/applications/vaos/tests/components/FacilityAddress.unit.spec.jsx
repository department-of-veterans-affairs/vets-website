import React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';

import FacilityAddress from '../../components/FacilityAddress';

const facility = {
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

describe('VAOS <FacilityAddress>', () => {
  it('should render address for va facility', () => {
    const address = facility.address.physical;
    const tree = shallow(<FacilityAddress facility={facility} />);
    expect(tree.text()).to.contain(address.address1);
    expect(tree.text()).to.contain(address.city);
    expect(tree.text()).to.contain(address.state);
    expect(tree.text()).to.contain(address.zip);
    expect(tree.text()).to.contain(facility.phone.main);
    expect(tree.exists('FacilityDirectionsLink')).to.be.false;
    tree.unmount();
  });

  it('should show directions link if showDirectionsLink === true', () => {
    const tree = shallow(
      <FacilityAddress facility={facility} showDirectionsLink />,
    );
    expect(tree.exists('FacilityDirectionsLink')).to.be.true;
    tree.unmount();
  });
});
