import React from 'react';
import SkinDeep from 'skin-deep';
import { expect } from 'chai';
 
import DropDown from '../../../src/js/common/components/DropDown.jsx';

describe('<DropDown>', () => {
  const props = {
    buttonText: 'Button text',
    clickHandler: () => {},
    contents: (<h1>Hi</h1>),
    cssClass: 'testClass',
    isOpen: true,
    icon: (<svg><rect x="50" y="50" width="50" height="50"/></svg>),
    id: 'testId'
  };

  let tree = SkinDeep.shallowRender(<DropDown {...props}/>);

  it('should render', () => {
    const vdom = tree.getRenderOutput();
    expect(vdom).to.not.be.undefined;
  });
});
