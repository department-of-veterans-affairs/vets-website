import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import { IntroductionPage } from 'applications/edu-benefits/1995/containers/IntroductionPage';
import {
  WIZARD_STATUS_COMPLETE,
  // getWizardStatus,
} from 'platform/site-wide/wizard';

describe('the Edu-Benefit 1995 Introduction Page', () => {
  it('should show the subway map if showWizard is set to false', () => {
    const fakeStore = {
      getState: () => ({
        showWizard: false,
        route: { formConfig: {} },
      }),
      subscribe: () => {},
      dispatch: () => {},
    };

    const wrapper = shallow(<IntroductionPage {...fakeStore.getState()} />);
    expect(wrapper.exists('WizardContainer')).to.equal(false);
    expect(wrapper.exists('.subway-map')).to.equal(true);
    wrapper.unmount();
  });

  it('should show the subway map if the wizard was completed', () => {
    const fakeStore = {
      getState: () => ({
        showWizard: true,
        route: { formConfig: {} },
      }),
      subscribe: () => {},
      dispatch: () => {},
    };

    const wrapper = shallow(<IntroductionPage {...fakeStore.getState()} />);
    const instance = wrapper.instance();
    instance.setWizardStatus(WIZARD_STATUS_COMPLETE);
    // const status = getWizardStatus().then(() => {
    //   expect(status).to.equal(WIZARD_STATUS_COMPLETE);
    // });
    expect(wrapper.exists('WizardContainer')).to.equal(false);
    expect(wrapper.exists('.subway-map')).to.equal(true);
    wrapper.unmount();
  });

  it('should Receive Null if showWizard is undefined', () => {
    const fakeStore = {
      getState: () => ({
        showWizard: undefined,
        route: { formConfig: {} },
      }),
      subscribe: () => {},
      dispatch: () => {},
    };

    const wrapper = shallow(<IntroductionPage {...fakeStore.getState()} />);
    const instance = wrapper.instance();
    instance.setWizardStatus(WIZARD_STATUS_COMPLETE);
    // const status = getWizardStatus().then(() => {
    //   expect(status).to.equal(WIZARD_STATUS_COMPLETE);
    // });
    expect(wrapper.exists('WizardContainer')).to.equal(false);
    wrapper.unmount();
  });
});
