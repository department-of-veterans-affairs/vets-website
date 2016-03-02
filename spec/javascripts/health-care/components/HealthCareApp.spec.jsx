import React from 'react';
import SkinDeep from 'skin-deep';

import HealthCareApp from '../../../../_health-care/_js/components/HealthCareApp';

describe('<HealthCareApp>', () => {
  it('Sanity check the component renders', () => {
    const tree = SkinDeep.shallowRender(<HealthCareApp location={ { pathname: '/blah'} }/>);
    const vdom = tree.getRenderOutput();
    expect(vdom).to.have.property('type', 'div');
  });
});
