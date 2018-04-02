import React from 'react';
import { expect } from 'chai';
import SkinDeep from 'skin-deep';

import SegmentedProgressBar from '@department-of-veterans-affairs/jean-pants/SegmentedProgressBar';

describe('SegmentedProgressBar', () => {
  it('should render', () => {
    const tree = SkinDeep.shallowRender(
      <SegmentedProgressBar current={2} total={4}/>
    );

    expect(tree.everySubTree('.progress-segment').length).to.equal(4);
    expect(tree.everySubTree('.progress-segment-complete').length).to.equal(2);
  });
});
