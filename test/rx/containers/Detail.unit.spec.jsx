import React from 'react';
import SkinDeep from 'skin-deep';
import { expect } from 'chai';

import { Detail } from '../../../src/js/rx/containers/Detail';
import { prescriptions } from '../../util/rx-helpers.js';

const item = prescriptions.data[0];

const props = {
  prescription: {
    rx: item
  },
  params: {
    id: item.id
  },
  dispatch: () => {
    // No-op function to override dispatch
  }
};

describe('<Detail>', () => {
  const tree = SkinDeep.shallowRender(<Detail {...props}/>);

  it('should render', () => {
    const vdom = tree.getRenderOutput();
    expect(vdom).to.not.be.undefined;
  });
  it('should display details if an item is provided', () => {
    expect(tree.dive(['.rx-table'])).to.not.be.undefined;
  });

  // TODO(@U-DON): Add more granular tests
});
