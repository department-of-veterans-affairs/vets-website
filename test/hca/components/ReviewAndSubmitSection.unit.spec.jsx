import React from 'react';
import SkinDeep from 'skin-deep';
import { expect } from 'chai';

import { ReviewAndSubmitSection } from '../../../src/js/hca/components/ReviewAndSubmitSection';

describe('<ReviewAndSubmitSection>', () => {
  it('Sanity check the component renders', () => {
    const tree = SkinDeep.shallowRender(<ReviewAndSubmitSection data={{}}/>);
    const vdom = tree.getRenderOutput();
    expect(vdom).to.have.property('type', 'div');
  });
});

