import React from 'react';
import SkinDeep from 'skin-deep';
import { expect } from 'chai';

import ClaimDetailLayout from '../../../src/js/disability-benefits/components/ClaimDetailLayout';

describe('<ClaimDetailLayout>', () => {
  it('should render loading indicator', () => {
    const tree = SkinDeep.shallowRender(
      <ClaimDetailLayout
          loading/>
    );

    expect(tree.everySubTree('LoadingIndicator')).not.to.be.empty;
  });
});
