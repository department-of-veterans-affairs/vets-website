import React from 'react';
import SkinDeep from 'skin-deep';

import MilitaryServicePanel from '../../../../_health-care/_js/components/MilitaryServicePanel';

describe('<MilitaryServicePanel>', () => {
  it('Sanity check the component renders', () => {
    const tree = SkinDeep.shallowRender(<MilitaryServicePanel/>);
    const vdom = tree.getRenderOutput();
    expect(vdom).to.have.property('type', 'div');
  });
});

