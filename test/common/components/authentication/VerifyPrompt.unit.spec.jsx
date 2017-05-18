import React from 'react';
// import { findDOMNode } from 'react-dom';
// import ReactTestUtils from 'react-dom/test-utils';
import SkinDeep from 'skin-deep';
import { expect } from 'chai';
// import sinon from 'sinon';

import VerifyPrompt from '../../../../src/js/common/components/authentication/VerifyPrompt.jsx';
// import handleVerify from '../../../../src/js/common/helpers/login-helpers.js';

describe('<VerifyPrompt>', () => {
  it('should render', () => {
    const tree = SkinDeep.shallowRender(<VerifyPrompt verifyUrl={'http://verify-url'}/>);
    const vdom = tree.getRenderOutput();
    expect(vdom).to.not.be.undefined;
  });

  // TODO: figure out how to get spy to be called
  /*
  it('should call handler if verify button is clicked', () => {
    const verifySpy = sinon.spy(handleVerify);
    const verifyPrompt = ReactTestUtils.renderIntoDocument(
      <VerifyPrompt verifyUrl={'http://verify-url'}/>);
    const node = findDOMNode(verifyPrompt);
    ReactTestUtils.Simulate.click(node.querySelector('.usa-button-big'));
    expect(verifySpy.calledWith(verifyUrl)).to.be.true;
    verifySpy.restore();
  });
  */
});
