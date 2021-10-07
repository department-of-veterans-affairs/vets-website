// Dependencies
import React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';
// Relative
import MaintenanceBanner from './index';
import ReusableMaintenanceBanner from '@department-of-veterans-affairs/component-library/MaintenanceBanner';

describe('<MaintenanceBanner>', () => {
  it('should render the maintenance banner', () => {
    const wrapper = shallow(<MaintenanceBanner />);
    expect(wrapper.find(ReusableMaintenanceBanner)).to.not.equal(null);
    wrapper.unmount();
  });
});
