import React from 'react';
import SkinDeep from 'skin-deep';
import { expect } from 'chai';

import SampleFeature from '../../../src/js/common/components/SampleFeature.jsx';

describe('<SampleFeature>', () => {
  it('should be empty when not enabled', () => {
    const tree = SkinDeep.shallowRender(
      <div>
        <SampleFeature/>
      </div>
    );

    expect(tree.toString()).to.equal('<div></div>');
  });

  it('should be a div when enabled', () => {
    const tree = SkinDeep.shallowRender(
      <div>
        <SampleFeature isEnabled/>
      </div>
    );

    expect(tree.toString()).to.equal('<div><div></div></div>');
  });
});
