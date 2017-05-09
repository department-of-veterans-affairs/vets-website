import React from 'react';
import SkinDeep from 'skin-deep';
import { expect } from 'chai';

import VerifyPrompt from '../../../../src/js/common/components/authentication/VerifyPrompt.jsx';

describe('<LoginPrompt>', () => {
  const props = {
    verifyUrl: 'http://verify-url'
  };
  const tree = SkinDeep.shallowRender(<VerifyPrompt {...props}/>);

  it('should render', () => {
    const vdom = tree.getRenderOutput();
    expect(vdom).to.not.be.undefined;
  });
});
