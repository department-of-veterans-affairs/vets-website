import React from 'react';
import WizardContainer from 'applications/edu-benefits/wizard/containers/WizardContainer';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import {
  getReferredBenefit,
  getWizardStatus,
  WIZARD_STATUS,
  WIZARD_STATUS_COMPLETE,
  NO_BENEFIT_REFERRED,
} from 'applications/static-pages/wizard';

describe('the Wizard Container', () => {
  let setWizardStatus;

  beforeEach(() => {
    setWizardStatus = value => {
      sessionStorage.setItem(WIZARD_STATUS, value);
    };
  });

  afterEach(() => {
    global.sessionStorage.clear();
  });

  it('should render', () => {
    const wrapper = shallow(
      <WizardContainer setWizardStatus={setWizardStatus} />,
    );
    expect(wrapper.exists('.wizard-container')).to.equal(true);
    wrapper.unmount();
  });
  it('should set the wizard status to complete and the referred benefit when the skip wizard link is clicked', () => {
    const wrapper = shallow(
      <WizardContainer setWizardStatus={setWizardStatus} />,
    );
    wrapper
      .find('.skip-wizard-link')
      .simulate('click', { preventDefault: () => {} });
    const status = getWizardStatus().then(() => {
      expect(status).to.equal(WIZARD_STATUS_COMPLETE);
    });
    const referredBenefit = getReferredBenefit().then(() => {
      // because this test is not running on a browser, it will return the default message
      expect(referredBenefit).to.equal(NO_BENEFIT_REFERRED);
    });
    wrapper.unmount();
  });
});
