import React from 'react';
import ReactTestUtils from 'react-dom/test-utils';
import SkinDeep from 'skin-deep';
import { expect } from 'chai';
import sinon from 'sinon';

import VerifyPrompt from '../../../../src/js/common/components/authentication/VerifyPrompt.jsx';

let oldWindow;
let windowOpen;

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
    verifyUrl: 'http://verify-url'
  };
  const tree = SkinDeep.shallowRender(<VerifyPrompt {...props}/>);

  it('should render', () => {
    const vdom = tree.getRenderOutput();
    expect(vdom).to.not.be.undefined;
  });

  it('should open window if verify link is clicked', () => {
    const verifyPrompt = ReactTestUtils.renderIntoDocument(
      <VerifyPrompt {...props }/>
    );
    windowOpen.returns({ focus: f => f });
    verifyPrompt.handleVerify();
    expect(windowOpen.calledWith(`${props.verifyUrl}&op=signin`, '_blank')).to.be.true;
  });
  afterEach(restoreWindow);
});
