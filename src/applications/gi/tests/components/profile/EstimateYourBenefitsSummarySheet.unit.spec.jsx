import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import sinon from 'sinon';
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
  it('should render h4 with text Your estimated benefits if expandEybSheet is true', () => {
    const wrapper = shallow(
      <EstimateYourBenefitsSummarySheet
        expandEybSheet
        outputs={{
          bookStipend: {},
          giBillPaysToSchool: {},
          housingAllowance: {},
          outOfPocketTuition: {},
          perTerm: {
            yellowRibbon: {
              terms: [
                { value: 'value', label: 'label' },
                { value: 'value2', label: 'Total per year' },
              ],
            },
          },
          totalPaidToYou: {},
          tuitionAndFeesCharged: {},
          yourScholarships: {},
        }}
      />,
    );
    expect(wrapper.find('h4').text()).to.equal('Your estimated benefits');
    expect(wrapper.find('div.out-of-pocket-tuition')).to.have.length(1);
    wrapper.unmount();
  });
  it('should call toggleEybExpansion on button Click', () => {
    const mocktoggleEybExpansion = sinon.stub();
    const wrapper = shallow(
      <EstimateYourBenefitsSummarySheet
        expandEybSheet
        showEybSheet
        toggleEybExpansion={mocktoggleEybExpansion}
        outputs={{
          bookStipend: {},
          giBillPaysToSchool: {},
          housingAllowance: {},
          outOfPocketTuition: {},
          perTerm: {
            yellowRibbon: {
              terms: [
                { value: 'value', label: 'label' },
                { value: 'value2', label: 'Total per year' },
              ],
            },
          },
          totalPaidToYou: {},
          tuitionAndFeesCharged: {},
          yourScholarships: {},
        }}
      />,
    );
    const btn = wrapper.find(
      'button.eyb-button.usa-accordion-button.vads-u-padding-bottom--0',
    );
    expect(btn.props()['aria-expanded']).to.equal(true);
    expect(btn.props()['aria-controls']).to.equal('eyb-summary-sheet');
    btn.simulate('click');
    expect(mocktoggleEybExpansion.calledOnce).to.be.true;

    wrapper.unmount();
  });
  it('should h4 with the text of  Estimated benefits per month when ype equal OJT', () => {
    const wrapper = shallow(
      <EstimateYourBenefitsSummarySheet
        expandEybSheet
        showEybSheet
        type="OJT"
        outputs={{
          bookStipend: {},
          giBillPaysToSchool: {},
          housingAllowance: {},
          outOfPocketTuition: {},
          perTerm: {
            yellowRibbon: {
              terms: [
                { value: 'value', label: 'label' },
                { value: 'value2', label: 'Total per year' },
              ],
            },
            housingAllowance: {
              visible: true,
              terms: [{ value: 'value', label: 'label' }],
            },
          },
          totalPaidToYou: {},
          tuitionAndFeesCharged: {},
          yourScholarships: {},
        }}
      />,
    );
    expect(wrapper.find('h4.vads-u-margin-y--0').text()).to.equal(
      'Estimated benefits per month',
    );
    wrapper.unmount();
  });
});
