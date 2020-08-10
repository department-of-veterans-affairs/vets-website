import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import { IntroductionPage } from 'applications/edu-benefits/1995/containers/IntroductionPage';
import {
  WIZARD_STATUS_NOT_STARTED,
  WIZARD_STATUS_COMPLETE,
  getWizardStatus,
} from 'applications/static-pages/wizard';
import { sessionStorageSetup } from 'platform/testing/utilities';

describe('the Edu-Benefit 1995 Introduction Page', () => {
  const store = {
    getState: () => ({
      shouldEduBenefits1995WizardShow: true,
      route: {
        formConfig: {},
      },
      saveInProgress: {
        user: {
          login: {},
          profile: {
            services: [],
          },
        },
      },
    }),
    subscribe: () => {},
    dispatch: () => {},
  };
  let defaultProps;

  before(() => {
    sessionStorageSetup();
  });

  beforeEach(() => {
    defaultProps = store.getState();
  });

  afterEach(() => {
    sessionStorage.clear();
  });

  it('should show the wizard on initial render if shouldEduBenefits1995WizardShow is set to true', () => {
    const wrapper = shallow(
      <IntroductionPage store={store} {...defaultProps} />,
    );
    expect(wrapper.exists('WizardContainer')).to.equal(true);
    expect(wrapper.exists('.subway-map')).to.equal(false);
    wrapper.unmount();
  });
  it('should show the subway map on initial render if shouldEduBenefits1995WizardShow is set to false', () => {
    const updatedProps = {
      ...defaultProps,
      shouldEduBenefits1995WizardShow: false,
    };
    const wrapper = shallow(
      <IntroductionPage store={store} {...updatedProps} />,
    );
    expect(wrapper.exists('WizardContainer')).to.equal(false);
    expect(wrapper.exists('.subway-map')).to.equal(true);
    wrapper.unmount();
  });
  it('should show the subway map if the wizard was completed', () => {
    const wrapper = shallow(
      <IntroductionPage store={store} {...defaultProps} />,
    );
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
