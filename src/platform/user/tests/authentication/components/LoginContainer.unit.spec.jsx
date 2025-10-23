import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';

import LoginContainer, {
  logoSrc,
} from 'platform/user/authentication/components/LoginContainer';

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

describe('LoginContainer', () => {
  beforeEach(() => {
    fakeWindow();
  });

  afterEach(() => {
    global.window = oldWindow;
  });

  it('should render', async () => {
    const wrapper = shallow(<LoginContainer />);
    const img = wrapper.find('img');

    expect(img.prop('src')).eql(`${logoSrc}`);
    wrapper.unmount();
  });

  it('should NOT render the VA logo on the Unified Sign in Page', () => {
    global.window.location = '/sign-in/?application=mhv';
    const wrapper = shallow(<LoginContainer isUnifiedSignIn />);
    const img = wrapper.find('img');
    expect(img.exists()).to.be.false;
    wrapper.unmount();
  });

  it('should render the LoginHeader', async () => {
    const wrapper = shallow(<LoginContainer />);
    const loginHeader = wrapper.find('LoginHeader');
    expect(loginHeader).to.not.be.null;
    wrapper.unmount();
  });

  it('should render the LoginActions', async () => {
    const wrapper = shallow(<LoginContainer />);
    const loginActions = wrapper.find('LoginActions');
    expect(loginActions).to.not.be.null;
    wrapper.unmount();
  });

  it('should render the LoginInfo', async () => {
    const wrapper = shallow(<LoginContainer />);
    const loginInfo = wrapper.find('LoginInfo');
    expect(loginInfo).to.not.be.null;
    wrapper.unmount();
  });

  it('should render a va-link "VA staff" when application is vaoccmobile', () => {
    global.window.location = '/sign-in/?application=vaoccmobile';
    const wrapper = shallow(
      <LoginContainer isUnifiedSignIn externalApplication="vaoccmobile" />,
    );
    const loginInfo = wrapper.find('va-link[text="VA staff"]');
    expect(loginInfo).to.not.be.null;
    wrapper.unmount();
  });
});
