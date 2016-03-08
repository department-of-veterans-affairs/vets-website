import React from 'react';
import SkinDeep from 'skin-deep';

import FinancialAssessmentPanel from '../../../../_health-care/_js/components/FinancialAssessmentPanel';

describe('<FinancialAssessmentPanel>', () => {
  it('Sanity check the component renders', () => {
    const tree = SkinDeep.shallowRender(
      <FinancialAssessmentPanel applicationData={{ financialAssessment: '' }}/>);
    const vdom = tree.getRenderOutput();
    expect(vdom).to.have.property('type', 'div');
  });
});

