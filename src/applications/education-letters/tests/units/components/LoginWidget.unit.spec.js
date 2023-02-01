import { expect } from 'chai';
import React from 'react';
import { mount } from 'enzyme';
import { Provider } from 'react-redux';
import configureMockStore from 'redux-mock-store';
import LoginWidget from '../../../components/LoginWidget';

describe('Render Sign up/ login UI', () => {
  const mockStore = configureMockStore();

  it('should show h3 font sized header', () => {
    const store = mockStore({});
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
    const store = mockStore({});
    const wrapper = mount(
      <Provider store={store}>
        <LoginWidget />
      </Provider>,
    );

    expect(wrapper.text()).to.include('Sign in or create an account');
    expect(wrapper.text()).to.not.include('Login or create an account');

    wrapper.unmount();
  });
});
