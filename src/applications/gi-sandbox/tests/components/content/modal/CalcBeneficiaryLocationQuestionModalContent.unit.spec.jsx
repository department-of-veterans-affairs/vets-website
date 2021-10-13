import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';

import CalcBeneficiaryLocationQuestionModalContent from '../../../../components/content/modals/CalcBeneficiaryLocationQuestionModalContent';

describe('CalcBeneficiaryLocationQuestionModalContent modal', () => {
  it('should render', () => {
    const wrapper = shallow(<CalcBeneficiaryLocationQuestionModalContent />);
    expect(wrapper.html()).to.not.be.undefined;
    wrapper.unmount();
  });
});
