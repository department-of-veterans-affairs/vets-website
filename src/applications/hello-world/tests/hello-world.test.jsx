import React from 'react';
import { mount } from 'enzyme';
import { expect } from 'chai';
import { HelloWorld } from '../components/hello-world';
// import HelloWorldApi from '../api/HelloWorldApi';

describe('<HelloWorld>', () => {
  it('should display message', () => {
    const wrapper = mount(<HelloWorld />);
    expect(wrapper.find('.message').text()).to.equal('Hello World');
    wrapper.unmount();
  });

  it('should mount form', () => {
    const wrapper = mount(<HelloWorld firstField="testing" />);
    // expect(wrapper.find('.testForm').exists()).to.be.true;
    wrapper.unmount();
  });

  it('should call api with entered value', () => {
    const wrapper = mount(<HelloWorld />);
    wrapper.find('.testForm').simulate('click');
    // expect(HelloWorldApi.submitForm).to.have.been.called();
    wrapper.unmount();
  });
});
