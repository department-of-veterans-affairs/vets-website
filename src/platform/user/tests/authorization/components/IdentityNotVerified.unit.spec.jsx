import React from 'react';
import { expect } from 'chai';
import { cleanup } from '@testing-library/react';
import { renderInReduxProvider } from 'platform/testing/unit/react-testing-library-helpers';

import { CSP_IDS } from '../../../authentication/constants';
import IdentityNotVerified from '../../../authorization/components/IdentityNotVerified';

describe('IdentityNotVerified component', () => {
  const initialState = {
    user: { profile: { signIn: { serviceName: 'idme' } } },
  };

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

  describe('when passed a showHelpContent prop', () => {
    it('renders the How to verify your identity link', () => {
      const { getByTestId } = renderInReduxProvider(
        <IdentityNotVerified showHelpContent />,
        { initialState },
      );
      expect(getByTestId('verify-identity-link')).to.exist;
    });

    it('does not render the How to verify your identity link', () => {
      const { queryByTestId } = renderInReduxProvider(
        <IdentityNotVerified showHelpContent={false} />,
        { initialState },
      );
      expect(queryByTestId('verify-identity-link')).not.to.exist;
    });
  });

  describe('when passed a showHelpContent prop', () => {
    it('renders the How to verify your identity link', () => {
      const { getByText } = renderInReduxProvider(
        <IdentityNotVerified showVerifyIdenityHelpInfo />,
        { initialState },
      );
      expect(
        getByText(
          'Get answers to common questions about verifying your identity',
        ),
      ).to.exist;
    });

    it('does not render the How to verify your identity link', () => {
      const { queryByText } = renderInReduxProvider(
        <IdentityNotVerified showVerifyIdenityHelpInfo={false} />,
        { initialState },
      );
      expect(
        queryByText(
          'Get answers to common questions about verifying your identity',
        ),
      ).not.to.exist;
    });
  });
});
