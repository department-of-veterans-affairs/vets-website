import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';

import { CSP_IDS } from '../../../authentication/constants';
import IdentityNotVerified from '../../../authorization/components/IdentityNotVerified';

describe('IdentityNotVerified component', () => {
  let view;
  describe('when only passed a headline prop', () => {
    const headline = 'The alert headline';
    beforeEach(() => {
      view = render(<IdentityNotVerified {...{ headline }} />);
    });
    it('renders the correct alert headline', () => {
      expect(view.getByText(headline)).to.exist;
    });
    it('renders the correct alert content', () => {
      expect(
        view.getByText(/We need you to verify your identity for this account/i),
      ).to.exist;
      expect(view.getByText(/will ask you for certain personal information/i))
        .to.exist;
    });
    it('renders the correct CTA', () => {
      expect(
        view.getByRole('link', { name: 'Verify your identity' }),
      ).to.have.attr('href', '/verify');
    });
    it('renders Learn how to verify your identity link', () => {
      expect(view.getByTestId('verify-identity-link')).to.have.attr(
        'href',
        '/resources/verifying-your-identity-on-vagov/',
      );
    });
  });

  describe('when passed a signInService prop', () => {
    // testing the 3 services that are being deprecated in favor of login.gov and ID.me
    const deprecatingServices = [
      CSP_IDS.DS_LOGON,
      CSP_IDS.MHV_VERBOSE,
      CSP_IDS.MHV,
    ];
    deprecatingServices.forEach(service => {
      it(`renders the correct content for deprecating ${service} based accounts`, () => {
        view = render(
          <IdentityNotVerified {...{ signInService: CSP_IDS.MHV }} />,
        );

        expect(
          view.getByText(
            /haven’t verified your identity for your Login.gov or ID.me account/i,
          ),
        ).to.exist;

        expect(
          view.getByText(
            /Login.gov or ID.me will ask you for certain personal information/i,
          ),
        ).to.exist;
      });
    });

    it('renders the correct content for ID.me based accounts', () => {
      view = render(
        <IdentityNotVerified {...{ signInService: CSP_IDS.ID_ME }} />,
      );
      expect(
        view.getByText(
          /haven’t verified your identity for your ID.me account/i,
        ),
      ).to.exist;

      expect(
        view.getByText(/ID.me will ask you for certain personal information/i),
      ).to.exist;
    });

    it('renders the correct content for Login.gov based accounts', () => {
      view = render(
        <IdentityNotVerified {...{ signInService: CSP_IDS.LOGIN_GOV }} />,
      );
      expect(
        view.getByText(
          /haven’t verified your identity for your Login.gov account/i,
        ),
      ).to.exist;

      expect(
        view.getByText(
          /Login.gov will ask you for certain personal information/i,
        ),
      ).to.exist;
    });

    it('renders the correct content for unknown service based accounts', () => {
      view = render(<IdentityNotVerified />);
      expect(view.getByText(/haven’t verified your identity for your account/i))
        .to.exist;

      expect(
        view.getByText(
          /Your account will ask you for certain personal information/i,
        ),
      ).to.exist;
    });
  });

  describe('when passed a showHelpContent prop', () => {
    it('renders the How to verify your identity link', () => {
      view = render(<IdentityNotVerified {...{ showHelpContent: true }} />);
      expect(view.getByTestId('verify-identity-link')).to.exist;
    });

    it('does not render the How to verify your identity link', () => {
      view = render(<IdentityNotVerified {...{ showHelpContent: false }} />);
      expect(view.queryByTestId('verify-identity-link')).not.to.exist;
    });
  });

  describe('when passed a showVerifyIdenityHelpInfo prop', () => {
    it('renders the Verify Identity Info component', () => {
      view = render(
        <IdentityNotVerified {...{ showVerifyIdenityHelpInfo: true }} />,
      );
      expect(
        view.getByText(
          'Get answers to common questions about verifying your identity',
        ),
      ).to.exist;
    });

    it('does not render the Verify Identity Info component', () => {
      view = render(
        <IdentityNotVerified {...{ showVerifyIdenityHelpInfo: false }} />,
      );
      expect(
        view.queryByText(
          'Get answers to common questions about verifying your identity',
        ),
      ).not.to.exist;
    });
  });

  describe('disableAnalytics prop', () => {
    it('sets <va-alert disable-analyitcs="false" /> (default behavior)', () => {
      const { container } = render(<IdentityNotVerified />);
      const result = container
        .querySelector('va-alert')
        .getAttribute('disable-analytics');
      expect(result).to.eq('false');
    });

    it('sets <va-alert disable-analyitcs="true" />', () => {
      const { container } = render(<IdentityNotVerified disableAnalytics />);
      const result = container
        .querySelector('va-alert')
        .getAttribute('disable-analytics');
      expect(result).to.eq('true');
    });
  });
});
