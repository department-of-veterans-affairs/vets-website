import React from 'react';
import SkinDeep from 'skin-deep';
import { expect } from 'chai';

import { TurnInEvidencePage } from '../../../src/js/disability-benefits/containers/TurnInEvidencePage';

describe('<TurnInEvidencePage>', () => {
  it('should render loading div', () => {
    const tree = SkinDeep.shallowRender(
      <TurnInEvidencePage
          loading/>
    );
    expect(tree.everySubTree('LoadingIndicator')).not.to.be.empty;
  });
});

