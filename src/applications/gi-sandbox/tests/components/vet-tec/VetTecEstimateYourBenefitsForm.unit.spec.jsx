import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';

import VetTecEstimateYourBenefitsForm from '../../../components/vet-tec/VetTecEstimateYourBenefitsForm';

const defaultProps = {
  inputs: {},
  displayedInputs: {},
  showModal: () => {},
  onInputChange: () => {},
  selectedProgram: 'Program Name 1',
  calculatorInputChange: () => {},
  institution: {
    programs: [
      {
        description: 'Program Name 1',
        schoolLocale: 'City',
        providerWebsite: 'https://galvanize.edu',
        phoneAreaCode: '843',
        phoneNumber: '333-3333',
        tuitionAmount: 1000,
      },
      {
        description: 'Program Name 2',
        schoolLocale: 'City',
        providerWebsite: 'https://galvanize.edu',
        phoneAreaCode: '843',
        phoneNumber: '333-3333',
        tuitionAmount: 2000,
      },
    ],
  },
};
describe('<VetTecApprovedProgramsList/>', () => {
  it('should render', () => {
    const wrapper = shallow(
      <VetTecEstimateYourBenefitsForm {...defaultProps} />,
    );
    expect(wrapper.html()).to.not.be.undefined;
    wrapper.unmount();
  });
});
