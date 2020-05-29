import React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';

import FacilityAddress from '../../components/FacilityAddress';

const facility = {
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
  telecom: [{ system: 'phone', value: '858-689-2241' }],
  hoursOfOperation: [],
};

describe('VAOS <FacilityAddress>', () => {
  it('should render address for va facility', () => {
    const address = facility.address;
    const tree = shallow(<FacilityAddress facility={facility} />);
    expect(tree.text()).to.contain(address.line[0]);
    expect(tree.text()).to.contain(address.city);
    expect(tree.text()).to.contain(address.state);
    expect(tree.text()).to.contain(address.postalCode);
    expect(tree.text()).to.contain(facility.telecom[0].value);
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
