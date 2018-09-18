import React from 'react';
import SkinDeep from 'skin-deep';
import { expect } from 'chai';

import MessageSubject from '../../../components/compose/MessageSubject';

const props = {
  onValueChange: () => {},
  cssClass: 'cssClass',
  subject: {
    value: 'text',
    dirty: true,
  },
};

describe('<MessageSubject>', () => {
  test('should render correctly', () => {
    const tree = SkinDeep.shallowRender(<MessageSubject {...props}/>);

    expect(tree.getRenderOutput()).to.exist;
  });

  test('should have the expected className', () => {
    const tree = SkinDeep.shallowRender(<MessageSubject {...props}/>);

    expect(tree.props.className).to.equal(props.cssClass);
  });

  test('should render the expected child elements', () => {
    const tree = SkinDeep.shallowRender(<MessageSubject {...props}/>);

    expect(tree.subTree('ErrorableTextInput')).to.be.ok;
  });
});
