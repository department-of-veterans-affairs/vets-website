import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';

import EstimateYourBenefitsSummarySheet from '../../../components/profile/EstimateYourBenefitsSummarySheet';

describe('<EstimateYourBenefitsSummarySheet>', () => {
  it('should render', () => {
    const tree = shallow(
      <EstimateYourBenefitsSummarySheet
        outputs={{
          bookStipend: {},
          giBillPaysToSchool: {},
          housingAllowance: {},
          outOfPocketTuition: {},
          perTerm: {},
          totalPaidToYou: {},
          tuitionAndFeesCharged: {},
          yourScholarships: {},
        }}
      />,
    );
    expect(tree.type()).to.not.equal(null);
    tree.unmount();
  });
});
