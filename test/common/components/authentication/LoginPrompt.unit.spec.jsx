import React from 'react';
import ReactTestUtils from 'react-dom/test-utils';
import SkinDeep from 'skin-deep';
import { expect } from 'chai';
import sinon from 'sinon';

import LoginPrompt from '../../../../src/js/common/components/authentication/LoginPrompt.jsx';

let windowOpen;
let oldWindow;

const fakeWindow = () => {
  oldWindow = global.window;
  windowOpen = sinon.stub();
  global.window = {
    open: windowOpen,
    dataLayer: []
  };
};

const restoreWindow = () => {
  global.window = oldWindow;
};

describe('<LoginPrompt>', () => {
  beforeEach(fakeWindow);
  const props = {
    loginUrl: 'http://login-url'
  };
  const tree = SkinDeep.shallowRender(<LoginPrompt {...props}/>);

  it('should render', () => {
    const vdom = tree.getRenderOutput();
    expect(vdom).to.not.be.undefined;
  });

  it('should open window if login link is clicked', () => {
    const loginPrompt = ReactTestUtils.renderIntoDocument(
      <LoginPrompt {...props }/>
    );
    windowOpen.returns({ focus: f => f });
    loginPrompt.handleLogin();
    expect(windowOpen.calledWith(`${props.loginUrl}&op=signin`, '_blank')).to.be.true;
  });

  it('should open window if sign-up link is clicked', () => {
    const loginPrompt = ReactTestUtils.renderIntoDocument(
      <LoginPrompt {...props }/>
    );
    windowOpen.returns({ focus: f => f });
    loginPrompt.handleSignup();
    expect(windowOpen.calledWith(`${props.loginUrl}&op=signup`, '_blank')).to.be.true;
  });
  afterEach(restoreWindow);
});
