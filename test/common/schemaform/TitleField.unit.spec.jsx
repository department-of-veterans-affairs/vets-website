import React from 'react';
import { expect } from 'chai';
import SkinDeep from 'skin-deep';

import TitleField from '../../../src/js/common/schemaform/TitleField';

describe('Schemaform <TitleField>', () => {
  it('should render legend for root', () => {
    const tree = SkinDeep.shallowRender(
      <TitleField id="root__title"/>
    );

    expect(tree.subTree('legend')).to.be.truthy;
  });
  it('should render h5 for non-root', () => {
    const tree = SkinDeep.shallowRender(
      <TitleField id="root_someField"/>
    );

    expect(tree.subTree('h5')).to.be.truthy;
  });
});
