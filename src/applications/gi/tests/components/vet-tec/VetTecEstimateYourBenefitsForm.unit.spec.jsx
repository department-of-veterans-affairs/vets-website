import React from 'react';
import { expect } from 'chai';
import { mount, shallow } from 'enzyme';
import sinon from 'sinon';
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
  it('initializes the state correctly based on props', () => {
    const wrapper = shallow(
      <VetTecEstimateYourBenefitsForm {...defaultProps} />,
    );
    expect(wrapper.state().tuitionFees).to.equal(
      defaultProps.institution.programs[0].tuitionAmount,
    );
    expect(wrapper.state().scholarships).to.equal(0);
    expect(wrapper.state().programName).to.equal(defaultProps.selectedProgram);
    wrapper.unmount();
  });
  it('updates state when the scholarships input changes', () => {
    const wrapper = shallow(
      <VetTecEstimateYourBenefitsForm {...defaultProps} />,
    );
    const input = wrapper.find('#vetTecScholarships');
    input.simulate('change', { target: { value: '5000' } });
    expect(wrapper.state().scholarships).to.equal('5000');
    wrapper.unmount();
  });
  it('updates state when the tuition fees input changes', () => {
    const wrapper = shallow(
      <VetTecEstimateYourBenefitsForm {...defaultProps} />,
    );
    const input = wrapper.find('#vetTecTuitionFees');
    input.simulate('change', { target: { value: '15000' } });
    expect(wrapper.state().tuitionFees).to.equal('15000');
    wrapper.unmount();
  });
  it('disables the update benefits button if inputUpdated state is false', () => {
    const wrapper = shallow(
      <VetTecEstimateYourBenefitsForm {...defaultProps} />,
    );
    expect(wrapper.find('#calculate-button').props().disabled).to.be.true;
    wrapper.unmount();
  });
  it('enables the update benefits button if inputUpdated state is true', () => {
    const wrapper = shallow(
      <VetTecEstimateYourBenefitsForm {...defaultProps} />,
    );
    wrapper.setState({ inputUpdated: true });
    wrapper.update();
    expect(wrapper.find('#calculate-button').props().disabled).to.be.false;
    wrapper.unmount();
  });
  it('handles approved programs change correctly', () => {
    const wrapper = mount(<VetTecEstimateYourBenefitsForm {...defaultProps} />);
    const dropdown = wrapper.find('.calculator-form');
    dropdown.simulate('change', { target: { value: 'Program Name 1' } });
    expect(wrapper.state('programName')).to.equal('Program Name 1');
    expect(wrapper.state('tuitionFees')).to.equal(1000);
    wrapper.unmount();
  });
  it('handles value change on VARadioButton', () => {
    const newProps = {
      ...defaultProps,
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
            description: 'Program Name 12',
            schoolLocale: 'City',
            providerWebsite: 'https://galvanize.edu',
            phoneAreaCode: '843',
            phoneNumber: '333-3333',
            tuitionAmount: 2000,
          },
          {
            description: 'Program Name 13',
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
          {
            description: 'Program Name 3',
            schoolLocale: 'City',
            providerWebsite: 'https://galvanize.edu',
            phoneAreaCode: '843',
            phoneNumber: '333-3333',
            tuitionAmount: 2000,
          },
          {
            description: 'Program Name 4',
            schoolLocale: 'City',
            providerWebsite: 'https://galvanize.edu',
            phoneAreaCode: '843',
            phoneNumber: '333-3333',
            tuitionAmount: 2000,
          },
        ],
      },
    };
    const wrapper = mount(<VetTecEstimateYourBenefitsForm {...newProps} />);
    expect(wrapper.find('VARadioButton')).to.have.lengthOf(0);
    expect(wrapper.find('Dropdown')).to.have.lengthOf(1);
    wrapper.unmount();
  });
  it('handles value change on VARadioButton', () => {
    const wrapper = shallow(
      <VetTecEstimateYourBenefitsForm {...defaultProps} />,
    );
    wrapper
      .find('VARadioButton')
      .simulate('change', { target: { value: 'Program Name 1' } });

    expect(wrapper.state().programName).to.equal('Program Name 1');
    wrapper.unmount();
  });
  it('disables "Update benefits" button if inputUpdated is false', () => {
    const wrapper = shallow(
      <VetTecEstimateYourBenefitsForm {...defaultProps} />,
    );
    wrapper.setState({ inputUpdated: false });
    expect(wrapper.find('#calculate-button').prop('disabled')).to.be.true;
    wrapper.unmount();
  });
  it('enables "Update benefits" button if inputUpdated is true', () => {
    const wrapper = shallow(
      <VetTecEstimateYourBenefitsForm {...defaultProps} />,
    );
    wrapper.setState({ inputUpdated: true });
    expect(wrapper.find('#calculate-button').prop('disabled')).to.be.false;
    wrapper.unmount();
  });
  it('calls updateBenefitsOnClick when "Update benefits" button is clicked', () => {
    const wrapper = shallow(
      <VetTecEstimateYourBenefitsForm {...defaultProps} />,
    );
    const instance = wrapper.instance();
    const updateBenefitsSpy = sinon.spy(instance, 'updateBenefitsOnClick');
    wrapper.update();
    wrapper.setState({ inputUpdated: true });
    wrapper.find('#calculate-button').simulate('click', {
      preventDefault: () => {},
    });
    expect(updateBenefitsSpy.calledOnce).to.be.true;
    updateBenefitsSpy.restore();
    wrapper.unmount();
  });
  it('resets inputUpdated to false after "Update benefits" button is clicked', () => {
    const wrapper = shallow(
      <VetTecEstimateYourBenefitsForm {...defaultProps} />,
    );
    wrapper.setState({ inputUpdated: true, programName: 'someProgram' });
    wrapper.find('#calculate-button').simulate('click', {
      preventDefault: () => {},
    });
    expect(wrapper.state('inputUpdated')).to.be.false;
    wrapper.unmount();
  });
  it('calls handleApprovedProgramsChange and recordInputChange on dropdown change', () => {
    const newProps = {
      ...defaultProps,
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
            description: 'Program Name 12',
            schoolLocale: 'City',
            providerWebsite: 'https://galvanize.edu',
            phoneAreaCode: '843',
            phoneNumber: '333-3333',
            tuitionAmount: 2000,
          },
          {
            description: 'Program Name 13',
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
          {
            description: 'Program Name 3',
            schoolLocale: 'City',
            providerWebsite: 'https://galvanize.edu',
            phoneAreaCode: '843',
            phoneNumber: '333-3333',
            tuitionAmount: 2000,
          },
          {
            description: 'Program Name 4',
            schoolLocale: 'City',
            providerWebsite: 'https://galvanize.edu',
            phoneAreaCode: '843',
            phoneNumber: '333-3333',
            tuitionAmount: 2000,
          },
        ],
      },
    };
    const wrapper = shallow(<VetTecEstimateYourBenefitsForm {...newProps} />);
    const instance = wrapper.instance();
    const handleApprovedProgramsChangeSpy = sinon.spy(
      instance,
      'handleApprovedProgramsChange',
    );
    const recordInputChangeSpy = sinon.spy(instance, 'recordInputChange');
    const dropdown = wrapper.find('Dropdown');
    const event = { target: { value: 'Program Name 3' } };

    dropdown.simulate('change', event);

    expect(handleApprovedProgramsChangeSpy.calledOnce).to.be.true;
    expect(recordInputChangeSpy.calledOnce).to.be.true;
    expect(wrapper.state('programName')).to.equal('Program Name 3');
    handleApprovedProgramsChangeSpy.restore();
    recordInputChangeSpy.restore();
    wrapper.unmount();
  });
});
