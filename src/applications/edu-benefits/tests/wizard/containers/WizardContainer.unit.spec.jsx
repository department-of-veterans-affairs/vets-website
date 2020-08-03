import React from 'react';
import WizardContainer from 'applications/edu-benefits/wizard/containers/WizardContainer';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import {
  getReferredBenefit,
  getWizardStatus,
  WIZARD_STATUS_COMPLETE,
  NO_BENEFIT_REFERRED,
} from 'applications/static-pages/wizard';
import { sessionStorageSetup } from '../../utils';

describe('the Wizard Container', () => {
  let mockStore = {};
  let setWizardStatus;

  before(() => {
    mockStore = sessionStorageSetup(mockStore);
  });

  beforeEach(() => {
    setWizardStatus = value => {
      sessionStorage.setItem('wizardStatus', value);
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
    const wizardStatus = getWizardStatus().then(() => {
      expect(wizardStatus).to.equal(WIZARD_STATUS_COMPLETE);
    });
    const referredBenefit = getReferredBenefit().then(() => {
      // because this test is not running on a browser, it will return the default message
      expect(referredBenefit).to.equal(NO_BENEFIT_REFERRED);
    });
    wrapper.unmount();
  });
});
