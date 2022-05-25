import React from 'react';
import { mount } from 'enzyme';
import { expect } from 'chai';
import { HelloWorld } from '../components/hello-world';

describe('<HelloWorld>', () => {
  it('should mount form', () => {
    const wrapper = mount(<HelloWorld />);
    expect(wrapper.find('.message').exists()).to.be.true;
    wrapper.unmount();
  });
  it('should display message', () => {
    const wrapper = mount(<HelloWorld />);
    expect(wrapper.find('.message').text()).to.equal('Hello World');
    wrapper.unmount();
  });
});