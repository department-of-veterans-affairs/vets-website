import React from 'react';
import WizardContainer from '../../../wizard/containers/WizardContainer';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import {
  getReferredBenefit,
  getWizardStatus,
  WIZARD_STATUS_COMPLETE,
  NO_BENEFIT_REFERRED,
} from '../../../../static-pages/wizard';

describe('WizardContainer', () => {
  const mockStore = {
    sessionStorage: {},
  };
  let setWizardStatus;

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
