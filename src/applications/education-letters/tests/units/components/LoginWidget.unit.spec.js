import { expect } from 'chai';
import React from 'react';
import { mount } from 'enzyme';
import { Provider } from 'react-redux';
import configureMockStore from 'redux-mock-store';
import LoginWidget from '../../../components/LoginWidget';

describe('Render Visitor UI', () => {
  const mockStore = configureMockStore();
  const initialState = {
    toggleLoginModal: () => {},
    user: {
      login: {
        currentlyLoggedIn: false,
        hasCheckedKeepAlive: true,
      },
    },
  };
  it('should show h3 font sized header', () => {
    const store = mockStore(initialState);
    const wrapper = mount(
      <Provider store={store}>
        <LoginWidget />
      </Provider>,
    );

    expect(wrapper.text()).to.include(
      'Sign in to download your VA education decision letter',
    );
    expect(wrapper.text()).to.not.include('Login to download');

    wrapper.unmount();
  });

  it('should show sign in button', () => {
    const store = mockStore(initialState);
    const wrapper = mount(
      <Provider store={store}>
        <LoginWidget />
      </Provider>,
    );

    const button = wrapper.find('va-button');

    expect(button.props().text).to.include('Sign in or create an account');
    expect(button.props().text).to.not.include('Login or create an account');

    wrapper.unmount();
  });
});

describe('Render logged In User UI', () => {
  const mockStore = configureMockStore();
  const initialState = {
    toggleLoginModal: () => {},
    user: {
      login: {
        currentlyLoggedIn: true,
        hasCheckedKeepAlive: false,
      },
    },
  };
  it('should show continue button', () => {
    const store = mockStore(initialState);
    const wrapper = mount(
      <Provider store={store}>
        <LoginWidget />
      </Provider>,
    );

    expect(wrapper.text()).to.include(
      'Download your VA education decision letter',
    );

    wrapper.unmount();
  });
});
