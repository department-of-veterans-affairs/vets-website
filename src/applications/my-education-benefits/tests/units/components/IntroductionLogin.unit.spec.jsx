import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';

import SaveInProgressIntro from 'platform/forms/save-in-progress/SaveInProgressIntro';
import { IntroductionLogin } from '../../../components/IntroductionLogin';
import LoadingIndicator from '../../../components/LoadingIndicator';

describe('IntroductionLogin', () => {
  const baseProps = {
    isClaimantCallComplete: true,
    isPersonalInfoFetchFailed: false,
    isLoggedIn: false,
    isLOA3: false,
    route: {
      formConfig: {
        prefillEnabled: true,
        savedFormMessages: {
          notFound: '',
          noAuth: '',
          expired: '',
          saved: '',
          success: '',
        },
      },
      pageList: [{ path: 'introduction' }],
    },
    showHideLoginModal: () => {},
    user: {
      login: {
        hasCheckedKeepAlive: true,
      },
    },
    showMeb1990EZMaintenanceAlert: false,
    showMeb1990EZR6MaintenanceMessage: false,
    showMebEnhancements09: false,
    meb1995Reroute: false,
  };

  it("renders 'signInRequired' va-alert-sign-in variant", () => {
    const wrapper = shallow(<IntroductionLogin {...baseProps} />);
    const alertSignIn = wrapper.find('va-alert-sign-in');

    expect(alertSignIn).to.have.lengthOf(1);
    expect(alertSignIn.prop('variant')).to.equal('signInRequired');
    wrapper.unmount();
  });

  it('never shows the loading indicator', () => {
    const wrapper = shallow(<IntroductionLogin {...baseProps} />);
    const loadingIndicator = wrapper.find(LoadingIndicator);

    expect(loadingIndicator).to.have.lengthOf(0);
    wrapper.unmount();
  });

  it("displays 'Sign in or create an account' on the sign-in button", () => {
    const wrapper = shallow(<IntroductionLogin {...baseProps} />);
    const button = wrapper.find('va-button');

    expect(button).to.have.lengthOf(1);
    expect(button.prop('text')).to.equal('Sign in or create an account');
    wrapper.unmount();
  });

  it('renders SaveInProgressIntro when isLoggedIn and isLOA3 are true and isPersonalInfoFetchFailed and shouldShowMaintenanceAlert are false', () => {
    const wrapper = shallow(
      <IntroductionLogin
        {...baseProps}
        isLoggedIn
        isLOA3
        isPersonalInfoFetchFailed={false}
        showMeb1990EZMaintenanceAlert={false}
      />,
    );
    const saveInProgressIntro = wrapper.find(SaveInProgressIntro);

    expect(saveInProgressIntro).to.have.lengthOf(1);
    expect(saveInProgressIntro.prop('headingLevel')).to.equal(2);
    expect(saveInProgressIntro.prop('hideUnauthedStartLink')).to.be.true;
    expect(saveInProgressIntro.prop('startText')).to.equal(
      'Start your benefits application',
    );
    wrapper.unmount();
  });
});
