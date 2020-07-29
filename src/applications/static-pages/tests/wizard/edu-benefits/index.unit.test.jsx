import React from 'react';
import Wizard, {
  formIdSuffixes,
  WIZARD_STATUS_COMPLETE,
} from '../../../wizard';
import { expect } from 'chai';
import { shallow, mount } from 'enzyme';
import pages from './pages';
import { pageNames } from './pages/pageList';

describe('the Education Benefits Wizard', () => {
  const mockStore = {
    sessionStorage: {},
  };

  before(() => {
    global.sessionStorage = {
      getItem: key =>
        key in mockStore.sessionStorage ? mockStore.sessionStorage[key] : null,
      setItem: (key, value) => {
        mockStore.sessionStorage[key] = `${value}`;
      },
      removeItem: key => delete mockStore.sessionStorage[key],
      clear: () => {
        mockStore.sessionStorage = {};
      },
    };
  });
  let defaultProps;
  beforeEach(() => {
    defaultProps = {
      pages,
      expander: true,
      buttonText: 'Start the wizard',
      setBenefitReferred: formId =>
        sessionStorage.setItem('benefitReferred', formId),
      setWizardStatus: value => sessionStorage.setItem('wizardStatus', value),
    };
  });

  afterEach(() => {
    global.sessionStorage.clear();
  });

  it('should initially render the wizard start button', () => {
    const wrapper = shallow(<Wizard {...defaultProps} />);
    expect(wrapper.exists('.wizard-button')).to.equal(true);
    wrapper.unmount();
  });
  it('should take you to the 1990E form with no warning alert', () => {
    const wrapper = mount(<Wizard {...defaultProps} />);
    const instance = wrapper.instance();
    wrapper.find('.wizard-button').simulate('click');
    // eslint-disable-next-line no-unused-expressions
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
    // eslint-disable-next-line no-unused-expressions
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
  it('should take you to the 1990E form with a warning alert', () => {
    const wrapper = mount(<Wizard {...defaultProps} />);
    const instance = wrapper.instance();
    wrapper.find('.wizard-button').simulate('click');
    // eslint-disable-next-line no-unused-expressions
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
    const instance = wrapper.instance();
    wrapper.find('.wizard-button').simulate('click');
    // eslint-disable-next-line no-unused-expressions
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
    const instance = wrapper.instance();
    wrapper.find('.wizard-button').simulate('click');
    // eslint-disable-next-line no-unused-expressions
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
    const instance = wrapper.instance();
    wrapper.find('.wizard-button').simulate('click');
    // eslint-disable-next-line no-unused-expressions
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
  it('should take you to the 1990N form', () => {
    const wrapper = mount(<Wizard {...defaultProps} />);
    const instance = wrapper.instance();
    wrapper.find('.wizard-button').simulate('click');
    // eslint-disable-next-line no-unused-expressions
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
});
