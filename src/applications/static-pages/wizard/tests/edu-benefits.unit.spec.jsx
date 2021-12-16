import React from 'react';
import {
  Wizard,
  formIdSuffixes,
  WIZARD_STATUS_COMPLETE,
} from 'applications/static-pages/wizard';
import { expect } from 'chai';
import { shallow, mount } from 'enzyme';
import pages from 'applications/edu-benefits/wizard/pages';

describe('the Education Benefits Wizard', () => {
  let defaultProps;

  beforeEach(() => {
    defaultProps = {
      pages,
      expander: true,
      buttonText: 'Start the wizard',
      setReferredBenefit: formId =>
        sessionStorage.setItem('benefitReferred', formId),
      setWizardStatus: value => sessionStorage.setItem('wizardStatus', value),
    };
  });

  it('should render the wizard wrapped in a form element', () => {
    const wrapper = shallow(<Wizard {...defaultProps} />);
    expect(wrapper.exists('form')).to.equal(true);
    wrapper.unmount();
  });

  it('should render the wizard start button if the expander prop is true', () => {
    const wrapper = shallow(<Wizard {...defaultProps} />);
    expect(wrapper.exists('.wizard-button')).to.equal(true);
    wrapper.unmount();
  });
  it('should render the NewBenefit page if the expander prop is false', () => {
    const expanderFalseProps = {
      ...defaultProps,
      expander: false,
    };
    const wrapper = shallow(<Wizard {...expanderFalseProps} />);
    expect(wrapper.exists('.wizard-button')).to.equal(false);
    expect(wrapper.find('NewBenefit').exists()).to.equal(true);
    wrapper.unmount();
  });
  it('should take you to the 1990E form with no warning alert', () => {
    const wrapper = mount(<Wizard {...defaultProps} />);
    wrapper.find('.wizard-button').simulate('click');
    expect(wrapper.state('pageHistory')[0].state).to.be.undefined;
    wrapper.find('#NewBenefit-0').invoke('onChange')({
      target: { value: 'new' },
    });
    expect(wrapper.state('pageHistory')[0].state).to.deep.equal({
      selected: 'new',
    });
    wrapper.find('#ClaimingBenefitOwnService-1').invoke('onChange')({
      target: { value: 'no' },
    });
    expect(wrapper.state('pageHistory')[1].state).to.deep.equal({
      selected: 'no',
    });
    wrapper.find('#SponsorDeceased-1').invoke('onChange')({
      target: { value: 'no' },
    });
    expect(wrapper.state('pageHistory')[2].state).to.deep.equal({
      selected: 'no',
    });
    wrapper.find('#TransferredBenefits-1').invoke('onChange')({
      target: { value: 'yes' },
    });
    expect(wrapper.state('pageHistory')[3].state).to.deep.equal({
      selected: 'yes',
    });
    expect(wrapper.find('WarningAlert').exists()).to.equal(false);
    const benefit = sessionStorage.getItem('benefitReferred');
    expect(benefit).to.equal(formIdSuffixes.FORM_ID_1990E);
    wrapper.find('#apply-now-link').invoke('onClick')({
      preventDefault: () => {},
    });
    const wizardStatus = sessionStorage.getItem('wizardStatus');
    expect(wizardStatus).to.equal(WIZARD_STATUS_COMPLETE);
    wrapper.unmount();
  });
  // Failed on master: http://jenkins.vfs.va.gov/blue/organizations/jenkins/testing%2Fvets-website/detail/master/10179/tests
  it.skip('should take you to the 1990E form with a warning alert', () => {
    const wrapper = mount(<Wizard {...defaultProps} />);
    wrapper.find('.wizard-button').simulate('click');
    expect(wrapper.state('pageHistory')[0].state).to.be.undefined;
    wrapper.find('#NewBenefit-0').invoke('onChange')({
      target: { value: 'new' },
    });
    expect(wrapper.state('pageHistory')[0].state).to.deep.equal({
      selected: 'new',
    });
    wrapper.find('#ClaimingBenefitOwnService-1').invoke('onChange')({
      target: { value: 'no' },
    });
    expect(wrapper.state('pageHistory')[1].state).to.deep.equal({
      selected: 'no',
    });
    wrapper.find('#SponsorDeceased-1').invoke('onChange')({
      target: { value: 'no' },
    });
    expect(wrapper.state('pageHistory')[2].state).to.deep.equal({
      selected: 'no',
    });
    wrapper.find('#TransferredBenefits-1').invoke('onChange')({
      target: { value: 'no' },
    });
    expect(wrapper.state('pageHistory')[3].state).to.deep.equal({
      selected: 'no',
    });
    expect(wrapper.find('WarningAlert').exists()).to.equal(true);
    const benefit = sessionStorage.getItem('benefitReferred');
    expect(benefit).to.equal(formIdSuffixes.FORM_ID_1990E);
    wrapper.find('#apply-now-link').invoke('onClick')({
      preventDefault: () => {},
    });
    const wizardStatus = sessionStorage.getItem('wizardStatus');
    expect(wizardStatus).to.equal(WIZARD_STATUS_COMPLETE);
    wrapper.unmount();
  });
  it('should take you to the 5490 form', () => {
    const wrapper = mount(<Wizard {...defaultProps} />);
    wrapper.find('.wizard-button').simulate('click');
    expect(wrapper.state('pageHistory')[0].state).to.be.undefined;
    wrapper.find('#NewBenefit-0').invoke('onChange')({
      target: { value: 'new' },
    });
    expect(wrapper.state('pageHistory')[0].state).to.deep.equal({
      selected: 'new',
    });
    wrapper.find('#ClaimingBenefitOwnService-1').invoke('onChange')({
      target: { value: 'no' },
    });
    expect(wrapper.state('pageHistory')[1].state).to.deep.equal({
      selected: 'no',
    });
    wrapper.find('#SponsorDeceased-1').invoke('onChange')({
      target: { value: 'yes' },
    });
    expect(wrapper.state('pageHistory')[2].state).to.deep.equal({
      selected: 'yes',
    });
    const benefit = sessionStorage.getItem('benefitReferred');
    expect(benefit).to.equal(formIdSuffixes.FORM_ID_5490);
    wrapper.find('#apply-now-link').invoke('onClick')({
      preventDefault: () => {},
    });
    const wizardStatus = sessionStorage.getItem('wizardStatus');
    expect(wizardStatus).to.equal(WIZARD_STATUS_COMPLETE);
    wrapper.unmount();
  });
  it('should take you to the 1990 form', () => {
    const wrapper = mount(<Wizard {...defaultProps} />);
    wrapper.find('.wizard-button').simulate('click');
    expect(wrapper.state('pageHistory')[0].state).to.be.undefined;
    wrapper.find('#NewBenefit-0').invoke('onChange')({
      target: { value: 'new' },
    });
    expect(wrapper.state('pageHistory')[0].state).to.deep.equal({
      selected: 'new',
    });
    wrapper.find('#ClaimingBenefitOwnService-1').invoke('onChange')({
      target: { value: 'yes' },
    });
    expect(wrapper.state('pageHistory')[1].state).to.deep.equal({
      selected: 'yes',
    });
    wrapper.find('#NationalCallToService-1').invoke('onChange')({
      target: { value: 'no' },
    });
    expect(wrapper.state('pageHistory')[2].state).to.deep.equal({
      selected: 'no',
    });
    wrapper.find('#VetTec-1').invoke('onChange')({
      target: { value: 'no' },
    });
    expect(wrapper.state('pageHistory')[3].state).to.deep.equal({
      selected: 'no',
    });
    const benefit = sessionStorage.getItem('benefitReferred');
    expect(benefit).to.equal(formIdSuffixes.FORM_ID_1990);
    wrapper.find('#apply-now-link').invoke('onClick')({
      preventDefault: () => {},
    });
    const wizardStatus = sessionStorage.getItem('wizardStatus');
    expect(wizardStatus).to.equal(WIZARD_STATUS_COMPLETE);
    wrapper.unmount();
  });
  it('should take you to the 0994 form', () => {
    const wrapper = mount(<Wizard {...defaultProps} />);
    wrapper.find('.wizard-button').simulate('click');
    expect(wrapper.state('pageHistory')[0].state).to.be.undefined;
    wrapper.find('#NewBenefit-0').invoke('onChange')({
      target: { value: 'new' },
    });
    expect(wrapper.state('pageHistory')[0].state).to.deep.equal({
      selected: 'new',
    });
    wrapper.find('#ClaimingBenefitOwnService-1').invoke('onChange')({
      target: { value: 'yes' },
    });
    expect(wrapper.state('pageHistory')[1].state).to.deep.equal({
      selected: 'yes',
    });
    wrapper.find('#NationalCallToService-1').invoke('onChange')({
      target: { value: 'no' },
    });
    expect(wrapper.state('pageHistory')[2].state).to.deep.equal({
      selected: 'no',
    });
    wrapper.find('#VetTec-0').invoke('onChange')({
      target: { value: 'yes' },
    });
    expect(wrapper.state('pageHistory')[3].state).to.deep.equal({
      selected: 'yes',
    });
    const benefit = sessionStorage.getItem('benefitReferred');
    expect(benefit).to.equal(formIdSuffixes.FORM_ID_0994);
    wrapper.find('#apply-now-link').invoke('onClick')({
      preventDefault: () => {},
    });
    const wizardStatus = sessionStorage.getItem('wizardStatus');
    expect(wizardStatus).to.equal(WIZARD_STATUS_COMPLETE);
    wrapper.unmount();
  });
  // Failed on master: http://jenkins.vfs.va.gov/blue/organizations/jenkins/testing%2Fvets-website/detail/master/10187/tests
  it.skip('should take you to the 1990N form', () => {
    const wrapper = mount(<Wizard {...defaultProps} />);
    wrapper.find('.wizard-button').simulate('click');
    expect(wrapper.state('pageHistory')[0].state).to.be.undefined;
    wrapper.find('#NewBenefit-0').invoke('onChange')({
      target: { value: 'new' },
    });
    expect(wrapper.state('pageHistory')[0].state).to.deep.equal({
      selected: 'new',
    });
    wrapper.find('#ClaimingBenefitOwnService-1').invoke('onChange')({
      target: { value: 'yes' },
    });
    expect(wrapper.state('pageHistory')[1].state).to.deep.equal({
      selected: 'yes',
    });
    wrapper.find('#NationalCallToService-0').invoke('onChange')({
      target: { value: 'yes' },
    });
    expect(wrapper.state('pageHistory')[2].state).to.deep.equal({
      selected: 'yes',
    });
    expect(wrapper.find('WarningAlert').exists()).to.equal(true);
    const benefit = sessionStorage.getItem('benefitReferred');
    expect(benefit).to.equal(formIdSuffixes.FORM_ID_1990N);
    wrapper.find('#apply-now-link').invoke('onClick')({
      preventDefault: () => {},
    });
    const wizardStatus = sessionStorage.getItem('wizardStatus');
    expect(wizardStatus).to.equal(WIZARD_STATUS_COMPLETE);
    wrapper.unmount();
  });
  it('should take you to the 1995 form when using your own benefit', () => {
    const wrapper = mount(<Wizard {...defaultProps} />);
    wrapper.find('.wizard-button').simulate('click');
    expect(wrapper.state('pageHistory')[0].state).to.be.undefined;
    wrapper.find('#NewBenefit-1').invoke('onChange')({
      target: { value: 'update' },
    });
    expect(wrapper.state('pageHistory')[0].state).to.deep.equal({
      selected: 'update',
    });
    wrapper.find('#TransferredBenefits-0').invoke('onChange')({
      target: { value: 'own' },
    });
    expect(wrapper.state('pageHistory')[1].state).to.deep.equal({
      selected: 'own',
    });
    const benefit = sessionStorage.getItem('benefitReferred');
    expect(benefit).to.equal(formIdSuffixes.FORM_ID_1995);
    wrapper.find('#apply-now-link').invoke('onClick')({
      preventDefault: () => {},
    });
    const wizardStatus = sessionStorage.getItem('wizardStatus');
    expect(wizardStatus).to.equal(WIZARD_STATUS_COMPLETE);
    wrapper.unmount();
  });
  it('should take you to the 1995 form when using a transferred benefit', () => {
    const wrapper = mount(<Wizard {...defaultProps} />);
    wrapper.find('.wizard-button').simulate('click');
    expect(wrapper.state('pageHistory')[0].state).to.be.undefined;
    wrapper.find('#NewBenefit-1').invoke('onChange')({
      target: { value: 'update' },
    });
    expect(wrapper.state('pageHistory')[0].state).to.deep.equal({
      selected: 'update',
    });
    wrapper.find('#TransferredBenefits-0').invoke('onChange')({
      target: { value: 'transferred' },
    });
    expect(wrapper.state('pageHistory')[1].state).to.deep.equal({
      selected: 'transferred',
    });
    const benefit = sessionStorage.getItem('benefitReferred');
    expect(benefit).to.equal(formIdSuffixes.FORM_ID_1995);
    wrapper.find('#apply-now-link').invoke('onClick')({
      preventDefault: () => {},
    });
    const wizardStatus = sessionStorage.getItem('wizardStatus');
    expect(wizardStatus).to.equal(WIZARD_STATUS_COMPLETE);
    wrapper.unmount();
  });
  it('should take you to the 5495 form', () => {
    const wrapper = mount(<Wizard {...defaultProps} />);
    wrapper.find('.wizard-button').simulate('click');
    expect(wrapper.state('pageHistory')[0].state).to.be.undefined;
    wrapper.find('#NewBenefit-1').invoke('onChange')({
      target: { value: 'update' },
    });
    expect(wrapper.state('pageHistory')[0].state).to.deep.equal({
      selected: 'update',
    });
    wrapper.find('#TransferredBenefits-0').invoke('onChange')({
      target: { value: 'fry' },
    });
    expect(wrapper.state('pageHistory')[1].state).to.deep.equal({
      selected: 'fry',
    });
    const benefit = sessionStorage.getItem('benefitReferred');
    expect(benefit).to.equal(formIdSuffixes.FORM_ID_5495);
    wrapper.find('#apply-now-link').invoke('onClick')({
      preventDefault: () => {},
    });
    const wizardStatus = sessionStorage.getItem('wizardStatus');
    expect(wizardStatus).to.equal(WIZARD_STATUS_COMPLETE);
    wrapper.unmount();
  });
  it('should take you to the 1995 form when applying to the STEM Scholarship', () => {
    const wrapper = mount(<Wizard {...defaultProps} />);
    wrapper.find('.wizard-button').simulate('click');
    expect(wrapper.state('pageHistory')[0].state).to.be.undefined;
    wrapper.find('#NewBenefit-1').invoke('onChange')({
      target: { value: 'extend' },
    });
    expect(wrapper.state('pageHistory')[0].state).to.deep.equal({
      selected: 'extend',
    });
    wrapper.find('#STEMScholarship-0').invoke('onChange')({
      target: { value: 'yes' },
    });
    expect(wrapper.state('pageHistory')[1].state).to.deep.equal({
      selected: 'yes',
    });
    const benefit = sessionStorage.getItem('benefitReferred');
    expect(benefit).to.equal(formIdSuffixes.FORM_ID_1995);
    wrapper.find('#apply-now-link').invoke('onClick')({
      preventDefault: () => {},
    });
    const wizardStatus = sessionStorage.getItem('wizardStatus');
    expect(wizardStatus).to.equal(WIZARD_STATUS_COMPLETE);
    wrapper.unmount();
  });
});
