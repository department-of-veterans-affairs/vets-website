import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import { IntroductionPage } from 'applications/edu-benefits/1995/containers/IntroductionPage';
import {
  WIZARD_STATUS_COMPLETE,
  getWizardStatus,
} from 'applications/static-pages/wizard';

describe('the Edu-Benefit 1995 Introduction Page', () => {
  it('should show the wizard on initial render if shouldEduBenefits1995WizardShow is set to true', () => {
    const fakeStore = {
      getState: () => ({
        shouldEduBenefits1995WizardShow: true,
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

  it('should show the subway map on initial render if shouldEduBenefits1995WizardShow is set to false', () => {
    const fakeStore = {
      getState: () => ({
        shouldEduBenefits1995WizardShow: false,
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
        shouldEduBenefits1995WizardShow: true,
        route: { formConfig: {} },
      }),
      subscribe: () => {},
      dispatch: () => {},
    };

    const wrapper = shallow(<IntroductionPage {...fakeStore.getState()} />);
    const instance = wrapper.instance();
    instance.setWizardStatus(WIZARD_STATUS_COMPLETE);
    const wizardStatus = getWizardStatus().then(() => {
      expect(wizardStatus).to.equal(WIZARD_STATUS_COMPLETE);
    });
    expect(wrapper.exists('WizardContainer')).to.equal(false);
    expect(wrapper.exists('.subway-map')).to.equal(true);
    wrapper.unmount();
  });
});
