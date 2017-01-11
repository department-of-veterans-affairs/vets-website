import React from 'react';
import SkinDeep from 'skin-deep';
import { expect } from 'chai';

import { YourClaimsPage } from '../../../src/js/disability-benefits/containers/YourClaimsPage';

describe('<YourClaimsPage>', () => {
  it('should render tabs', () => {
    const tree = SkinDeep.shallowRender(
      <YourClaimsPage/>
    );
    expect(tree.everySubTree('MainTabNav').length).to.equal(1);
  });

  it('should not render tabs', () => {
    const tree = SkinDeep.shallowRender(
      <YourClaimsPage
          allClaims={false}/>
    );
    expect(tree.everySubTree('MainTabNav').length).to.equal(0);
  });
});
