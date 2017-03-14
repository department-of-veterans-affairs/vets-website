import React from 'react';
import SkinDeep from 'skin-deep';
import { expect } from 'chai';
 
import HelpMenu from '../../../src/js/common/components/HelpMenu.jsx';

describe('<HelpMenu>', () => {
  const props = {
    isOpen: false
  };

  let tree = SkinDeep.shallowRender(<HelpMenu props={props}/>);

  it('should render', () => {
    const vdom = tree.getRenderOutput();
    expect(vdom).to.not.be.undefined;
  });
});
