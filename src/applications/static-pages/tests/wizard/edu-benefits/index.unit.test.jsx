import React from 'react';
import Wizard, {
  formIdSuffixes,
  WIZARD_STATUS_COMPLETE,
} from '../../../wizard';
import { expect } from 'chai';
import { shallow, mount } from 'enzyme';
import pages from './pages';
import { pageNames } from './pages/pageList';

describe('the Wizard', () => {
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
  it('should take you to the 1990E no warning site', () => {
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
    expect(wrapper.find('WarningAlert')).to.be.empty;
    const benefit = global.sessionStorage.getItem('benefitReferred');
    expect(benefit).to.equal('1990E');
    wrapper.find('#apply-now-link').invoke('onClick')({
      preventDefault: () => {},
    });
    const wizardStatus = global.sessionStorage.getItem('wizardStatus');
    expect(wizardStatus).to.equal(WIZARD_STATUS_COMPLETE);
    wrapper.unmount();
  });
});
