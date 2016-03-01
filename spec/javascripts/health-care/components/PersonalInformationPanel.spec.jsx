import React from 'react';
import SkinDeep from 'skin-deep';

import PersonalInformationPanel from '../../../../_health-care/_js/components/PersonalInformationPanel';

describe('<PersonalInformationPanel>', () => {
  it('Sanity check the component renders', () => {
    const tree = SkinDeep.shallowRender(
      <PersonalInformationPanel applicationData={{ personalInformation: '' }}/>);
    const vdom = tree.getRenderOutput();
    expect(vdom).to.have.property('type', 'div');
  });
});

