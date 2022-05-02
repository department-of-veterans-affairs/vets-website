import React from 'react';
import { expect } from 'chai';
import { shallow, mount } from 'enzyme';
import sinon from 'sinon';
import { AUTH_ERROR } from 'platform/user/authentication/constants';
import localStorage from 'platform/utilities/storage/localStorage';
import RenderErrorUI from '../components/RenderErrorContainer';
import { AuthApp } from '../containers/AuthApp';

const props = {
  location: {
    pathname: '/auth/login/callback',
    query: { auth: 'fail' },
    error: {
      message: 'Can not auth',
    },
  },
};

describe('AuthApp', () => {
  it('should render', () => {
    const wrapper = mount(<RenderErrorUI />);

    expect(wrapper.find('h1').exists()).to.be.true;
    expect(wrapper.find('em').text()).to.include(AUTH_ERROR.DEFAULT);

    wrapper.unmount();
  });
  it('should display error from api', () => {
    const wrapper = shallow(<RenderErrorUI auth="fail" code="005" />);

    expect(wrapper.find('em').text()).to.include('005');

    wrapper.unmount();
  });
  it('should check the div', () => {
    const wrapper = shallow(<AuthApp {...props} />);

    expect(wrapper.exists('div.vads-u-padding-y--5')).to.be.true;
    wrapper.unmount();
  });
  it('should fire validateSession', () => {
    localStorage.setItem('hasSession', true);
    const wrapper = shallow(<AuthApp {...props} />);
    const instance = wrapper.instance();
    const spy = sinon.spy(instance, 'validateSession');
    instance.componentDidMount();

    expect(spy.called).to.be.true;

    localStorage.removeItem('hasSession');
    wrapper.unmount();
  });
  it('should not fire validateSession', () => {
    const wrapper = shallow(<AuthApp {...props} />);
    const instance = wrapper.instance();
    const spy = sinon.spy(instance, 'validateSession');
    instance.componentDidMount();

    expect(spy.called).to.be.false;
    wrapper.unmount();
  });
  it('should fire handleAuthForceNeeded', () => {
    props.location.query.auth = 'force-needed';
    localStorage.setItem('hasSession', true);
    const wrapper = shallow(<AuthApp {...props} />);
    const instance = wrapper.instance();
    const spy = sinon.spy(instance, 'handleAuthForceNeeded');
    instance.componentDidMount();

    expect(spy.called).to.be.true;
    localStorage.removeItem('hasSession');
    wrapper.unmount();
  });
  it('should fire handleAuthSuccess', () => {
    localStorage.setItem('hasSession', true);
    const wrapper = shallow(<AuthApp {...props} />);
    const instance = wrapper.instance();
    const spy = sinon.spy(instance, 'handleAuthSuccess');
    instance.handleAuthSuccess();

    expect(spy.called).to.be.true;
    localStorage.removeItem('hasSession');
    wrapper.unmount();
  });
  it('should fire handleAuthError', () => {
    const error = {
      error: {
        message: 'Can not auth',
      },
    };
    localStorage.setItem('hasSession', true);
    const wrapper = shallow(<AuthApp {...props} />);
    const instance = wrapper.instance();
    const spy = sinon.spy(instance, 'handleAuthError');
    instance.handleAuthError(error);

    expect(spy.called).to.be.true;
    localStorage.removeItem('hasSession');
    wrapper.unmount();
  });
});
