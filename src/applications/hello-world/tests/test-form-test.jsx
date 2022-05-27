import React from 'react';
import { mount } from 'enzyme';
import { expect } from 'chai';
import { TestForm } from '../components/test-form';
import * as HelloWorldApi from '../api/HelloWorldApi';
var sinon = require("sinon");

describe('form testing', () => {
  it('should mount form with default props', () => {
    const wrapper = mount(<TestForm/>);
    expect(wrapper.find('form').exists()).to.be.true;
    expect(wrapper.state().value).to.equal("");
    wrapper.unmount();
  });

  it('should mount form with props passed in', () => {
    const wrapper = mount(<TestForm value="hello"/>);
    expect(wrapper.find('form').exists()).to.be.true;
    expect(wrapper.state().value).to.equal("hello");
    wrapper.unmount();
  });

  it('should call handleSubmit', () => {
    const apiCall = sinon.stub(HelloWorldApi, 'helloWorld').returns({"hello":"world"});

    const wrapper = mount(<TestForm />);
    wrapper.find('.button').simulate('click');
    expect(apiCall.called).to.be.true;

    apiCall.restore();
    wrapper.unmount();
  });
});