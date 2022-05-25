import React from 'react';
import { mount } from 'enzyme';
import { expect } from 'chai';
import sinon from 'sinon';
import { HelloWorld } from '../components/hello-world';
import submitForm from '../api/HelloWorldApi';

describe('<HelloWorld>', () => {
  it('should display message', () => {
    const wrapper = mount(<HelloWorld />);
    expect(wrapper.find('.message').text()).to.equal('Hello World');
    wrapper.unmount();
  });

  it('should mount form', () => {
    const wrapper = mount(<HelloWorld firstField="testing" />);
    // eslint-disable-next-line no-unused-expressions
    expect(wrapper.find('.testForm').exists()).to.be.true;
    wrapper.unmount();
  });

  it('should call api with entered value', () => {
    const wrapper = mount(<HelloWorld />);
    const spy = sinon.spy(submitForm);
    // wrapper.find('.testForm').simulate('submit');
    wrapper.find('.button').simulate('click');
    // eslint-disable-next-line no-unused-expressions
    expect(spy.called).to.be.true;
    wrapper.unmount();
  });
});
