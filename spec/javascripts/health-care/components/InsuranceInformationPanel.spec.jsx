import React from 'react';
import SkinDeep from 'skin-deep';

import InsuranceInformationPanel from '../../../../_health-care/_js/components/InsuranceInformationPanel';

describe('<InsuranceInformationPanel>', () => {
  it('Sanity check the component renders', () => {
    const tree = SkinDeep.shallowRender(
      <InsuranceInformationPanel applicationData={{ insuranceInformation: '' }}/>);
    const vdom = tree.getRenderOutput();
    expect(vdom).to.have.property('type', 'div');
  });
});

