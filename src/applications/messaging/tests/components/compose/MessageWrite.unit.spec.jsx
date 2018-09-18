import React from 'react';
import SkinDeep from 'skin-deep';
import { expect } from 'chai';

import MessageWrite from '../../../components/compose/MessageWrite';

const props = {
  onValueChange: () => {},
  text: {
    value: 'text',
  },
  cssClass: 'cssClass',
};

describe('<MessageWrite>', () => {
  test('should render correctly', () => {
    const tree = SkinDeep.shallowRender(<MessageWrite {...props}/>);

    expect(tree.getRenderOutput()).to.exist;
  });

  test('should have the expected className', () => {
    const tree = SkinDeep.shallowRender(<MessageWrite {...props}/>);

    expect(tree.props.className).to.equal(props.cssClass);
  });

  test('should render the expected child elements', () => {
    const tree = SkinDeep.shallowRender(<MessageWrite {...props}/>);

    expect(tree.subTree('ErrorableTextArea')).to.be.ok;
  });
});
