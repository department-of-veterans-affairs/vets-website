import React from 'react';
import { findDOMNode } from 'react-dom';
import ReactTestUtils from 'react-dom/test-utils';
import SkinDeep from 'skin-deep';
import { expect } from 'chai';
import sinon from 'sinon';

import LoginPrompt from '../../../../src/js/common/components/authentication/LoginPrompt.jsx';

let windowOpen;
let oldWindow;

const fakeWindow = () => {
  oldWindow = global.window;
  windowOpen = sinon.stub().returns({ focus: f => f });
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

  it('should open window if login button is clicked', () => {
    const loginPrompt = ReactTestUtils.renderIntoDocument(
      <LoginPrompt {...props }/>
    );
    ReactTestUtils.Simulate.click(
      findDOMNode(loginPrompt).querySelector('.va-button-primary'));
    expect(windowOpen.called).to.be.true;
  });

  it('should open window if sign-up button is clicked', () => {
    const loginPrompt = ReactTestUtils.renderIntoDocument(
      <LoginPrompt {...props }/>
    );
    ReactTestUtils.Simulate.click(
      findDOMNode(loginPrompt).querySelector('.va-button-secondary'));
    expect(windowOpen.called).to.be.true;
  });
  afterEach(restoreWindow);
});
