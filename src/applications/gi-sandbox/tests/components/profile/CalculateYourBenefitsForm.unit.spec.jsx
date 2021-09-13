import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';

import CalculateYourBenefitsForm from '../../../components/profile/CalculateYourBenefitsForm';

describe('<CalculateYourBenefitsForm>', () => {
  it('should render', () => {
    const tree = shallow(
      <CalculateYourBenefitsForm
        eligibility={{}}
        inputs={{}}
        displayedInputs={{}}
      />,
    );
    expect(tree.type()).to.not.equal(null);
    tree.unmount();
  });
});
