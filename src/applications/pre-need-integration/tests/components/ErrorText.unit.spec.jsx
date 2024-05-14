import React from 'react';
import { expect } from 'chai';
import { mount } from 'enzyme';
import ErrorText from '../../components/ErrorText';

describe('Pre-need ErrorText component', () => {
  it('renders and unmounts without crashing', () => {
    const wrapper = mount(<ErrorText />);
    expect(wrapper.exists()).to.be.true;
    wrapper.unmount();
    expect(wrapper.exists()).to.be.false;
  });

  it('should have the CallNCACenter component rendered within it', () => {
    const wrapper = mount(<ErrorText />);
    const CallNCACenterComponent = wrapper.find('CallNCACenter');
    expect(CallNCACenterComponent.exists()).to.be.true;
    wrapper.unmount();
  });
});
