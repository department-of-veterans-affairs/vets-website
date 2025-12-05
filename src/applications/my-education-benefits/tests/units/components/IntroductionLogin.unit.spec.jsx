import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';

import { IntroductionLogin } from '../../../components/IntroductionLogin';

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

  it("renders 'signInRequired' va-alert-sign-in variant when meb1995Reroute is true", () => {
    const wrapper = shallow(
      <IntroductionLogin {...baseProps} meb1995Reroute />,
    );
    const alertSignIn = wrapper.find('va-alert-sign-in');

    expect(alertSignIn).to.have.lengthOf(1);
    expect(alertSignIn.prop('variant')).to.equal('signInRequired');
    wrapper.unmount();
  });

  it("renders 'signInOptional' va-alert-sign-in variant when meb1995Reroute is false", () => {
    const wrapper = shallow(
      <IntroductionLogin {...baseProps} meb1995Reroute={false} />,
    );
    const alertSignIn = wrapper.find('va-alert-sign-in');

    expect(alertSignIn).to.have.lengthOf(1);
    expect(alertSignIn.prop('variant')).to.equal('signInOptional');
    wrapper.unmount();
  });
});
