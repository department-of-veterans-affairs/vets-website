import React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';
import AppointmentInfo from '../../components/AppointmentInfo';
import testFacilityV0 from '../../constants/mock-facility-v0.json';
import testFacilityV1 from '../../constants/mock-facility-v1.json';

describe('<AppointmentInfo>', () => {
  it('Should render appointment info component v0', () => {
    const wrapper = shallow(<AppointmentInfo location={testFacilityV0} />);
    expect(wrapper.type()).to.not.equal(null);
    wrapper.unmount();
  });

  it('Should render appointment info  v1', () => {
    const wrapper = shallow(<AppointmentInfo location={testFacilityV1} />);
    expect(wrapper.type()).to.not.equal(null);
    wrapper.unmount();
  });
});
