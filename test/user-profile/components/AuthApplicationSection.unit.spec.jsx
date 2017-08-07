import React from 'react';
import SkinDeep from 'skin-deep';
import { expect } from 'chai';

import AuthApplicationSection from '../../../src/js/user-profile/components/AuthApplicationSection.jsx';

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
  it('should display verify link is user is not verified', () => {
    const tree = SkinDeep.shallowRender(<AuthApplicationSection {...props}/>);
    expect(tree.everySubTree('span').length).to.equal(2);
  });
  it('should not display verify link if user is verified', () => {
    props.userProfile.accountType = 3;
    const tree = SkinDeep.shallowRender(<AuthApplicationSection {...props}/>);
    expect(tree.everySubTree('span').length).to.equal(1);
  });
});
