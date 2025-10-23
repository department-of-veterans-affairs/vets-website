import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import CallVBACenter from 'platform/static-data/CallVBACenter';
import ErrorText from '../../../components/ErrorText';

describe('<ErrorText />', () => {
  it('renders without crashing', () => {
    const wrapper = shallow(<ErrorText />);
    wrapper.unmount(<ErrorText />);
  });

  it('contains the expected static text', () => {
    const wrapper = shallow(<ErrorText />);
    expect(wrapper.text()).to.contain('If it still doesn’t work, please');
    wrapper.unmount();
  });

  it('renders <CallVBACenter />', () => {
    const wrapper = shallow(<ErrorText />);
    expect(wrapper.find(CallVBACenter)).to.have.lengthOf(1);
    wrapper.unmount();
  });
});
