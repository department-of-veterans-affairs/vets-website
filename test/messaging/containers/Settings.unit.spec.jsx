import React from 'react';
import SkinDeep from 'skin-deep';
import { expect } from 'chai';

import { Settings } from '../../../src/js/messaging/containers/Settings';

const props = {
  folders: [],

  // No-op function to override dispatch
  dispatch: () => {}
};

describe('Settings', () => {
  const tree = SkinDeep.shallowRender(<Settings {...props}/>);

  it('should render', () => {
    const vdom = tree.getRenderOutput();
    expect(vdom).to.not.be.undefined;
  });
});
