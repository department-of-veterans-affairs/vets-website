import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import Dashboard from '../../containers/Dashboard';

describe('Dashboard', () => {
  it('should render permissions alert if POA permissions is false', () => {
    const wrapper = shallow(<Dashboard POApermissions={false} />);

    expect(
      wrapper.text().includes('You are missing some permissions'),
    ).to.equal(true);
    wrapper.unmount();
  });

  it('should NOT render permissions alert if POA permissions is true', () => {
    const wrapper = shallow(<Dashboard POApermissions />);

    expect(
      wrapper.text().includes('You are missing some permissions'),
    ).to.equal(false);
    wrapper.unmount();
  });
});
