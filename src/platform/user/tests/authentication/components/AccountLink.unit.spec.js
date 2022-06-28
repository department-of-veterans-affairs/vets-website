import React from 'react';
import { CSP_CONTENT } from 'platform/user/authentication/constants';
import { expect } from 'chai';
import * as authUtilities from 'platform/user/authentication/utilities';
import CreateAccountLink, {
  SignInAccountLink,
} from 'platform/user/authentication/components/AccountLink';
import { render } from '@testing-library/react';

const csps = ['logingov', 'idme'];

describe('CreateAccountLink', () => {
  csps.forEach(csp => {
    it(`should render correctly for each ${csp}`, async () => {
      const screen = render(<CreateAccountLink csp={csp} />);
      const anchor = await screen.findByTestId(csp);

      expect(anchor.textContent).to.include(
        `Create an account with ${CSP_CONTENT[csp].COPY}`,
      );

      screen.unmount();
    });

    it(`should set correct href for ${csp} Sign up`, async () => {
      const screen = render(<CreateAccountLink csp={csp} />);
      const anchor = await screen.findByTestId(csp);
      const href = await authUtilities.signupUrl(csp);

      expect(anchor.href).to.eql(href);
      expect(anchor.textContent).to.include(
        `Create an account with ${CSP_CONTENT[csp].COPY}`,
      );

      screen.unmount();
    });
  });
});

describe('SignInAccountLink', () => {
  csps.forEach(csp => {
    it(`should render correctly for each ${csp}`, async () => {
      const screen = render(<SignInAccountLink csp={csp} />);
      const anchor = await screen.findByTestId(csp);

      expect(anchor.textContent).to.include(
        `Sign in with ${CSP_CONTENT[csp].COPY} account`,
      );

      screen.unmount();
    });

    it(`should set correct href for ${csp} Login`, async () => {
      const screen = render(<SignInAccountLink csp={csp} />);
      const anchor = await screen.findByTestId(csp);
      const href = await authUtilities.sessionTypeUrl({ type: csp });

      expect(anchor.href).to.eql(href);
      expect(anchor.textContent).to.include(
        `Sign in with ${CSP_CONTENT[csp].COPY} account`,
      );

      screen.unmount();
    });
  });
});
