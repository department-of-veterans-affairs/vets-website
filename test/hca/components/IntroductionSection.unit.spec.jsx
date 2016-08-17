import React from 'react';
import SkinDeep from 'skin-deep';
import { expect } from 'chai';

import IntroductionSection from '../../../src/js/hca/components/IntroductionSection';

describe('<IntroductionSection>', () => {
  it('Sanity check the component renders', () => {
    const tree = SkinDeep.shallowRender(<IntroductionSection/>);
    const vdom = tree.getRenderOutput();
    expect(vdom).to.have.property('type', 'div');
  });
});

