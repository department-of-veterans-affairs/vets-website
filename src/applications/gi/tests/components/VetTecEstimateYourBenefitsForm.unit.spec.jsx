import React from 'react';
import { expect } from 'chai';
import { mount, shallow } from 'enzyme';

import VetTecEstimateYourBenefitsForm from '../../components/vet-tec/VetTecEstimateYourBenefitsForm';

const defaultProps = {
  inputs: {},
  displayedInputs: {},
  onShowModal: () => {},
  onInputChange: () => {},
  selectedProgram: '',
  preSelectedProgram: 'Program Name 1',
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

describe('<VetTecEstimateYourBenefitsForm>', () => {
  it('should render', () => {
    const wrapper = shallow(
      <VetTecEstimateYourBenefitsForm {...defaultProps} />,
    );
    const vdom = wrapper.html();
    expect(vdom).to.not.be.undefined;
    wrapper.unmount();
  });

  it('tuition amount blur should log GTM analytics event', () => {
    const wrapper = mount(<VetTecEstimateYourBenefitsForm {...defaultProps} />);

    wrapper.find('input[name="vetTecTuitionFees"]').simulate('blur');

    const recordedEvent = global.window.dataLayer[0];
    expect(recordedEvent['gibct-form-field']).to.eq(
      'Tuition & Fees Text Field',
    );
    expect(recordedEvent['gibct-form-value']).to.eq(1000);
    wrapper.unmount();
  });

  it('scholarship amount blur should log GTM analytics event', () => {
    const wrapper = mount(<VetTecEstimateYourBenefitsForm {...defaultProps} />);

    wrapper.find('input[name="vetTecScholarships"]').simulate('blur');

    const recordedEvent = global.window.dataLayer[0];
    expect(recordedEvent['gibct-form-field']).to.eq('Scholarships Text Field');
    expect(recordedEvent['gibct-form-value']).to.eq(0);
    wrapper.unmount();
  });
});
