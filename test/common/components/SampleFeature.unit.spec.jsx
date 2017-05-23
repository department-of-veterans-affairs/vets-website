import React from 'react';
import SkinDeep from 'skin-deep';
import { expect } from 'chai';

import SampleFeature from '../../../src/js/common/components/SampleFeature.jsx';

describe('<SampleFeature>', () => {
  it('should be empty when not enabled', () => {
    const tree = SkinDeep.shallowRender(
      <SampleFeature/>
    );

    expect(tree.everySubTree('div')).to.be.empty;
  });

  it('should be a div when enabled', () => {
    const tree = SkinDeep.shallowRender(
      <SampleFeature isEnabled/>
    );

    expect(tree.toString()).to.equal('<div />');
  });
});
