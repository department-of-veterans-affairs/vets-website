import React from 'react';
import SkinDeep from 'skin-deep';

import IntroductionPanel from '../../../../_health-care/_js/components/IntroductionPanel';

describe('<IntroductionPanel>', () => {
  it('Sanity check the component renders', () => {
    const tree = SkinDeep.shallowRender(<IntroductionPanel/>);
    const vdom = tree.getRenderOutput();
    expect(vdom).to.have.property('type', 'div');
  });
});

