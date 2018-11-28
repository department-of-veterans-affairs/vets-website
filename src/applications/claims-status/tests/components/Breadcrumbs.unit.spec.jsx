import React from 'react';
import SkinDeep from 'skin-deep';
import { expect } from 'chai';

import ClaimsBreadcrumbs from '../../components/ClaimsBreadcrumbs';

describe('<Breadcrumbs>', () => {
  it('should render first two items', () => {
    const tree = SkinDeep.shallowRender(
      <ClaimsBreadcrumbs>
        <a href="#">Testing</a>
      </ClaimsBreadcrumbs>,
    );

    const items = tree.everySubTree('a');
    expect(items[0].props.href).to.equal('/');
    expect(items[1].props.href).to.equal('/disability-benefits/');
    expect(items[2].text()).to.equal('Testing');
  });
});
