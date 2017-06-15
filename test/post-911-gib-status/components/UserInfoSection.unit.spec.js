import React from 'react';
import SkinDeep from 'skin-deep';
import { expect } from 'chai';

import UserInfoSection from '../../../src/js/post-911-gib-status/components/UserInfoSection.jsx';

const props = {
  enrollmentData: {
  }
};

describe('<UserInfoSection>', () => {
  it('should render', () => {
    const tree = SkinDeep.shallowRender(<UserInfoSection {...props}/>);
    const vdom = tree.getRenderOutput();
    expect(vdom).to.not.be.undefined;
  });
  // maybe test print button does something
});
