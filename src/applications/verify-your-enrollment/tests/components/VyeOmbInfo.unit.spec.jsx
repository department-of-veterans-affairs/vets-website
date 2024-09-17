import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import VyeOmbInfo from '../../components/VyeOmbInfo';

describe('VyeOmbInfo', () => {
  it('should render without crashing', () => {
    const wrapper = shallow(<VyeOmbInfo />);
    expect(wrapper.exists()).to.be.ok;
    wrapper.unmount();
  });
});
