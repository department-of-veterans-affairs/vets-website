import React from 'react';
import SkinDeep from 'skin-deep';

import { ReviewAndSubmitSection } from '../../../../_health-care/_js/components/ReviewAndSubmitSection';

describe('<ReviewAndSubmitSection>', () => {
  it('Sanity check the component renders', () => {
    const tree = SkinDeep.shallowRender(<ReviewAndSubmitSection/>);
    const vdom = tree.getRenderOutput();
    expect(vdom).to.have.property('type', 'div');
  });
});

