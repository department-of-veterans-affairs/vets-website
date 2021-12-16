import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';

import EstimatedBenefits from '../../../components/profile/EstimatedBenefits';

describe('<EstimatedBenefits>', () => {
  it('should render', () => {
    const tree = shallow(
      <EstimatedBenefits
        calculator={{}}
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
        profile={{ attributes: {} }}
      />,
    );
    expect(tree.type()).to.not.equal(null);
    tree.unmount();
  });
});
