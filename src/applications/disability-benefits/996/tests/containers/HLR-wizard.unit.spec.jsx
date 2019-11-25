import React from 'react';
import SkinDeep from 'skin-deep';
import { expect } from 'chai';

// import formConfig from '../../config/form';
import HLRWizard from '../../components/HLRWizard';

describe('<HLRWizard>', () => {
  it('should show button and no questions', () => {
    const tree = SkinDeep.shallowRender(<HLRWizard />);
    expect(tree.subTree('button')).not.to.be.false;
    expect(tree.subTree('#wizardOptions').props.className).to.contain(
      'wizard-content-closed',
    );
  });
});
