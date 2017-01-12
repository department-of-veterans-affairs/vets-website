import React from 'react';
import SkinDeep from 'skin-deep';
import { expect } from 'chai';

import ComposeButton from '../../../src/js/messaging/components/ComposeButton';

describe('<ComposeButton>', () => {
  it('should render correctly', () => {
    const tree = SkinDeep.shallowRender(<ComposeButton/>);

    expect(tree.getRenderOutput()).to.exist;
  });

  it('should have the expected classname', () => {
    const tree = SkinDeep.shallowRender(<ComposeButton/>);

    expect(tree.props.className).to.equal('va-button-primary messaging-compose-button');
  });
});
