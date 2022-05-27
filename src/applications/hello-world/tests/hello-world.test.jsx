import React from 'react';
import { mount } from 'enzyme';
import { expect } from 'chai';
import sinon from 'sinon';
import { HelloWorld } from '../components/hello-world';
import * as HelloWorldApi from '../api/HelloWorldApi';

describe('<HelloWorld>', () => {

  it('should display message', () => {
    const wrapper = mount(<HelloWorld />);
    expect(wrapper.find('.message').text()).to.equal('Hello World');
    wrapper.unmount();
  });

  it('should mount form', () => {
    const wrapper = mount(<HelloWorld />);
    expect(wrapper.find('.testForm').exists()).to.be.true;
    wrapper.unmount();
  });

  it('should get message from API', () => {
    const getMessage = sinon.stub(HelloWorldApi, 'getMessage2');
    const wrapper = mount(<HelloWorld form={{ firstField: 'testing field' }} />);
    wrapper.find('.button').simulate('click');

    expect(getMessage.called).to.be.true;

    getMessage.restore();
    wrapper.unmount();
  });
});
