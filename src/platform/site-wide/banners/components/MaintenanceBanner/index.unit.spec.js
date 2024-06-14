// Dependencies
import React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';
// Relative
import MaintenanceBanner from './index';

describe('<MaintenanceBanner>', () => {
  it('should render the maintenance banner', () => {
    const wrapper = shallow(<MaintenanceBanner />);
    expect(wrapper.find('va-maintenance-banner')).to.not.equal(null);
    wrapper.unmount();
  });
});
