import React from 'react';
import {
  SERVICE_PROVIDERS,
  LINK_TYPES,
} from 'platform/user/authentication/constants';
import { expect } from 'chai';
import * as authUtilities from 'platform/user/authentication/utilities';
import AccountLink from 'platform/user/authentication/components/AccountLink';
import { render } from '@testing-library/react';

const csps = ['logingov', 'idme'];

describe.skip('AccountLink', () => {
  csps.forEach(csp => {
    it(`should render correctly for each ${csp}`, async () => {
      const screen = render(<AccountLink csp={csp} />);
      const anchor = await screen.findByTestId(csp);

      expect(anchor.textContent).to.include(
        `Create an account with ${SERVICE_PROVIDERS[csp].label}`,
      );

      screen.unmount();
    });

    it(`should set correct href for ${csp} type=create`, async () => {
      const screen = render(<AccountLink csp={csp} type={LINK_TYPES.CREATE} />);
      const anchor = await screen.findByTestId(csp);
      const href = await authUtilities.signupUrl(csp);

      expect(anchor.href).to.eql(href);
      expect(anchor.textContent).to.include(
        `Create an account with ${SERVICE_PROVIDERS[csp].label}`,
      );

      screen.unmount();
    });

    it(`should set correct href for ${csp} type=signin`, async () => {
      const screen = render(<AccountLink csp={csp} type={LINK_TYPES.SIGNIN} />);
      const anchor = await screen.findByTestId(csp);
      const href = await authUtilities.sessionTypeUrl({ type: csp });

      expect(anchor.href).to.eql(href);
      expect(anchor.textContent).to.include(
        `Sign in with ${SERVICE_PROVIDERS[csp].label} account`,
      );

      screen.unmount();
    });
  });
});
