import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import Dashboard from '../../containers/Dashboard';

describe('Dashboard Garden path', () => {
  it('should render navigation', () => {
    const wrapper = shallow(<Dashboard POApermissions />);

    expect(wrapper.find('.nav').length).to.equal(1);
    wrapper.unmount();
  });

  it('should render notifications', () => {
    const wrapper = shallow(<Dashboard POApermissions />);

    expect(wrapper.find('.notif').length).to.equal(1);
    wrapper.unmount();
  });

  it('should render primary tasks area', () => {
    const wrapper = shallow(<Dashboard POApermissions />);

    expect(wrapper.find('.primary').length).to.equal(1);
    wrapper.unmount();
  });

  it('should render sidebar', () => {
    const wrapper = shallow(<Dashboard POApermissions />);

    expect(wrapper.find('.left').length).to.equal(1);
    wrapper.unmount();
  });
});
