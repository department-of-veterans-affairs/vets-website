import React from 'react';
import SkinDeep from 'skin-deep';

import ReviewAndSubmitPanel from '../../../../_health-care/_js/components/ReviewAndSubmitPanel';

describe('<ReviewAndSubmitPanel>', () => {
  it('Sanity check the component renders', () => {
    const tree = SkinDeep.shallowRender(<ReviewAndSubmitPanel/>);
    const vdom = tree.getRenderOutput();
    expect(vdom).to.have.property('type', 'div');
  });
});

