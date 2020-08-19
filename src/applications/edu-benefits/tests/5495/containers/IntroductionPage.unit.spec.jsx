import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import { IntroductionPage } from 'applications/edu-benefits/5495/containers/IntroductionPage';
import {
  WIZARD_STATUS_COMPLETE,
  getWizardStatus,
} from 'applications/static-pages/wizard';
import { sessionStorageSetup } from 'platform/testing/utilities';

describe('the Edu-Benefit 5495 Introduction Page', () => {
  before(() => {
    sessionStorageSetup();
  });

  afterEach(() => {
    sessionStorage.clear();
  });

  it('should show the wizard on initial render if shouldEduBenefits5495WizardShow is set to true', () => {
    const fakeStore = {
      getState: () => ({
        shouldEduBenefits5495WizardShow: true,
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
  it('should show the subway map on initial render if shouldEduBenefits5495WizardShow is set to false', () => {
    const fakeStore = {
      getState: () => ({
        shouldEduBenefits5495WizardShow: false,
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
        shouldEduBenefits5495WizardShow: false,
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
