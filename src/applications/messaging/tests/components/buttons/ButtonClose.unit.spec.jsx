import { expect } from 'chai';
import React from 'react';
import SkinDeep from 'skin-deep';

import ButtonClose from '../../../components/buttons/ButtonClose';

describe('<ButtonClose>', () => {
  test('should render correctly', () => {
    const tree = SkinDeep.shallowRender(<ButtonClose/>);

    expect(tree.getRenderOutput()).to.exist;
  });

  test('should have the expected classname', () => {
    const tree = SkinDeep.shallowRender(<ButtonClose/>);

    expect(tree.props.className).to.equal('usa-button-unstyled');
  });
});
