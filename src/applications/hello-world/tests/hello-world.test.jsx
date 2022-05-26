import React from 'react';
import { mount } from 'enzyme';
import { expect } from 'chai';
import sinon from 'sinon';
import { apiRequest } from 'platform/utilities/api';
import { HelloWorld } from '../components/hello-world';
import * as HelloWorldApi from '../api/HelloWorldApi';

describe('<HelloWorld>', () => {
  const sandbox = sinon.createSandbox();

  beforeEach(function() {
    sandbox.mock(HelloWorldApi);
    sandbox.mock(HelloWorld.getMessage);
    sandbox.mock(apiRequest);
  });

  it('should display message', () => {
    const wrapper = mount(<HelloWorld />);
    expect(wrapper.find('.message').text()).to.equal('Hello World');
    wrapper.unmount();
  });

  it('should mount form', () => {
    const wrapper = mount(<HelloWorld />);
    // eslint-disable-next-line no-unused-expressions
    expect(wrapper.find('.testForm').exists()).to.be.true;
    wrapper.unmount();
  });

  it('should get message from API', async () => {
    const wrapper = mount(
      <HelloWorld form={{ firstField: 'testing field' }} />,
    );
    const instance = wrapper.instance();
    const expectedOutput = {
      form: {
        firstField: 'testing field',
      },
      status: 200,
    };

    wrapper
      .find('.button')
      .invoke('onClick')()
      .then(() => {
        expect(instance.state).to.eq(expectedOutput);
        expect(instance.state.form.firstField).to.eq('testing field');
        expect(wrapper.state().status).to.eq(200);
      });

    wrapper.unmount();
  });

  // it('should call api with entered value', () => {
  //   const wrapper = mount(<HelloWorld />);
  //   const spy = sinon.spy(submitForm);
  //   // wrapper.find('.testForm').simulate('submit');
  //   wrapper.find('.button').simulate('click');
  //   // eslint-disable-next-line no-unused-expressions
  //   expect(spy.called).to.be.true;
  //   wrapper.unmount();
  // });
});
