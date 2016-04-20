import React from 'react';
import SkinDeep from 'skin-deep';

import AnnualIncomeSection from '../../../../../_health-care/_js/components/financial-assessment/AnnualIncomeSection';

describe('<AnnualIncomeSection>', () => {
  const nullData = [{
    veteranGrossIncome: null,
    veteranNetIncome: null,
    veteranOtherIncome: null,
    spouseGrossIncome: null,
    spouseNetIncome: null,
    spouseOtherIncome: null,
    childrenGrossIncome: null,
    childrenNetIncome: null,
    childrenOtherIncome: null
  }];

  it('Sanity check the component renders', () => {
    const tree = SkinDeep.shallowRender(<AnnualIncomeSection
        data={{ nullData }}
        external={{ receivesVaPension: false }}/>);
    const vdom = tree.getRenderOutput();
    expect(vdom.props.children).to.not.equal(0);
  });

  describe('receivesVaPension', () => {
    it('does not show `notRequiredMessage` when false', () => {
      const tree = SkinDeep.shallowRender(<AnnualIncomeSection
          data={{ nullData }}
          external={{ receivesVaPension: false }}/>);
      const notRequiredMessage = tree.everySubTree('#notRequiredMessage');
      expect(notRequiredMessage).to.have.lengthOf(0);
    });

    it('does show `notRequiredMessage` when true', () => {
      const tree = SkinDeep.shallowRender(<AnnualIncomeSection
          data={{ nullData }}
          external={{ receivesVaPension: true }}/>);
      const notRequiredMessage = tree.everySubTree('#notRequiredMessage');
      expect(notRequiredMessage).to.have.lengthOf(1);
    });
  });
});
