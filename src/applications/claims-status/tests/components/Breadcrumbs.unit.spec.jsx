import React from 'react';
import SkinDeep from 'skin-deep';
import { expect } from 'chai';

import Breadcrumbs from '../../../../platform/utilities/ui/Breadcrumbs';

describe('<Breadcrumbs>', () => {
  it('should render first two items', () => {
    const tree = SkinDeep.shallowRender(
      <Breadcrumbs>
        <a href="/">Home</a>
        <a href="/disability-benefits/">Disability Benefits</a>
        <a href="/testing">Testing</a>
      </Breadcrumbs>
    );

    const items = tree.everySubTree('a');
    expect(items[0].props.href).to.equal('/');
    expect(items[1].subTree('a').props.href).to.equal('/disability-benefits/');
    expect(items[2].text()).to.equal('Testing');
  });
});
