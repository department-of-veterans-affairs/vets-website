import React from 'react';
// import { findDOMNode } from 'react-dom';
// import ReactTestUtils from 'react-dom/test-utils';
import SkinDeep from 'skin-deep';
import { expect } from 'chai';
// import sinon from 'sinon';

import AuthApplicationSection from '../../../src/js/user-profile/components/AuthApplicationSection.jsx';
// import handleVerify from '../../../../src/js/common/helpers/login-helpers.js';

describe('<AuthApplicationSection>', () => {
  const props = {
    userProfile: {},
    verifyUrl: 'http://fake-verify-url'
  };

  it('should render', () => {
    const tree = SkinDeep.shallowRender(<AuthApplicationSection {...props}/>);
    const vdom = tree.getRenderOutput();
    expect(vdom).to.not.be.undefined;
  });

  // TODO: figure out how to get spy to be called
  /*
  it('should call handler when verify link is clicked', () => {
    const verifySpy = sinon.spy(handleVerify);
    const section = ReactTestUtils.renderIntoDocument(
      <AuthApplicationSection {...props }/>
    );
    ReactTestUtils.Simulate.click(
      findDOMNode(section).querySelector("a[href='#']"));
    expect(verifySpy.called.with(props.verifyUrl)).to.be.true;
    verifySpy.restore();
  });
  */
});
