import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import { IntroductionPage } from 'applications/edu-benefits/1990e/containers/IntroductionPage';
import {
  WIZARD_STATUS_COMPLETE,
  getWizardStatus,
} from 'applications/static-pages/wizard';

describe('the Edu-Benefit 1990E Introduction Page', () => {
  it('should show the wizard if showWizard is set to true', () => {
    const fakeStore = {
      getState: () => ({
        showWizard: true,
        route: { formConfig: {} },
      }),
      subscribe: () => {},
      dispatch: () => {},
    };

    const wrapper = shallow(<IntroductionPage {...fakeStore.getState()} />);
    expect(wrapper.exists('WizardContainer')).to.equal(true);
    expect(wrapper.exists('.subway-map')).to.equal(false);
    wrapper.unmount();
  });

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
    const status = getWizardStatus().then(() => {
      expect(status).to.equal(WIZARD_STATUS_COMPLETE);
    });
    expect(wrapper.exists('WizardContainer')).to.equal(false);
    expect(wrapper.exists('.subway-map')).to.equal(true);
    wrapper.unmount();
  });
});
