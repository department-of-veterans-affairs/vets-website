import React from 'react';
import SkinDeep from 'skin-deep';
import { expect } from 'chai';

import { TabItem } from '../../../src/js/disability-benefits/components/TabItem';

describe('<TabItem>', () => {
  it('should render tab', () => {
    const tree = SkinDeep.shallowRender(
      <TabItem
          shortcut={1}
          tabpath="Some path"
          title="Title"/>
    );

    expect(tree.subTree('IndexLink').props['aria-controls']).to.equal('tabPanelTitle');
    expect(tree.subTree('IndexLink').props.to).to.equal('Some path');
  });
});
