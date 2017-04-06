import React from 'react';
import SkinDeep from 'skin-deep';
import { expect } from 'chai';

import SearchMenu from '../../../src/js/common/components/SearchMenu.jsx';

describe('<SearchMenu>', () => {
  const props = {
    isOpen: false
  };

  const tree = SkinDeep.shallowRender(<SearchMenu props={props}/>);

  it('should render', () => {
    const vdom = tree.getRenderOutput();
    expect(vdom).to.not.be.undefined;
  });
});
