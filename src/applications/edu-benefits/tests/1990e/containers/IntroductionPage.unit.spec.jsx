import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import { IntroductionPage } from 'applications/edu-benefits/1990e/containers/IntroductionPage';
import {
  WIZARD_STATUS_COMPLETE,
  getWizardStatus,
} from 'applications/static-pages/wizard';

describe('the Edu-Benefit 1990E Introduction Page', () => {
  let defaultProps;

  beforeEach(() => {
    defaultProps = {
      shouldEduBenefits1990EWizardShow: true,
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
    };
  });

  it('should show the wizard on initial render if shouldEduBenefits1990EWizardShow is set to true', () => {
    const wrapper = shallow(<IntroductionPage {...defaultProps} />);
    expect(wrapper.exists('WizardContainer')).to.equal(true);
    expect(wrapper.exists('.subway-map')).to.equal(false);
    wrapper.unmount();
  });
  it('should show the subway map on initial render if shouldEduBenefits1990EWizardShow is set to false', () => {
    const props = {
      ...defaultProps,
      shouldEduBenefits1990EWizardShow: false,
    };
    const wrapper = shallow(<IntroductionPage {...props} />);
    expect(wrapper.exists('WizardContainer')).to.equal(false);
    expect(wrapper.exists('.subway-map')).to.equal(true);
    wrapper.unmount();
  });
  it('should show the subway map if the wizard was completed', () => {
    const wrapper = shallow(<IntroductionPage {...defaultProps} />);
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
