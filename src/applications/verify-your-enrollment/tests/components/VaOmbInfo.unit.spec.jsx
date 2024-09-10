import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import VaOmbInfo from '../../components/VaOmbInfo';

describe('VaOmbInfo', () => {
  it('should render without crashing', () => {
    const wrapper = shallow(<VaOmbInfo />);
    expect(wrapper.exists()).to.be.ok;
    wrapper.unmount();
  });
});
