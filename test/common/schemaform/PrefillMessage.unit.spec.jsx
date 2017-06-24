import React from 'react';
import { expect } from 'chai';
import SkinDeep from 'skin-deep';

import PrefillMessage from '../../../src/js/common/schemaform/PrefillMessage';

describe('Schemaform <PrefillMessage>', () => {
  it('should render', () => {
    const tree = SkinDeep.shallowRender(
      <PrefillMessage/>
    );

    expect(tree.text()).to.contain('pre-filled some fields');
  });
});
