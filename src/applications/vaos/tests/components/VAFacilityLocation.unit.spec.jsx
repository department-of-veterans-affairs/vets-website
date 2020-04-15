import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';

import VAFacilityLocation from '../../components/VAFacilityLocation';

describe('VAOS <VAFacilityLocation>', () => {
  it('should render without facility', () => {
    const tree = shallow(<VAFacilityLocation clinicName="Testing" />);

    expect(tree.text()).to.contain('Testing');
    expect(tree.find('a').props().href).to.equal('/find-locations');

    tree.unmount();
  });

  it('should render without facility and with facility id', () => {
    const tree = shallow(
      <VAFacilityLocation facilityId="123" clinicName="Testing" />,
    );

    expect(tree.text()).to.contain('Testing');
    expect(tree.find('a').props().href).to.equal(
      '/find-locations/facility/vha_123',
    );

    tree.unmount();
  });

  it('should render with facility', () => {
    const tree = shallow(
      <VAFacilityLocation
        facility={{ name: 'Facility name' }}
        clinicName="Testing"
      />,
    );

    expect(tree.text()).to.contain('Testing');
    expect(tree.text()).to.contain('Facility name');
    expect(tree.find('FacilityAddress').exists()).to.be.true;

    tree.unmount();
  });
});
