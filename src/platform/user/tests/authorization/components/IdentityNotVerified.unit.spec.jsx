import React from 'react';
import { expect } from 'chai';
import { cleanup } from '@testing-library/react';
import { renderInReduxProvider } from 'platform/testing/unit/react-testing-library-helpers';

import { CSP_IDS } from '../../../authentication/constants';
import IdentityNotVerified from '../../../authorization/components/IdentityNotVerified';

describe('IdentityNotVerified component', () => {
  afterEach(cleanup);

  it('renders the correct content for MHV based accounts', () => {
    const { container } = renderInReduxProvider(<IdentityNotVerified />, {
      initialState: {
        user: { profile: { signIn: { serviceName: CSP_IDS.MHV } } },
      },
    });

    const signInAlert = container.querySelector('va-alert-sign-in');
    expect(signInAlert).to.exist;
    expect(signInAlert.getAttribute('variant')).to.eql('signInEither');
    expect(container.querySelectorAll('button').length).to.eql(2);
  });

  it('renders the correct content for ID.me based accounts', () => {
    const { container } = renderInReduxProvider(<IdentityNotVerified />, {
      initialState: {
        user: { profile: { signIn: { serviceName: CSP_IDS.ID_ME } } },
      },
    });

    const signInAlert = container.querySelector('va-alert-sign-in');
    expect(signInAlert).to.exist;
    expect(signInAlert.getAttribute('variant')).to.eql('verifyIdMe');
    expect(container.querySelector('.idme-verify-button')).to.exist;
  });

  it('renders the correct content for Login.gov based accounts', () => {
    const { container } = renderInReduxProvider(<IdentityNotVerified />, {
      initialState: {
        user: { profile: { signIn: { serviceName: CSP_IDS.LOGIN_GOV } } },
      },
    });

    const signInAlert = container.querySelector('va-alert-sign-in');
    expect(signInAlert).to.exist;
    expect(signInAlert.getAttribute('variant')).to.eql('verifyLoginGov');
    expect(container.querySelector('.logingov-verify-button')).to.exist;
  });
});
