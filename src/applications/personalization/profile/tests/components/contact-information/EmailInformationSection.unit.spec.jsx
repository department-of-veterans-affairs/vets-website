import React from 'react';
import { expect } from 'chai';
import clone from 'lodash/clone';
import set from 'lodash/set';

import vapService from '@@vap-svc/reducers';
import { renderInReduxProvider } from '~/platform/testing/unit/react-testing-library-helpers';

import EmailInformationSection from '../../../components/contact-information/email-addresses/EmailInformationSection';
import {
  CSP_IDS,
  SERVICE_PROVIDERS,
} from '~/platform/user/authentication/constants';

const baseState = {
  user: {
    profile: {
      vapContactInfo: {
        email: {
          emailAddress: 'myemail72585885@unattended.com',
        },
      },
    },
  },
};

const setSignInServiceName = (state, signInServiceName) => {
  return set(
    clone(state),
    'user.profile.signIn.serviceName',
    signInServiceName,
  );
};

describe('EmailInformationSection', () => {
  it('should render Contact email section', () => {
    const view = renderInReduxProvider(<EmailInformationSection />, {
      initialState: baseState,
      reducers: { vapService },
    });

    const baseEmailUsername = baseState.user.profile.vapContactInfo.email.emailAddress.split(
      '@',
    )[0];

    expect(view.getByTestId('email')).to.exist;
    expect(view.getByTestId('email')).to.contain.text(baseEmailUsername);
  });

  it('should render Sign In email section for ID.me', () => {
    const state = setSignInServiceName(baseState, CSP_IDS.ID_ME);
    const view = renderInReduxProvider(<EmailInformationSection />, {
      initialState: state,
      reducers: { vapService },
    });

    const { label } = SERVICE_PROVIDERS[CSP_IDS.ID_ME];

    expect(view.getByTestId('sign-in-email-link')).to.contain.text(label);
  });

  it('should render Sign In email section for LOGIN.GOV', () => {
    const state = setSignInServiceName(baseState, CSP_IDS.LOGIN_GOV);
    const view = renderInReduxProvider(<EmailInformationSection />, {
      initialState: state,
      reducers: { vapService },
    });

    const { label } = SERVICE_PROVIDERS[CSP_IDS.LOGIN_GOV];

    expect(view.getByTestId('sign-in-email-link')).to.contain.text(label);
  });

  it('should not render Sign In email section for MHV', () => {
    const state = setSignInServiceName(baseState, CSP_IDS.MHV);
    const view = renderInReduxProvider(<EmailInformationSection />, {
      initialState: state,
      reducers: { vapService },
    });

    expect(view.queryByTestId('sign-in-email-link')).not.to.exist;
  });

  it('should not render Sign In email section for DS LOGON', () => {
    const state = setSignInServiceName(baseState, CSP_IDS.DS_LOGON);
    const view = renderInReduxProvider(<EmailInformationSection />, {
      initialState: state,
      reducers: { vapService },
    });

    expect(view.queryByTestId('sign-in-email-link')).not.to.exist;
  });
});
