import React from 'react';
import { expect } from 'chai';
import { mount, shallow } from 'enzyme';

import VetTecEstimateYourBenefitsForm from '../../components/vet-tec/VetTecEstimateYourBenefitsForm';

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
const verifyTrackedInputChange = (wrapper, field, value, eventIndex = 0) => {
  wrapper
    .find(`input[name="${field}"]`)
    .at(0)
    .simulate('change', value);

  const recordedEvent = global.window.dataLayer[eventIndex];
  expect(recordedEvent.event).to.eq('gibct-form-change');
  expect(recordedEvent['gibct-form-field']).to.eq(field);
  expect(recordedEvent['gibct-form-value']).to.not.be.null;
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

  it('"Update benefits" button is disabled without input change', () => {
    const wrapper = mount(<VetTecEstimateYourBenefitsForm {...defaultProps} />);

    expect(
      wrapper
        .find('.calculator-form button')
        .at(2)
        .prop('disabled'),
    ).to.be.true;
    wrapper.unmount();
  });

  it('"Update benefits" button is enabled after input change', () => {
    const wrapper = mount(<VetTecEstimateYourBenefitsForm {...defaultProps} />);

    wrapper
      .find('input[name="vetTecTuitionFees"]')
      .at(0)
      .simulate('change', '1');

    expect(
      wrapper
        .find('.calculator-form button')
        .at(2)
        .prop('disabled'),
    ).to.be.false;
    wrapper.unmount();
  });

  it('should track cta-default-button-click on "Update benefits" click', () => {
    const wrapper = mount(<VetTecEstimateYourBenefitsForm {...defaultProps} />);

    wrapper
      .find('input[name="vetTecTuitionFees"]')
      .at(0)
      .simulate('change', '1');

    wrapper
      .find('#calculate-button')
      .at(0)
      .simulate('click');

    const recordedEvent = global.window.dataLayer[1];
    expect(recordedEvent.event).to.eq('cta-default-button-click');
    expect(recordedEvent['gibct-parent-accordion-section']).to.eq(
      'Estimate your benefits',
    );
    expect(recordedEvent['gibct-child-accordion-section']).to.eq(undefined);
    wrapper.unmount();
  });

  it('should track gibct-form-change on approvedPrograms change', () => {
    const wrapper = mount(<VetTecEstimateYourBenefitsForm {...defaultProps} />);
    const field = 'approvedPrograms';
    const value = '1';
    verifyTrackedInputChange(wrapper, field, value);
    wrapper.unmount();
  });

  it('should track gibct-form-change on vetTecTuitionFees change', () => {
    const wrapper = mount(<VetTecEstimateYourBenefitsForm {...defaultProps} />);
    const field = 'vetTecTuitionFees';
    const value = '1';
    verifyTrackedInputChange(wrapper, field, value);
    wrapper.unmount();
  });

  it('should track gibct-form-change on vetTecScholarships change', () => {
    const wrapper = mount(<VetTecEstimateYourBenefitsForm {...defaultProps} />);
    const field = 'vetTecScholarships';
    const value = '1';
    verifyTrackedInputChange(wrapper, field, value);
    wrapper.unmount();
  });
});
