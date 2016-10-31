import React from 'react';
import SkinDeep from 'skin-deep';
import { expect } from 'chai';

import { DocumentRequestPage } from '../../../src/js/disability-benefits/containers/DocumentRequestPage';

describe('<DocumentRequestPage>', () => {
  it('should render loading div', () => {
    const tree = SkinDeep.shallowRender(
      <DocumentRequestPage
          loading/>
    );
    expect(tree.everySubTree('LoadingIndicator')).not.to.be.empty;
  });
});
