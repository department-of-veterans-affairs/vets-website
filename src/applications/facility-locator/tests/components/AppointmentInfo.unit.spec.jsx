import React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';
import AppointmentInfo from '../../components/AppointmentInfo';
import testFacilityV0 from '../../constants/mock-facility-v0.json';
import testFacilityV1 from '../../constants/mock-facility-v1.json';

describe('<AppointmentInfo>', () => {
  it('Should render appointment info snapshot v0', () => {
    const wrapper = shallow(<AppointmentInfo location={testFacilityV0} />);
    expect(wrapper).to.matchSnapshot();
    wrapper.unmount();
  });

  it('Should render appointment info snapshot v1', () => {
    const wrapper = shallow(<AppointmentInfo location={testFacilityV1.data} />);
    expect(wrapper).to.matchSnapshot();
    wrapper.unmount();
  });
});
