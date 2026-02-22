import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';

import LoginContainer from 'platform/user/authentication/components/LoginContainer';
import { TOGGLE_NAMES } from 'platform/utilities/feature-toggles';
import { Provider } from 'react-redux';

let oldWindow;
const fakeWindow = () => {
  oldWindow = global.window;
  global.window = Object.create(global.window);
  Object.assign(global.window, {
    location: {
      get: () => global.window.location,
      set: value => {
        global.window.location = value;
      },
      pathname: '',
      search: '',
    },
  });
};

const store = {
  getState: () => ({
    featureToggles: {
      [TOGGLE_NAMES.identityIal2FullEnforcement]: false,
    },
  }),
  dispatch: () => {},
  subscribe: () => {},
};

describe('LoginContainer', () => {
  beforeEach(() => {
    fakeWindow();
  });

  afterEach(() => {
    global.window = oldWindow;
  });

  it('should render', async () => {
    const wrapper = shallow(
      <Provider store={store}>
        <LoginContainer />
      </Provider>,
    );
    const img = wrapper.find('img');
    expect(img).to.not.be.null;
    wrapper.unmount();
  });

  it('should NOT render the VA logo on the Unified Sign in Page', () => {
    global.window.location = '/sign-in/?application=mhv';
    const wrapper = shallow(
      <Provider store={store}>
        <LoginContainer isUnifiedSignIn />
      </Provider>,
    );
    const img = wrapper.find('img');
    expect(img.exists()).to.be.false;
    wrapper.unmount();
  });

  it('should render the LoginHeader', async () => {
    const wrapper = shallow(
      <Provider store={store}>
        <LoginContainer />
      </Provider>,
    );
    const loginHeader = wrapper.find('LoginHeader');
    expect(loginHeader).to.not.be.null;
    wrapper.unmount();
  });

  it('should render the LoginActions', async () => {
    const wrapper = shallow(
      <Provider store={store}>
        <LoginContainer />
      </Provider>,
    );
    const loginActions = wrapper.find('LoginActions');
    expect(loginActions).to.not.be.null;
    wrapper.unmount();
  });

  it('should render the LoginInfo', async () => {
    const wrapper = shallow(
      <Provider store={store}>
        <LoginContainer />
      </Provider>,
    );
    const loginInfo = wrapper.find('LoginInfo');
    expect(loginInfo).to.not.be.null;
    wrapper.unmount();
  });

  it('should render a va-link "VA staff" when application is vaoccmobile', () => {
    global.window.location = '/sign-in/?application=vaoccmobile';
    const wrapper = shallow(
      <Provider store={store}>
        <LoginContainer isUnifiedSignIn externalApplication="vaoccmobile" />
      </Provider>,
    );
    const loginInfo = wrapper.find('va-link[text="VA staff"]');
    expect(loginInfo).to.not.be.null;
    wrapper.unmount();
  });
});
