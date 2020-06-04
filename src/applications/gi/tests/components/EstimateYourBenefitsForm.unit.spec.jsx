import React from 'react';
import { expect } from 'chai';
import { mount } from 'enzyme';
import sinon from 'sinon';
import { selectRadio } from 'platform/testing/unit/schemaform-utils.jsx';
import EstimateYourBenefitsForm from '../../components/profile/EstimateYourBenefitsForm';

const props = {
  eligibility: {
    onlineClasses: 'no',
  },
  profile: {
    attributes: {
      facilityCode: '11900146',
      institution: 'MAIN FACILITY',
      physicalCity: 'Test',
      physicalState: 'TN',
      physicalCountry: 'USA',
      physicalZip: '12345',
      country: 'USA',
      dodBah: '100',
      facilityMap: {
        main: {
          institution: {
            facilityCode: '11900146',
          },
        },
      },
    },
  },
};
const state = {
  invalidZip: '',
  yourBenefitsExpanded: true,
  aboutYourSchoolExpanded: false,
  learningFormatAndScheduleExpanded: false,
  scholarshipsAndOtherFundingExpanded: false,
};
describe('<EstimateYourBenefitsForm>', () => {
  it('should render', () => {
    const tree = mount(
      <EstimateYourBenefitsForm
        profile={props.profile}
        eligibility={props.eligibility}
        eligibilityChange={() => {}}
        inputs={{}}
        displayedInputs={{}}
        showModal={() => {}}
        calculatorInputChange={() => {}}
        onBeneficiaryZIPCodeChanged={() => {}}
        estimatedBenefits={{}}
        isLoggedIn={false}
      />,
    );
    expect(tree).to.not.be.undefined;
    tree.unmount();
  });

  it('should display error message when beneficiary zip is less than 5 digits', () => {
    const invalidInput = {
      beneficiaryLocationQuestion: 'other',
      beneficiaryZIP: '888',
      classesOutsideUS: false,
    };
    const tree = mount(
      <EstimateYourBenefitsForm
        profile={props.profile}
        eligibility={props.eligibility}
        eligibilityChange={() => {}}
        inputs={invalidInput}
        displayedInputs={{
          beneficiaryLocationQuestion: true,
        }}
        showModal={() => {}}
        calculatorInputChange={() => {}}
        onBeneficiaryZIPCodeChanged={() => {}}
        estimatedBenefits={{}}
        isLoggedIn={false}
        updateEstimatedBenefits={() => {}}
      />,
    );
    tree.setState({
      ...state,
      yourBenefitsExpanded: false,
      learningFormatAndScheduleExpanded: true,
    });
    const textBox = tree.find('input[name="beneficiaryZIPCode"]');
    textBox.simulate('blur');
    const errorMessage = tree.find('.usa-input-error-message').text();
    tree.unmount();
    expect(errorMessage).to.equal('Error Postal code must be a 5-digit number');
  });

  it('should display empty string when beneficiary zip is a valid 5 digit zipcode', () => {
    const validInput = {
      beneficiaryLocationQuestion: 'other',
      beneficiaryZIP: '60641',
    };
    const treeValid = mount(
      <EstimateYourBenefitsForm
        profile={props.profile}
        eligibility={props.eligibility}
        eligibilityChange={() => {}}
        inputs={validInput}
        displayedInputs={{
          beneficiaryLocationQuestion: true,
        }}
        showModal={() => {}}
        calculatorInputChange={() => {}}
        onBeneficiaryZIPCodeChanged={() => {}}
        estimatedBenefits={{}}
        isLoggedIn={false}
        updateEstimatedBenefits={() => {}}
      />,
    );
    treeValid.setState({
      ...state,
      yourBenefitsExpanded: false,
      learningFormatAndScheduleExpanded: true,
    });
    const textBox2 = treeValid.find('input[name="beneficiaryZIPCode"]');
    textBox2.simulate('blur');
    const errorMessage = treeValid.find('.usa-input-error-message');
    treeValid.unmount();
    expect(errorMessage.length).to.equal(0);
  });

  it('should invoke updateEstimatedBenefits on "Update benefits" click, with valid data', () => {
    const validInput = {
      beneficiaryLocationQuestion: 'other',
      beneficiaryZIP: '60641',
    };
    const updateEstimatedBenefits = sinon.spy();
    const tree = mount(
      <EstimateYourBenefitsForm
        profile={props.profile}
        eligibility={props.eligibility}
        eligibilityChange={() => {}}
        inputs={validInput}
        displayedInputs={{}}
        showModal={() => {}}
        calculatorInputChange={() => {}}
        onBeneficiaryZIPCodeChanged={() => {}}
        estimatedBenefits={{}}
        isLoggedIn={false}
        updateEstimatedBenefits={updateEstimatedBenefits}
      />,
    );

    tree
      .find('#militaryStatus')
      .at(0)
      .simulate('change', { target: 'active duty' });

    tree
      .find('.calculate-button')
      .at(0)
      .simulate('click');
    expect(updateEstimatedBenefits.called).to.be.true;
    tree.unmount();
  });

  it('should not invoke updateEstimatedBenefits on "Update benefits" click, with invalid data', () => {
    const validInput = {
      beneficiaryLocationQuestion: 'other',
      beneficiaryZIP: '#',
    };
    const updateEstimatedBenefits = sinon.spy();
    const tree = mount(
      <EstimateYourBenefitsForm
        profile={props.profile}
        eligibility={{ giBillChapter: '33' }}
        eligibilityChange={() => {}}
        inputs={validInput}
        displayedInputs={{}}
        showModal={() => {}}
        calculatorInputChange={() => {}}
        onBeneficiaryZIPCodeChanged={() => {}}
        estimatedBenefits={{}}
        isLoggedIn={false}
        updateEstimatedBenefits={updateEstimatedBenefits}
      />,
    );
    tree
      .find('#militaryStatus')
      .at(0)
      .simulate('change', { target: 'active duty' });
    tree
      .find('.calculate-button')
      .at(0)
      .simulate('click');
    expect(updateEstimatedBenefits.called).to.be.false;
    tree.unmount();
  });

  it('"Update benefits" is disabled without input change', () => {
    const validInput = {
      beneficiaryLocationQuestion: 'other',
      beneficiaryZIP: '60641',
    };
    const tree = mount(
      <EstimateYourBenefitsForm
        profile={props.profile}
        eligibility={props.eligibility}
        eligibilityChange={() => {}}
        inputs={validInput}
        displayedInputs={{}}
        showModal={() => {}}
        calculatorInputChange={() => {}}
        onBeneficiaryZIPCodeChanged={() => {}}
        estimatedBenefits={{}}
        isLoggedIn={false}
        updateEstimatedBenefits={() => {}}
      />,
    );

    expect(
      tree
        .find('.calculate-button')
        .at(0)
        .prop('disabled'),
    ).to.be.true;
    tree.unmount();
  });

  it('"Update benefits" is enabled after input change', () => {
    const validInput = {
      beneficiaryLocationQuestion: 'other',
      beneficiaryZIP: '60641',
    };
    const tree = mount(
      <EstimateYourBenefitsForm
        profile={props.profile}
        eligibility={props.eligibility}
        eligibilityChange={() => {}}
        inputs={validInput}
        displayedInputs={{}}
        showModal={() => {}}
        calculatorInputChange={() => {}}
        onBeneficiaryZIPCodeChanged={() => {}}
        estimatedBenefits={{}}
        isLoggedIn={false}
        updateEstimatedBenefits={() => {}}
      />,
    );
    tree
      .find('#militaryStatus')
      .at(0)
      .simulate('change', { target: 'active duty' });

    expect(
      tree
        .find('.calculate-button')
        .at(0)
        .prop('disabled'),
    ).to.be.false;
    tree.unmount();
  });

  it('displays non-OJT learning format section name', () => {
    const wrapper = mount(
      <EstimateYourBenefitsForm
        profile={props.profile}
        eligibility={props.eligibility}
        eligibilityChange={() => {}}
        inputs={{}}
        displayedInputs={{}}
        showModal={() => {}}
        calculatorInputChange={() => {}}
        onBeneficiaryZIPCodeChanged={() => {}}
        estimatedBenefits={{}}
        isLoggedIn={false}
      />,
    );
    expect(wrapper.html()).to.contain('Learning format and location');
    wrapper.unmount();
  });

  it('displays OJT learning format section name', () => {
    const ojtProfile = {
      ...props.profile,
      attributes: {
        ...props.profile.attributes,
        type: 'OJT',
      },
    };
    const wrapper = mount(
      <EstimateYourBenefitsForm
        profile={ojtProfile}
        eligibility={props.eligibility}
        eligibilityChange={() => {}}
        inputs={{}}
        displayedInputs={{}}
        showModal={() => {}}
        calculatorInputChange={() => {}}
        onBeneficiaryZIPCodeChanged={() => {}}
        estimatedBenefits={{}}
        isLoggedIn={false}
      />,
    );
    expect(wrapper.html()).to.contain('Learning format and schedule');
    wrapper.unmount();
  });
});
